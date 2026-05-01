#!/usr/bin/env node
import sharp from "sharp";

const STORAGE_KEY = "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db";
const STORAGE_ENDPOINT = "https://ny.storage.bunnycdn.com/myplant-diet";

const STILL_MISSING = [
  ["lib-48", "https://images.unsplash.com/photo-1596097635121-14b38c5d7a55?w=1600"],
  ["lib-54", "https://images.unsplash.com/photo-1611070960297-6822db1bc8e8?w=1600"],
  ["lib-56", "https://images.unsplash.com/photo-1601301527964-8be7e4c0d04e?w=1600"],
  ["lib-57", "https://images.unsplash.com/photo-1607372108657-78bdb35eb6f3?w=1600"],
  ["lib-79", "https://images.unsplash.com/photo-1603816245457-fc1c8aaff936?w=1600"],
  ["lib-90", "https://images.unsplash.com/photo-1547308283-b941a5d04dad?w=1600"],
  ["lib-97", "https://images.unsplash.com/photo-1604153385499-3b07eb71f33b?w=1600"],
  ["lib-108", "https://images.unsplash.com/photo-1601301527964-8be7e4c0d04e?w=1600"],
];

// Fall back to source.unsplash.com keyword search.
const KEYWORDS = {
  "lib-48": "sweet-potato",
  "lib-54": "flax",
  "lib-56": "pumpkin-seeds",
  "lib-57": "tahini",
  "lib-79": "blender-kitchen",
  "lib-90": "winter-stew",
  "lib-97": "walnuts",
  "lib-108": "pumpkin-seeds",
};

async function fetchOne(slot, primary) {
  let r = await fetch(primary);
  if (r.ok) return Buffer.from(await r.arrayBuffer());
  const kw = KEYWORDS[slot];
  // source.unsplash.com redirects to a real CDN URL.
  r = await fetch(`https://source.unsplash.com/featured/1600x900/?${kw},food`, { redirect: "follow" });
  if (!r.ok) throw new Error(`source ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function go() {
  let ok = 0, fail = 0;
  for (const [slot, url] of STILL_MISSING) {
    try {
      const buf = await fetchOne(slot, url);
      const webp = await sharp(buf).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      const up = await fetch(`${STORAGE_ENDPOINT}/library/${slot}.webp`, {
        method: "PUT",
        headers: { AccessKey: STORAGE_KEY, "Content-Type": "image/webp" },
        body: webp,
      });
      if (!up.ok) throw new Error(`PUT ${up.status}`);
      ok++;
      process.stdout.write(`. ${slot} ${(webp.length/1024|0)}kb\n`);
    } catch (e) {
      fail++;
      process.stdout.write(`X ${slot} ${e.message}\n`);
    }
  }
  console.log(`\nFINAL uploaded ${ok}/${STILL_MISSING.length}, failed ${fail}`);
}
go();
