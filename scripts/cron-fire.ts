import "dotenv/config";
import mysql from "mysql2/promise";
const c = await mysql.createConnection({ uri: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const [rows] = await c.execute("SELECT id,slug FROM articles WHERE status='queued' ORDER BY queuedAt ASC LIMIT 1") as any;
if (!rows.length) { console.log("no queued"); process.exit(0); }
const next = rows[0];
await c.execute("UPDATE articles SET status='published', publishedAt=NOW(), lastModifiedAt=NOW() WHERE id=?", [next.id]);
await c.execute("INSERT INTO cronRuns (job, status, detail) VALUES (?,?,?)", ["phase-publisher-09","ok",`published #${next.id} (${next.slug})`]);
console.log("published", next.slug);
await c.end();
