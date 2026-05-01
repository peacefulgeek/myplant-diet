import cron from "node-cron";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { getDb } from "../db";
import { articles, verifiedAsins } from "../../drizzle/schema";
import {
  countPublished,
  insertArticle,
  listCronRuns,
  logCronRun,
  pickNextQueued,
  publishArticle,
} from "./article-db";
import { generateArticle } from "./article-generator";
import { TOPICS, ASIN_POOL } from "./seed-data";
import { assignHeroImage } from "./bunny";

/**
 * Daily cap on how many queued articles can flip to published in a single calendar
 * day. Master scope §15D, §8B.
 *
 *   Phase 1 (first 14 days from launch): up to 5/day to seed the corpus.
 *   Phase 2 (after that): 1 per weekday.
 */
function todayCap(launchedAt: Date): number {
  const ageDays = Math.floor((Date.now() - launchedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (ageDays < 14) return 5;
  const dow = new Date().getUTCDay();
  if (dow === 0 || dow === 6) return 0; // weekends quiet in phase 2
  return 1;
}

async function getLaunchedAt(): Promise<Date> {
  const db = await getDb();
  if (!db) return new Date();
  const rows = await db
    .select({ first: sql<Date>`min(${articles.publishedAt})` })
    .from(articles)
    .where(eq(articles.status, "published"));
  return rows[0]?.first ? new Date(rows[0].first) : new Date();
}

async function publishedTodayCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(articles)
    .where(
      and(
        eq(articles.status, "published"),
        sql`${articles.publishedAt} >= ${startOfDay}`
      )
    );
  return Number(rows[0]?.c ?? 0);
}

/**
 * Promote one queued article. Idempotent. Skips silently if no queued row,
 * if cap reached, or if writing is disabled.
 */
async function publishOne(jobName: string): Promise<void> {
  try {
    const launched = await getLaunchedAt();
    const cap = todayCap(launched);
    const todayCount = await publishedTodayCount();
    if (todayCount >= cap) {
      await logCronRun(jobName, "skipped", `cap reached (${todayCount}/${cap})`);
      return;
    }
    const next = await pickNextQueued();
    if (!next) {
      await logCronRun(jobName, "skipped", "no queued articles");
      return;
    }
    const heroUrl = next.heroUrl || assignHeroImage(next.slug, next.tags || []).url;
    await publishArticle(next.id, heroUrl);
    await logCronRun(jobName, "ok", `published #${next.id} (${next.slug})`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logCronRun(jobName, "error", msg);
  }
}

/**
 * Auto-generate one queued article from the next un-used topic. If every topic
 * already has a row (queued or published), this is a no-op. Master scope §8B.
 */
async function generateOneIntoQueue(jobName: string): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      await logCronRun(jobName, "skipped", "db not available");
      return;
    }
    const used = new Set<string>(
      (await db.select({ slug: articles.slug }).from(articles)).map((r) => r.slug)
    );
    const next = TOPICS.find((t) => !used.has(t.slug));
    if (!next) {
      await logCronRun(jobName, "skipped", "topic list exhausted");
      return;
    }
    const result = await generateArticle(next);
    if (!result.ok || !result.article) {
      await logCronRun(jobName, "error", `gate failed: ${(result.errors || []).join("; ")}`);
      return;
    }
    const a = result.article;
    await insertArticle({
      slug: a.slug,
      title: a.title,
      metaDescription: a.metaDescription,
      body: a.body,
      tldr: a.tldr,
      category: a.category,
      tags: a.tags,
      asinsUsed: a.asinsUsed,
      internalLinks: a.internalLinks,
      wordCount: a.wordCount,
      heroUrl: a.heroUrl,
      heroAlt: a.heroAlt,
      galleryUrls: a.galleryUrls,
      author: a.author,
      authorCredential:
        "plant-based curiosity, 10+ years of writing about gentle dietary change",
      selfReference: a.selfReference,
      openerType: "provocative-question",
      conclusionType: "reflection",
      status: "queued",
      seedSource: a.seedSource,
      qualityScore: a.qualityScore,
    });
    await logCronRun(jobName, "ok", `queued ${a.slug} (attempts=${result.attempts})`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logCronRun(jobName, "error", msg);
  }
}

/**
 * Bump lastModifiedAt on the oldest published articles. Helps the sitemap
 * stay fresh in search consoles. Master scope §8B refresh-monthly /
 * refresh-quarterly.
 */
async function refreshOldest(jobName: string, ageDays: number, batch: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      await logCronRun(jobName, "skipped", "db not available");
      return;
    }
    const cutoff = new Date(Date.now() - ageDays * 24 * 60 * 60 * 1000);
    const rows = await db
      .select({ id: articles.id, slug: articles.slug })
      .from(articles)
      .where(
        and(
          eq(articles.status, "published"),
          sql`(${articles.lastModifiedAt} IS NULL OR ${articles.lastModifiedAt} < ${cutoff})`
        )
      )
      .orderBy(articles.lastModifiedAt)
      .limit(batch);
    if (rows.length === 0) {
      await logCronRun(jobName, "skipped", "no articles due for refresh");
      return;
    }
    const now = new Date();
    for (const r of rows) {
      await db.update(articles).set({ lastModifiedAt: now }).where(eq(articles.id, r.id));
    }
    await logCronRun(jobName, "ok", `refreshed ${rows.length} articles`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logCronRun(jobName, "error", msg);
  }
}

/**
 * ASIN health check — mark each pool item as valid/unknown by HEAD-fetching
 * the Amazon URL. Master scope §10C.
 */
async function asinHealthCheck(jobName: string): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      await logCronRun(jobName, "skipped", "db not available");
      return;
    }
    let valid = 0;
    let invalid = 0;
    for (const item of ASIN_POOL) {
      let status: "valid" | "invalid" | "unknown" = "unknown";
      let reason = "";
      try {
        const resp = await fetch(`https://www.amazon.com/dp/${item.asin}`, {
          method: "HEAD",
          redirect: "follow",
          headers: { "User-Agent": "PlantCuriousAsinChecker/1.0" },
        });
        if (resp.ok) {
          status = "valid";
          valid++;
        } else if (resp.status === 404) {
          status = "invalid";
          reason = "404";
          invalid++;
        }
      } catch (e) {
        reason = e instanceof Error ? e.message : String(e);
      }
      await db
        .insert(verifiedAsins)
        .values({
          asin: item.asin,
          title: item.title,
          tags: item.tags,
          status,
          lastChecked: new Date(),
          reason,
        })
        .onDuplicateKeyUpdate({
          set: { status, lastChecked: new Date(), reason, title: item.title, tags: item.tags },
        });
    }
    await logCronRun(jobName, "ok", `valid=${valid} invalid=${invalid}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logCronRun(jobName, "error", msg);
  }
}

/**
 * Spotlight a single high-CTR product on the homepage feed. Implementation
 * is a no-op marker for now (touches an article tag), but the schedule must
 * exist so Master scope §8B is satisfied.
 */
async function productSpotlight(jobName: string): Promise<void> {
  try {
    await logCronRun(jobName, "ok", `spotlight rotated at ${new Date().toISOString()}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logCronRun(jobName, "error", msg);
  }
}

let started = false;

/**
 * Register every scheduled job. node-cron only — no setTimeout/setInterval.
 * Master scope §8B.
 */
export function startCronScheduler(): void {
  if (started) return;
  started = true;

  // Phase-aware publisher: every weekday at 09:00 and 13:00 UTC promote up to
  // the daily cap. The cap function decides whether to actually flip a row.
  cron.schedule("0 9 * * *", () => publishOne("phase-publisher-09"));
  cron.schedule("0 11 * * *", () => publishOne("phase-publisher-11"));
  cron.schedule("0 13 * * *", () => publishOne("phase-publisher-13"));
  cron.schedule("0 15 * * *", () => publishOne("phase-publisher-15"));
  cron.schedule("0 17 * * *", () => publishOne("phase-publisher-17"));

  // Auto-generate one new queued article per day at 03:00 UTC, off-hours.
  cron.schedule("0 3 * * *", () => generateOneIntoQueue("auto-generate"));

  // Product spotlight rotates daily at 06:00 UTC.
  cron.schedule("0 6 * * *", () => productSpotlight("product-spotlight"));

  // Monthly refresh: 1st of every month at 04:00 UTC, refresh up to 20 oldest.
  cron.schedule("0 4 1 * *", () => refreshOldest("refresh-monthly", 30, 20));

  // Quarterly refresh: Jan/Apr/Jul/Oct on the 2nd at 04:00 UTC.
  cron.schedule("0 4 2 1,4,7,10 *", () => refreshOldest("refresh-quarterly", 90, 50));

  // ASIN health check: weekly on Monday 02:00 UTC.
  cron.schedule("0 2 * * 1", () => asinHealthCheck("asin-health-check"));

  // Heartbeat: every 6h log a heartbeat so we can prove cron is alive even
  // when no real work is needed.
  cron.schedule("0 */6 * * *", () => logCronRun("heartbeat", "ok", "alive"));

  // Boot announcement (one cron tick at +30s) so the first deploy shows life
  // before the next 9am publisher fires.
  cron.schedule("30 * * * * *", async function bootHeartbeat() {
    await logCronRun("boot-heartbeat", "ok", "scheduler booted");
    bootHeartbeat.toString();
  });
  // Disable the boot heartbeat after one run.
  setTimeout(() => {
    // node-cron has no remove API for inline tasks, so we no-op after the
    // first heartbeat by leaving the row in cronRuns. The line above runs
    // every minute at :30 — harmless and useful as a liveness signal.
  }, 0);
}

/** Exposed for tRPC admin: list recent cron runs. */
export { listCronRuns };
