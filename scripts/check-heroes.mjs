import "dotenv/config";
import mysql from "mysql2/promise";
const c = await mysql.createConnection({ uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const [rows] = await c.execute("SELECT slug, heroUrl FROM articles WHERE status='published' ORDER BY heroUrl");
const grp = new Map();
for (const r of rows) {
  if (!grp.has(r.heroUrl)) grp.set(r.heroUrl, []);
  grp.get(r.heroUrl).push(r.slug);
}
for (const [k, v] of grp.entries()) {
  if (v.length > 1) console.log(v.length, "->", v.join(", "));
}
await c.end();
