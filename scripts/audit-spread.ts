import "dotenv/config";
import mysql from "mysql2/promise";
const c = await mysql.createConnection({ uri: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const [byDay] = await c.execute(
  "SELECT DATE(publishedAt) d, COUNT(*) c FROM articles WHERE status='published' GROUP BY DATE(publishedAt) ORDER BY d DESC"
) as any;
console.log("Published per day:");
console.table(byDay);
const [statusRows] = await c.execute(
  "SELECT status, COUNT(*) c FROM articles GROUP BY status"
) as any;
console.log("By status:", statusRows);
const [cron] = await c.execute(
  `SELECT DATE(ranAt) d, job, COUNT(*) c FROM cronRuns
   WHERE ranAt > NOW() - INTERVAL 14 DAY
   GROUP BY DATE(ranAt), job ORDER BY d DESC, job`
) as any;
console.log(`Cron runs in last 14 days: ${cron.length} job-day combos`);
await c.end();
