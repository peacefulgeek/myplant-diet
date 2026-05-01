import sharp from "sharp";

const items = [
  [7, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80&fm=webp"],
  [39, "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1600&q=80&fm=webp"],
];
for (const [slot, url] of items) {
  const res = await fetch(url);
  if (!res.ok) {
    console.log(slot, "fail", res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();
  const slotStr = String(slot).padStart(2, "0");
  const put = await fetch(
    `https://ny.storage.bunnycdn.com/myplant-diet/library/lib-${slotStr}.webp`,
    {
      method: "PUT",
      headers: {
        AccessKey: "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db",
        "Content-Type": "image/webp",
      },
      body: out,
    },
  );
  console.log("slot", slot, "->", put.status, "(", (out.length / 1024).toFixed(1), "kb)");
}
