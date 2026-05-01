// Download every fallback Unsplash image, compress to WebP at quality 78,
// and upload to Bunny storage zone myplant-diet under /library/lib-NN.webp.
// After this runs, bunny.ts auto-flips every URL to https://myplant-diet.b-cdn.net/library/lib-NN.webp
// because SITE.bunny.apiKey + SITE.bunny.pullZone are populated.
//
// Run: node scripts/bunny-upload.mjs

import "dotenv/config";
import sharp from "sharp";

// Pulled from server/lib/bunny.ts FALLBACK_HOSTS
const FALLBACK_HOSTS = [
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1467019972079-a273e1bc9173?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1505253213348-cd54c92b37e7?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1564844536311-de546a28c87d?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1530092285049-1c42085fd395?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1517242810446-cc8951b2be40?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1572441713132-c542fc4c1a48?auto=format&fit=crop&w=1600&q=80&fm=webp",
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1600&q=80&fm=webp",
];

const BUNNY_API_KEY =
  process.env.BUNNY_API_KEY || "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db";
const BUNNY_HOSTNAME = process.env.BUNNY_HOSTNAME || "ny.storage.bunnycdn.com";
const BUNNY_ZONE = process.env.BUNNY_STORAGE_ZONE || "myplant-diet";

async function downloadAndCompress(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Re-encode to compressed WebP at q=78, max width 1600 (already).
  return await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();
}

async function uploadToBunny(remotePath, body) {
  const url = `https://${BUNNY_HOSTNAME}/${BUNNY_ZONE}/${remotePath}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_API_KEY,
      "Content-Type": "image/webp",
    },
    body,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`bunny PUT ${res.status}: ${t}`);
  }
}

let okCount = 0;
let totalBytes = 0;
for (let i = 0; i < FALLBACK_HOSTS.length; i++) {
  const slot = String(i + 1).padStart(2, "0");
  const remotePath = `library/lib-${slot}.webp`;
  try {
    process.stdout.write(`[${slot}/40] ${FALLBACK_HOSTS[i].slice(0, 70)}... `);
    const buf = await downloadAndCompress(FALLBACK_HOSTS[i]);
    await uploadToBunny(remotePath, buf);
    okCount++;
    totalBytes += buf.length;
    console.log(`OK (${(buf.length / 1024).toFixed(1)}kb)`);
  } catch (e) {
    console.log("FAIL:", e.message);
  }
}
console.log(
  `\nDone. uploaded=${okCount}/${FALLBACK_HOSTS.length} totalSize=${(totalBytes / 1024 / 1024).toFixed(2)}mb`,
);
