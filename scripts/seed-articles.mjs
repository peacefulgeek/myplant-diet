// Seed the entire topic list, publishing 14 with backdated publishedAt over the
// past 14 days (1/day) so the corpus shows real history, and queue the rest.
import "dotenv/config";
import mysql from "mysql2/promise";
import { generateArticle } from "../dist/lib/article-generator.js";
import { TOPICS } from "../dist/lib/seed-data.js";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: false } });

console.log(`Seeding ${TOPICS.length} topics...`);

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

for (let i = 0; i < TOPICS.length; i++) {
  const topic = TOPICS[i];
  const [exists] = await conn.execute("SELECT id FROM articles WHERE slug = ? LIMIT 1", [topic.slug]);
  if (exists.length > 0) {
    console.log(`  [skip] ${topic.slug} already exists`);
    continue;
  }
  const result = await generateArticle(topic);
  if (!result.ok || !result.article) {
    console.log(`  [fail] ${topic.slug}: ${(result.errors || []).join("; ")}`);
    continue;
  }
  const a = result.article;

  // First 14 articles: published, backdated 1/day over past 14 days.
  // Articles 14+: queued, ready to flip via cron.
  const isPublished = i < 14;
  const publishedAt = isPublished ? new Date(now - (13 - i) * dayMs) : null;
  const status = isPublished ? "published" : "queued";

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
      new Date(now - (TOPICS.length - i) * 60 * 60 * 1000),
      publishedAt,
      publishedAt,
      a.seedSource,
      a.qualityScore,
    ]
  );
  console.log(
    `  [${status}] ${topic.slug}  score=${a.qualityScore} attempts=${result.attempts}` +
      (publishedAt ? ` @ ${publishedAt.toISOString().slice(0, 10)}` : "")
  );
}

const [counts] = await conn.execute(
  "SELECT status, COUNT(*) as c FROM articles GROUP BY status"
);
console.log("Final counts:", counts);

await conn.end();
console.log("Done.");
