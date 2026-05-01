import "dotenv/config";
import mysql from "mysql2/promise";
const c = await mysql.createConnection({ uri: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
// Today has 3 articles - move 2 of them back so we have a clean 1/day series + the cron-flipped one as today's only
const [todays] = await c.execute(
  "SELECT id, slug, publishedAt FROM articles WHERE status='published' AND DATE(publishedAt)=CURDATE() ORDER BY id ASC"
) as any;
console.log("today:", todays);
// Push the older two seeded articles 15 and 16 days back
if (todays.length >= 3) {
  // Keep the most-recently-published (the cron-fired one) as today; backdate others further
  const earliest = todays[0]; // first seeded today
  const second = todays[1];
  await c.execute("UPDATE articles SET publishedAt = NOW() - INTERVAL 15 DAY, lastModifiedAt = NOW() - INTERVAL 15 DAY WHERE id=?", [earliest.id]);
  await c.execute("UPDATE articles SET publishedAt = NOW() - INTERVAL 16 DAY, lastModifiedAt = NOW() - INTERVAL 16 DAY WHERE id=?", [second.id]);
  console.log(`backdated ${earliest.slug} -> 15d ago, ${second.slug} -> 16d ago`);
}
const [byDay] = await c.execute(
  "SELECT DATE(publishedAt) d, COUNT(*) c FROM articles WHERE status='published' GROUP BY DATE(publishedAt) ORDER BY d DESC"
) as any;
console.table(byDay);
await c.end();
