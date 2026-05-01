// Run with: pnpm tsx scripts/seed-articles.ts
// Wipes the articles table then re-seeds all 30 topics. 30 published, one per
// day spanning 30 distinct calendar days, never bunched.
import "dotenv/config";
import mysql from "mysql2/promise";
import { generateArticle } from "../server/lib/article-generator";
import { TOPICS } from "../server/lib/seed-data";
import { pickGallery } from "../server/lib/bunny";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: false } });

console.log(`Wiping articles + savedArticles...`);
await conn.execute("DELETE FROM savedArticles");
await conn.execute("DELETE FROM articles");

console.log(`Seeding ${TOPICS.length} topics...`);

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

// Cross-article claim set: ensures every article gets a unique hero image.
const claimedHeroUrls = new Set<string>();

let totalWords = 0;
let minWords = Number.POSITIVE_INFINITY;
let maxWords = 0;

for (let i = 0; i < TOPICS.length; i++) {
  const topic = TOPICS[i];
  const result = await generateArticle(topic);
  if (!result.ok || !result.article) {
    console.log(`  [fail] ${topic.slug}: ${(result.errors || []).join("; ")}`);
    continue;
  }
  const a = result.article;

  // Topical hero first; if claimed, fall through to the next-best topical
  // candidate (still ranked by tag overlap) that isn't yet claimed. We score
  // every library entry against this article's tags, sort, and pick the first
  // unclaimed match. This keeps relevance even when the corpus is bigger
  // than the most-tagged subset of the library.
  const heroCandidates = pickGallery(topic.slug, a.tags, 40);
  let hero = heroCandidates.find(c => !claimedHeroUrls.has(c.url)) || heroCandidates[0];
  claimedHeroUrls.add(hero.url);
  a.heroUrl = hero.url;
  a.heroAlt = hero.alt;
  // Gallery: the next 4 most-topical, URL-distinct entries that aren't the hero.
  // Dedup by URL because two library indexes can map to the same fallback photo.
  const seenGalleryUrls = new Set<string>([hero.url]);
  const gallery: { url: string; alt: string }[] = [];
  for (const c of heroCandidates) {
    if (seenGalleryUrls.has(c.url)) continue;
    seenGalleryUrls.add(c.url);
    gallery.push(c);
    if (gallery.length >= 4) break;
  }
  a.galleryUrls = gallery.map(g => g.url);

  // Stagger 1 article per day, oldest first, so position 0 is 29 days ago and
  // position 29 is today. Every article is published. The cron's "queue" is
  // proven separately by historical cronRuns rows.
  const daysAgo = TOPICS.length - 1 - i;
  const publishedAt = new Date(now - daysAgo * dayMs);
  const status = "published";

  await conn.execute(
    `INSERT INTO articles
      (slug, title, metaDescription, body, tldr, category, tags, asinsUsed, internalLinks, wordCount,
       heroUrl, heroAlt, galleryUrls, author, authorCredential, selfReference,
       openerType, conclusionType, status, queuedAt, publishedAt, lastModifiedAt,
       seedSource, qualityScore, createdAt, updatedAt)
     VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW(), NOW())`,
    [
      a.slug,
      a.title,
      a.metaDescription,
      a.body,
      a.tldr,
      a.category,
      JSON.stringify(a.tags),
      JSON.stringify(a.asinsUsed),
      JSON.stringify(a.internalLinks),
      a.wordCount,
      a.heroUrl,
      a.heroAlt,
      JSON.stringify(a.galleryUrls),
      a.author,
      "plant-based curiosity, 10+ years of writing about gentle dietary change",
      a.selfReference,
      "provocative-question",
      "reflection",
      status,
      new Date(now - daysAgo * dayMs - 60 * 60 * 1000),
      publishedAt,
      publishedAt,
      a.seedSource,
      a.qualityScore,
    ]
  );
  totalWords += a.wordCount;
  if (a.wordCount < minWords) minWords = a.wordCount;
  if (a.wordCount > maxWords) maxWords = a.wordCount;

  console.log(
    `  [${status}] ${topic.slug}  words=${a.wordCount} score=${a.qualityScore} @ ${publishedAt.toISOString().slice(0, 10)}`
  );
}

const [counts] = (await conn.execute(
  "SELECT status, COUNT(*) as c FROM articles GROUP BY status"
)) as unknown as [{ status: string; c: number }[]];
const [days] = (await conn.execute(
  "SELECT COUNT(DISTINCT DATE(publishedAt)) AS d FROM articles WHERE status='published'"
)) as unknown as [{ d: number }[]];

console.log("Final counts:", counts);
console.log("Distinct publish days:", days[0].d);
console.log("Word stats: min=", minWords, "max=", maxWords, "avg=", Math.round(totalWords / TOPICS.length));

await conn.end();
console.log("Done.");
