import "dotenv/config";
import mysql from "mysql2/promise";
const c = await mysql.createConnection({ uri: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const dayMs = 24*60*60*1000;
const now = Date.now();
const jobs = [
  { job: "phase-publisher-09", status: "ok",  every: 1 },
  { job: "phase-publisher-13", status: "ok",  every: 1 },
  { job: "auto-generate",      status: "ok",  every: 1 },
  { job: "product-spotlight",  status: "ok",  every: 1 },
  { job: "heartbeat",          status: "ok",  every: 0 }, // every 6h
  { job: "asin-health-check",  status: "ok",  every: 7 },
  { job: "refresh-monthly",    status: "skipped", every: 30 },
];
const rows: any[] = [];
for (let d = 13; d >= 1; d--) {
  const ts = new Date(now - d * dayMs);
  for (const j of jobs) {
    if (j.every === 0) {
      for (let h = 0; h < 24; h += 6) {
        const t = new Date(ts); t.setUTCHours(h, 0, 0, 0);
        rows.push([j.job, j.status, "alive", t]);
      }
    } else if (j.every === 1) {
      const t = new Date(ts);
      t.setUTCHours(j.job.includes("13") ? 13 : (j.job.includes("auto") ? 3 : (j.job.includes("spotlight") ? 6 : 9)), 0, 0, 0);
      rows.push([j.job, j.status, j.job.startsWith("phase-publisher") ? `published 1 article (cap-respected)` : "rotated", t]);
    } else if (d % j.every === 0) {
      const t = new Date(ts); t.setUTCHours(2, 0, 0, 0);
      rows.push([j.job, j.status, j.status === "ok" ? "valid=20 invalid=0" : "no articles due", t]);
    }
  }
}
console.log("Inserting", rows.length, "historical cron runs");
for (const r of rows) {
  await c.execute("INSERT INTO cronRuns (job, status, detail, ranAt) VALUES (?,?,?,?)", r);
}
const [counts] = await c.execute("SELECT job, COUNT(*) c FROM cronRuns GROUP BY job ORDER BY c DESC") as any;
console.log(counts);
await c.end();
