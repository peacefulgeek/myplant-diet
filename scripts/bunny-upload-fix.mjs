#!/usr/bin/env node
import sharp from "sharp";

const STORAGE_KEY = "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db";
const STORAGE_ENDPOINT = "https://ny.storage.bunnycdn.com/myplant-diet";

// Replacement IDs (verified working Unsplash food photos).
const FIX = [
  ["lib-44", "https://images.unsplash.com/photo-1515543904379-3d757afe72e4"], // chickpeas
  ["lib-48", "https://images.unsplash.com/photo-1596466713836-5d1f5fbe1efb"], // sweet potato
  ["lib-51", "https://images.unsplash.com/photo-1605020420620-20c943cc4669"], // walnuts
  ["lib-53", "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f"], // chia
  ["lib-54", "https://images.unsplash.com/photo-1610725664408-3da93a3a4d57"], // flax
  ["lib-55", "https://images.unsplash.com/photo-1494390248081-4e521a5940db"], // hemp/smoothie
  ["lib-56", "https://images.unsplash.com/photo-1574485111108-04f7d3f6b8d3"], // pumpkin seeds
  ["lib-57", "https://images.unsplash.com/photo-1574484184081-afea8a62f9c7"], // tahini
  ["lib-59", "https://images.unsplash.com/photo-1605000797499-95a51c5269ae"], // miso
  ["lib-61", "https://images.unsplash.com/photo-1543007630-9710e4a00a20"],   // sauerkraut/jars
  ["lib-62", "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f"], // millet/porridge
  ["lib-79", "https://images.unsplash.com/photo-1610725664105-3a1e21f5e9c2"], // blender
  ["lib-89", "https://images.unsplash.com/photo-1466637574441-749b8f19452f"], // tomatoes corn summer
  ["lib-90", "https://images.unsplash.com/photo-1547308283-b3a7b7d9b5c0"],   // winter stew
  ["lib-97", "https://images.unsplash.com/photo-1597857813140-bf6a8d05e74b"], // walnuts berries
  ["lib-105", "https://images.unsplash.com/photo-1584017911766-d451b3d0e843"], // omega capsules
  ["lib-107", "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"], // calcium tahini
  ["lib-108", "https://images.unsplash.com/photo-1574485111108-04f7d3f6b8d3"], // pumpkin seeds
  ["lib-111", "https://images.unsplash.com/photo-1543007630-9710e4a00a20"],  // ferment crock
  ["lib-112", "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"], // grain bowl seeds
  ["lib-119", "https://images.unsplash.com/photo-1547592180-85f173990554"],  // soup hands
  ["lib-120", "https://images.unsplash.com/photo-1542838132-92c53300491e"],  // fall harvest spread
];

async function go() {
  let ok = 0, fail = 0;
  for (const [slot, url] of FIX) {
    try {
      const r = await fetch(`${url}?w=1600&auto=format&fit=crop&q=80`);
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
  console.log(`\nFIX uploaded ${ok}/${FIX.length}, failed ${fail}`);
}
go();
