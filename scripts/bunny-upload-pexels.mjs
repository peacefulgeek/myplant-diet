#!/usr/bin/env node
import sharp from "sharp";

const STORAGE_KEY = "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db";
const STORAGE_ENDPOINT = "https://ny.storage.bunnycdn.com/myplant-diet";

// Pexels free direct CDN URLs for food images.
const ITEMS = [
  ["lib-48", "https://images.pexels.com/photos/89247/pexels-photo-89247.jpeg"], // sweet potato
  ["lib-54", "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg"], // flaxseeds
  ["lib-56", "https://images.pexels.com/photos/4194594/pexels-photo-4194594.jpeg"], // pumpkin seeds
  ["lib-57", "https://images.pexels.com/photos/4051566/pexels-photo-4051566.jpeg"], // tahini sauce
  ["lib-79", "https://images.pexels.com/photos/3735155/pexels-photo-3735155.jpeg"], // blender
  ["lib-90", "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg"],   // winter stew
  ["lib-97", "https://images.pexels.com/photos/8472980/pexels-photo-8472980.jpeg"], // walnuts berries
  ["lib-108", "https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg"], // pumpkin seeds 2
];

async function go() {
  let ok = 0, fail = 0;
  for (const [slot, url] of ITEMS) {
    try {
      const r = await fetch(`${url}?w=1600&auto=compress`);
      if (!r.ok) throw new Error(`fetch ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
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
  console.log(`\nPEXELS uploaded ${ok}/${ITEMS.length}, failed ${fail}`);
}
go();
