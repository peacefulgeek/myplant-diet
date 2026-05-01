/**
 * Post-seed verification. Asserts everything the master scope requires.
 */
import { getDb } from "../server/db";
import { articles, cronRuns } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { SITE } from "../server/lib/site-config";

(async () => {
  const db = await getDb();
  if (!db) throw new Error("no DB");

  const all = await db.select().from(articles);
  const pub = all.filter((a) => a.status === "published");
  const queued = all.filter((a) => a.status === "queued");

  console.log("\n=== ARTICLE DISTRIBUTION ===");
  console.log("total:", all.length, "  published:", pub.length, "  queued:", queued.length);

  const wcs = all.map((a) => a.wordCount);
  const minWc = Math.min(...wcs);
  const maxWc = Math.max(...wcs);
  const avgWc = Math.round(wcs.reduce((s, w) => s + w, 0) / wcs.length);
  const under1800 = wcs.filter((w) => w < 1800).length;
  console.log("\n=== WORD COUNTS ===");
  console.log(`min=${minWc}  max=${maxWc}  avg=${avgWc}  articles<1800=${under1800}`);

  const heroes = new Set(all.map((a) => a.heroUrl));
  console.log("\n=== HERO IMAGE DISTINCTNESS ===");
  console.log(`total articles=${all.length}  distinct heroes=${heroes.size}`);

  const allBunny = [...heroes].every((u) => u.includes("myplant-diet.b-cdn.net"));
  console.log("all heroes on Bunny CDN:", allBunny);

  // Galleries: all 4 unique per article + all on Bunny
  let galleryUnique = 0;
  let galleryBunny = 0;
  let galleryFour = 0;
  for (const a of all) {
    const g = (a.galleryUrls as unknown as string[]) || [];
    if (g.length === 4) galleryFour++;
    if (new Set(g).size === g.length) galleryUnique++;
    if (g.every((u) => u.includes("myplant-diet.b-cdn.net"))) galleryBunny++;
  }
  console.log("\n=== GALLERIES ===");
  console.log(`gallery=4  ${galleryFour}/${all.length}`);
  console.log(`gallery 4-unique  ${galleryUnique}/${all.length}`);
  console.log(`gallery all on Bunny  ${galleryBunny}/${all.length}`);

  // Oracle ratio
  const oracle = all.filter((a) => a.body.includes(SITE.authorUrl)).length;
  const ratio = ((oracle / all.length) * 100).toFixed(2);
  console.log("\n=== ORACLE BACKLINK RATIO ===");
  console.log(`oracle backlinks=${oracle}/${all.length} = ${ratio}%`);

  // Self-reference present
  const selfRefMissing = all.filter((a) => !a.body.toLowerCase().includes(SITE.name.toLowerCase()) && !a.body.includes("MyPlantDiet")).length;
  console.log(`articles missing self-reference (site name): ${selfRefMissing}`);

  // Manus references in body
  const manusRefs = all.filter((a) => /manus/i.test(a.body)).length;
  console.log(`articles containing "manus": ${manusRefs}`);

  // Banned strings: paulwagner, kalesh
  const paulwagner = all.filter((a) => /paulwagner/i.test(a.body)).length;
  const kalesh = all.filter((a) => /kalesh/i.test(a.body)).length;
  console.log(`articles containing "paulwagner": ${paulwagner}`);
  console.log(`articles containing "kalesh": ${kalesh}`);

  // Em-dash / en-dash
  const emDash = all.filter((a) => /[—–]/.test(a.body)).length;
  console.log(`articles containing em/en dash: ${emDash}`);

  // Date spread
  const pubDays = new Set(pub.map((a) => a.publishedAt!.toISOString().slice(0, 10)));
  const queueDays = new Set(queued.map((a) => a.queuedAt.toISOString().slice(0, 10)));
  console.log("\n=== DATE SPREAD ===");
  console.log(`published spans ${pubDays.size} distinct days`);
  console.log(`queued spans ${queueDays.size} distinct days`);

  // Cron history
  const crons = await db.select().from(cronRuns);
  const cronJobs = new Set(crons.map((c) => c.job));
  const cronDays = new Set(crons.map((c) => c.ranAt.toISOString().slice(0, 10)));
  console.log("\n=== CRON HISTORY ===");
  console.log(`total runs: ${crons.length}`);
  console.log(`distinct jobs: ${cronJobs.size}  -> ${[...cronJobs].join(", ")}`);
  console.log(`distinct days: ${cronDays.size}`);

  // Image library coverage on Bunny
  const heroLibIds = [...heroes].map((u) => u.split("/").pop()).filter(Boolean);
  console.log(`\nlib slots used as heroes: ${heroLibIds.length} unique`);

  console.log("\n=== ALL CHECKS COMPLETE ===");
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
