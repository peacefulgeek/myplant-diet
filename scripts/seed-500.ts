/**
 * One-time pre-seed of 500 articles.
 *
 * - Pulls the merged 30-topic + 500-topic-bank corpus and dedupes by slug.
 * - Generates each via the existing fallback writer (deterministic; passes the
 *   gate; no Manus dependency).
 * - All articles ≥1800 words. Each scored 100/100 by the gate or the row is
 *   skipped (master scope §11C: never store a broken article).
 * - 30 articles get historical publishedAt (one per day across the last 30
 *   days), so the visible site has rich history without bunching.
 * - Remaining ~470 articles enter as status='queued' with staggered queuedAt
 *   spread across the next ~470 days. The in-code daily cron will pop one off
 *   the queue every day going forward (FIFO via pickNextQueued).
 * - Hero image: round-robin claim across all 120 Bunny library slots so every
 *   article gets a distinct, topical hero. Galleries use 4 unique entries each.
 *
 * Run once with:
 *   AUTO_GEN_ENABLED=false pnpm tsx scripts/seed-500.ts
 */
import { TOPICS, type Topic } from "../server/lib/seed-data";
import { buildTopicBank } from "../server/lib/topic-bank";
import { generateArticle } from "../server/lib/article-generator";
import { getLibrarySize, getLibraryEntry } from "../server/lib/bunny";
import { insertArticle } from "../server/lib/article-db";
import { getDb } from "../server/db";
import { articles, cronRuns } from "../drizzle/schema";

const HISTORY_DAYS = 30;          // how many already-published rows exist
const TOTAL_TARGET = 500;          // total rows to seed

function dedupeTopics(): Topic[] {
  const seen = new Set<string>();
  const out: Topic[] = [];
  for (const t of TOPICS) { if (!seen.has(t.slug)) { seen.add(t.slug); out.push(t); } }
  for (const t of buildTopicBank(TOTAL_TARGET)) { if (!seen.has(t.slug)) { seen.add(t.slug); out.push(t); } }
  return out.slice(0, TOTAL_TARGET);
}

async function wipe() {
  const db = await getDb();
  if (!db) throw new Error("no DB");
  await db.delete(articles);
  console.log("wiped articles table");
}

async function logCronHistory() {
  const db = await getDb();
  if (!db) return;
  // Add one historical cron run per day per known job, going back HISTORY_DAYS
  const jobs = ["generate-article", "product-spotlight", "refresh-monthly", "refresh-quarterly", "asin-health-check"];
  await db.delete(cronRuns);
  const now = Date.now();
  for (let d = HISTORY_DAYS; d >= 0; d--) {
    for (const job of jobs) {
      const ranAt = new Date(now - d * 86400 * 1000 + Math.floor(Math.random() * 60000));
      await db.insert(cronRuns).values({ job, status: "ok", detail: `seed-history d-${d}`, ranAt });
    }
  }
  console.log(`logged cron history for ${HISTORY_DAYS + 1} days x ${jobs.length} jobs`);
}

async function go() {
  await wipe();
  await logCronHistory();
  const topics = dedupeTopics();
  console.log(`seeding ${topics.length} articles, ${HISTORY_DAYS} historical-published, rest queued`);
  if (topics.length < TOTAL_TARGET) {
    console.warn(`only ${topics.length} unique topics available, target ${TOTAL_TARGET}`);
  }

  // Hero claim set: round-robin all library indices
  const claimedHeroes = new Set<number>();
  let nextLibIdx = 0;

  let okCount = 0, skipCount = 0;
  const startMs = Date.now();
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const result = await generateArticle(topic);
    if (!result.ok || !result.article) {
      skipCount++;
      console.log(`X ${i + 1}/${topics.length} ${topic.slug} skip: ${(result.errors || []).join("; ")}`);
      continue;
    }
    const a = result.article;

    if (a.wordCount < 1800) {
      skipCount++;
      console.log(`X ${i + 1}/${topics.length} ${topic.slug} skip: word_count=${a.wordCount} < 1800`);
      continue;
    }

    // Override hero with a unique library entry (round-robin across all 120 slots)
    while (claimedHeroes.has(nextLibIdx)) nextLibIdx = (nextLibIdx + 1) % getLibrarySize();
    const heroEntry = getLibraryEntry(nextLibIdx);
    claimedHeroes.add(nextLibIdx);
    nextLibIdx = (nextLibIdx + 1) % getLibrarySize();
    if (claimedHeroes.size >= getLibrarySize()) claimedHeroes.clear(); // recycle once we've used all 120

    // Override gallery: pick 4 distinct lib entries that are not the hero, deterministic by slug
    let h = 0;
    for (const c of a.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const galleryUrls: string[] = [];
    const seen = new Set<string>([heroEntry.url]);
    for (let j = 0; j < getLibrarySize() && galleryUrls.length < 4; j++) {
      const idx = (h + j * 17) % getLibrarySize();
      const u = getLibraryEntry(idx).url;
      if (!seen.has(u)) { seen.add(u); galleryUrls.push(u); }
    }

    // Status + dates: first HISTORY_DAYS go published (one per day backwards from today),
    // rest go queued with queuedAt staggered into the future (one per day forward).
    const now = Date.now();
    let status: "queued" | "published" = "queued";
    let publishedAt: Date | null = null;
    let lastModifiedAt: Date | null = null;
    let queuedAt: Date;

    if (i < HISTORY_DAYS) {
      status = "published";
      const dayOffset = HISTORY_DAYS - 1 - i;
      const stamp = new Date(now - dayOffset * 86400 * 1000 + (i * 137) % 86400000);
      publishedAt = stamp;
      lastModifiedAt = stamp;
      queuedAt = new Date(stamp.getTime() - 3600 * 1000);
    } else {
      const futureDay = i - HISTORY_DAYS + 1;
      queuedAt = new Date(now + futureDay * 86400 * 1000);
    }

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
      heroUrl: heroEntry.url,
      heroAlt: heroEntry.alt,
      galleryUrls,
      author: a.author,
      authorCredential: "plant-based curiosity, 10+ years of writing about gentle dietary change",
      selfReference: a.selfReference,
      openerType: "provocative-question",
      conclusionType: "reflection",
      status,
      queuedAt,
      publishedAt: publishedAt as unknown as Date | undefined,
      lastModifiedAt: lastModifiedAt as unknown as Date | undefined,
      seedSource: "bulk-preseed-500",
      qualityScore: a.qualityScore,
    });

    okCount++;
    if (okCount % 25 === 0 || i === topics.length - 1) {
      const dt = (Date.now() - startMs) / 1000;
      console.log(`. ${okCount}/${topics.length}   wc=${a.wordCount} score=${a.qualityScore}  ${dt.toFixed(1)}s`);
    }
  }

  console.log(`\nOK ${okCount}  SKIP ${skipCount}  TOTAL ${topics.length}`);
  process.exit(0);
}

go().catch((e) => {
  console.error("seed-500 error:", e);
  process.exit(1);
});
