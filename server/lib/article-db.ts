import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  articles,
  cronRuns,
  savedArticles,
  type Article,
  type InsertArticle,
} from "../../drizzle/schema";

/**
 * Fetch a single published article by slug. NEVER returns queued rows.
 */
export async function getPublishedBySlug(slug: string): Promise<Article | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * List published articles, newest-first.
 */
export async function listPublished(limit = 24, offset = 0): Promise<Article[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
  return rows;
}

/**
 * Count published articles. Used for phase logic.
 */
export async function countPublished(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(articles)
    .where(eq(articles.status, "published"));
  return Number(rows[0]?.c ?? 0);
}

/**
 * Pick the oldest queued article (FIFO release).
 */
export async function pickNextQueued(): Promise<Article | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "queued"))
    .orderBy(articles.queuedAt)
    .limit(1);
  return rows[0] ?? null;
}

export async function publishArticle(id: number, heroUrl: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(articles)
    .set({
      status: "published",
      publishedAt: new Date(),
      lastModifiedAt: new Date(),
      heroUrl,
    })
    .where(eq(articles.id, id));
}

export async function insertArticle(values: InsertArticle): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(articles).values(values);
}

export async function logCronRun(
  job: string,
  status: "ok" | "skipped" | "error",
  detail = ""
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(cronRuns).values({ job, status, detail });
}

export async function listCronRuns(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cronRuns).orderBy(desc(cronRuns.ranAt)).limit(limit);
}

export async function listSavedFor(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      article: articles,
      savedAt: savedArticles.savedAt,
    })
    .from(savedArticles)
    .innerJoin(articles, eq(articles.id, savedArticles.articleId))
    .where(eq(savedArticles.userId, userId))
    .orderBy(desc(savedArticles.savedAt));
}

export async function toggleSaved(userId: number, articleId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select()
    .from(savedArticles)
    .where(and(eq(savedArticles.userId, userId), eq(savedArticles.articleId, articleId)))
    .limit(1);
  if (existing.length > 0) {
    await db
      .delete(savedArticles)
      .where(and(eq(savedArticles.userId, userId), eq(savedArticles.articleId, articleId)));
    return false;
  }
  await db.insert(savedArticles).values({ userId, articleId });
  return true;
}
