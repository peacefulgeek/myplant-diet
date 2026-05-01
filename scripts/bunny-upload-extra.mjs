#!/usr/bin/env node
/**
 * One-time: download topical food photos from Unsplash (free), compress to
 * WebP via sharp, upload to the Bunny storage zone.
 *
 * Run once when expanding the library.
 *
 *   BUNNY_STORAGE_KEY=... node scripts/bunny-upload-extra.mjs
 */
import sharp from "sharp";

const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY || "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db";
const STORAGE_ENDPOINT = "https://ny.storage.bunnycdn.com/myplant-diet";

// Each entry maps to a lib-NN slot. Source URLs are Unsplash food photos.
const NEW_IMAGES = [
  // 41-60
  ["lib-41", "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6"], // brown rice
  ["lib-42", "https://images.unsplash.com/photo-1562967914-608f82629710"],   // tempeh
  ["lib-43", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],   // tofu cubes
  ["lib-44", "https://images.unsplash.com/photo-1604908176997-431a4ad21a4e"], // dry chickpeas
  ["lib-45", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a"], // green lentils
  ["lib-46", "https://images.unsplash.com/photo-1568584711271-6c929fb49b60"], // cauliflower
  ["lib-47", "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a"], // broccoli
  ["lib-48", "https://images.unsplash.com/photo-1596097635121-14b38c5d7a55"], // sweet potato
  ["lib-49", "https://images.unsplash.com/photo-1576045057995-568f588f82fb"], // spinach
  ["lib-50", "https://images.unsplash.com/photo-1550258987-190a2d41a8ba"],   // mixed berries
  ["lib-51", "https://images.unsplash.com/photo-1604153385499-3b07eb71f33b"], // walnuts
  ["lib-52", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"], // almonds
  ["lib-53", "https://images.unsplash.com/photo-1604934054632-a2c2bbf69ed8"], // chia seeds
  ["lib-54", "https://images.unsplash.com/photo-1611070960297-6822db1bc8e8"], // flaxseeds
  ["lib-55", "https://images.unsplash.com/photo-1599909533730-9be07e5c46c8"], // hemp seeds (smoothie topping)
  ["lib-56", "https://images.unsplash.com/photo-1601301527964-8be7e4c0d04e"], // pumpkin seeds
  ["lib-57", "https://images.unsplash.com/photo-1607372108657-78bdb35eb6f3"], // tahini
  ["lib-58", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"], // olive oil
  ["lib-59", "https://images.unsplash.com/photo-1606923829579-0cb981a83e2d"], // miso paste
  ["lib-60", "https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24"], // nutritional yeast (cheesy)
  // 61-80
  ["lib-61", "https://images.unsplash.com/photo-1597371445090-08b5fa5fc3ce"], // sauerkraut
  ["lib-62", "https://images.unsplash.com/photo-1601001435957-74f0958a93c5"], // millet porridge
  ["lib-63", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5"], // buckwheat
  ["lib-64", "https://images.unsplash.com/photo-1547592180-85f173990554"],   // barley stew
  ["lib-65", "https://images.unsplash.com/photo-1571091718767-18b5b1457add"], // plant burger
  ["lib-66", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"], // tacos
  ["lib-67", "https://images.unsplash.com/photo-1513104890138-7c749659a591"], // pizza slice
  ["lib-68", "https://images.unsplash.com/photo-1551024506-0bccd828d307"],   // dessert plate
  ["lib-69", "https://images.unsplash.com/photo-1513442542250-854d436a73f2"], // breakfast spread
  ["lib-70", "https://images.unsplash.com/photo-1604152135912-04a022e23696"], // curry
  ["lib-71", "https://images.unsplash.com/photo-1547592166-23ac45744acd"],   // lentil stew
  ["lib-72", "https://images.unsplash.com/photo-1626804475297-41608ea09aeb"], // stir-fry wok
  ["lib-73", "https://images.unsplash.com/photo-1540420773420-3366772f4999"], // wide salad
  ["lib-74", "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4"], // smoothie
  ["lib-75", "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1"], // overnight oats
  ["lib-76", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"], // pantry shelves
  ["lib-77", "https://images.unsplash.com/photo-1607920591413-4ec007e70023"], // frozen veg
  ["lib-78", "https://images.unsplash.com/photo-1543007630-9710e4a00a20"],   // fridge produce
  ["lib-79", "https://images.unsplash.com/photo-1603816245457-fc1c8aaff936"], // blender
  ["lib-80", "https://images.unsplash.com/photo-1586201375761-83865001e31c"], // instant pot / appliance
  // 81-100
  ["lib-81", "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659"], // cast iron skillet
  ["lib-82", "https://images.unsplash.com/photo-1593618998160-e34014e67546"], // chef's knife
  ["lib-83", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e"],   // family meal kids
  ["lib-84", "https://images.unsplash.com/photo-1556910103-1c02745aae4d"],   // couple cooking
  ["lib-85", "https://images.unsplash.com/photo-1488646953014-85cb44e25828"], // travel snacks
  ["lib-86", "https://images.unsplash.com/photo-1542838132-92c53300491e"],   // bento desk
  ["lib-87", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"], // dinner party table
  ["lib-88", "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785"], // thanksgiving squash
  ["lib-89", "https://images.unsplash.com/photo-1564836405648-32d0eb9d12a6"], // summer plate tomatoes corn
  ["lib-90", "https://images.unsplash.com/photo-1547308283-b941a5d04dad"],   // winter stew
  ["lib-91", "https://images.unsplash.com/photo-1542838132-92c53300491e"],   // budget shopping (reuse safe)
  ["lib-92", "https://images.unsplash.com/photo-1518611012118-696072aa579a"], // yoga + fruit
  ["lib-93", "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f"],   // athlete bowl
  ["lib-94", "https://images.unsplash.com/photo-1558642084-fd07fae5282e"],   // toddler eating veg
  ["lib-95", "https://images.unsplash.com/photo-1547592180-85f173990554"],   // older adult plate (warm)
  ["lib-96", "https://images.unsplash.com/photo-1515823064-d6e0c04616a7"],   // chamomile tea
  ["lib-97", "https://images.unsplash.com/photo-1604153385499-3b07eb71f33b"], // walnuts berries (reuse 51 close ok)
  ["lib-98", "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af"], // oats berries breakfast
  ["lib-99", "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea"], // colorful fruit bowl
  ["lib-100", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e"],  // ferments (reuse 83 fallback)
  // 101-120
  ["lib-101", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],  // soy plate (reuse 43 ok)
  ["lib-102", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"],  // protein scoop
  ["lib-103", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"], // supplement bottle
  ["lib-104", "https://images.unsplash.com/photo-1550572017-edd951b55104"],  // vitamin sun
  ["lib-105", "https://images.unsplash.com/photo-1576086135878-bd7e7d3d2d34"], // omega capsules
  ["lib-106", "https://images.unsplash.com/photo-1467453678174-768ec283a940"], // iron greens
  ["lib-107", "https://images.unsplash.com/photo-1515426954472-fa4ad22fb16e"], // calcium tahini greens
  ["lib-108", "https://images.unsplash.com/photo-1601301527964-8be7e4c0d04e"], // pumpkin seeds (reuse 56)
  ["lib-109", "https://images.unsplash.com/photo-1606312619070-d48b4c652a52"], // dark chocolate
  ["lib-110", "https://images.unsplash.com/photo-1562967914-608f82629710"],  // seaweed (reuse 42 fallback)
  ["lib-111", "https://images.unsplash.com/photo-1597371445090-08b5fa5fc3ce"], // ferment crock (reuse 61)
  ["lib-112", "https://images.unsplash.com/photo-1543353071-c8e0b4f1c8c0"],  // grain bowl seeds
  ["lib-113", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"], // tahini grain salad
  ["lib-114", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"], // burger + salad
  ["lib-115", "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f"], // tacos avocado
  ["lib-116", "https://images.unsplash.com/photo-1585238342024-78d387f4a707"], // pizza greens
  ["lib-117", "https://images.unsplash.com/photo-1570197788417-0e82375c9371"], // tiramisu
  ["lib-118", "https://images.unsplash.com/photo-1488477181946-6428a0291777"], // parfait
  ["lib-119", "https://images.unsplash.com/photo-1544378730-6d11c4a4a7d3"],   // soup hands
  ["lib-120", "https://images.unsplash.com/photo-1572441710534-9c2657498e8b"], // fall harvest spread
];

async function downloadAndCompress(url) {
  const fullUrl = `${url}?w=1600&auto=format&fit=crop&q=80`;
  const r = await fetch(fullUrl);
  if (!r.ok) throw new Error(`fetch ${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  return await sharp(buf).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
}

async function uploadToBunny(slot, body) {
  const r = await fetch(`${STORAGE_ENDPOINT}/library/${slot}.webp`, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_KEY,
      "Content-Type": "image/webp",
    },
    body,
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`PUT ${slot} ${r.status} ${t}`);
  }
}

async function main() {
  const total = NEW_IMAGES.length;
  let ok = 0, fail = 0, totalBytes = 0;
  for (const [slot, url] of NEW_IMAGES) {
    try {
      const buf = await downloadAndCompress(url);
      await uploadToBunny(slot, buf);
      ok++;
      totalBytes += buf.length;
      process.stdout.write(`. ${slot} ${(buf.length/1024|0)}kb\n`);
    } catch (e) {
      fail++;
      process.stdout.write(`X ${slot} ${e.message}\n`);
    }
  }
  console.log(`\nuploaded ${ok}/${total}, failed ${fail}, total ${(totalBytes/1024/1024).toFixed(2)} MB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
