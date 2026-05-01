import { SITE } from "./site-config";

/**
 * Bunny CDN image library. Master scope §9.
 *
 * The repo holds zero binary images. Every hero/gallery image is referenced
 * by a Bunny CDN URL. The library lives at /library/lib-NN.webp inside the
 * configured pull zone. Forty unique compressed WebP images cover the niche.
 */

const LIBRARY_SIZE = 40;

const FALLBACK_LIBRARY: { path: string; alt: string; tags: string[] }[] = [
  { path: "lib-01", alt: "Halved avocado on a marble board", tags: ["fats", "breakfast", "avocado"] },
  { path: "lib-02", alt: "Roasted vegetable sheet pan with golden squash", tags: ["dinner", "squash", "roast"] },
  { path: "lib-03", alt: "Bowl of red lentil dal with cilantro", tags: ["dal", "dinner", "legumes", "protein"] },
  { path: "lib-04", alt: "Smoothie bowl topped with granola and berries", tags: ["breakfast", "berries", "smoothie"] },
  { path: "lib-05", alt: "Chickpea salad with parsley and lemon", tags: ["lunch", "chickpea", "salad", "protein"] },
  { path: "lib-06", alt: "Heirloom tomatoes scattered on linen", tags: ["tomato", "ingredient", "summer"] },
  { path: "lib-07", alt: "Loaf of seeded sourdough with sunlight", tags: ["bread", "ingredient", "carbs"] },
  { path: "lib-08", alt: "Tofu stir fry with broccoli", tags: ["tofu", "dinner", "stir-fry", "protein"] },
  { path: "lib-09", alt: "Oats and cinnamon in a stone bowl", tags: ["breakfast", "oats", "fiber"] },
  { path: "lib-10", alt: "Hand holding a fresh bunch of kale", tags: ["greens", "kale", "ingredient"] },
  { path: "lib-11", alt: "Quinoa salad with pomegranate", tags: ["quinoa", "lunch", "grains"] },
  { path: "lib-12", alt: "Pasta with fresh basil and olive oil", tags: ["pasta", "dinner", "italian"] },
  { path: "lib-13", alt: "A market display of fresh squash", tags: ["squash", "market", "ingredient"] },
  { path: "lib-14", alt: "Almond butter on toast with banana", tags: ["breakfast", "almond", "toast"] },
  { path: "lib-15", alt: "Jar of sprouted lentils", tags: ["legumes", "sprout", "protein"] },
  { path: "lib-16", alt: "Garden mint and rosemary on linen", tags: ["herbs", "ingredient"] },
  { path: "lib-17", alt: "Mushrooms in a wooden bowl", tags: ["mushroom", "ingredient", "umami"] },
  { path: "lib-18", alt: "Beetroot hummus with sesame", tags: ["beet", "snack", "dip"] },
  { path: "lib-19", alt: "Crisp green apples in a basket", tags: ["fruit", "apple", "fall"] },
  { path: "lib-20", alt: "Banana slices fanned on toast", tags: ["fruit", "banana", "breakfast"] },
  { path: "lib-21", alt: "Vegan ramen with corn and bok choy", tags: ["ramen", "dinner", "asian"] },
  { path: "lib-22", alt: "Cinnamon rolls without dairy", tags: ["dessert", "baking"] },
  { path: "lib-23", alt: "A plate of buddha bowl with tahini", tags: ["bowl", "lunch", "tahini"] },
  { path: "lib-24", alt: "Citrus halves on a wooden board", tags: ["citrus", "ingredient", "winter"] },
  { path: "lib-25", alt: "Hands kneading whole wheat dough", tags: ["bread", "baking", "process"] },
  { path: "lib-26", alt: "Pan-seared portobello mushrooms", tags: ["mushroom", "dinner", "umami"] },
  { path: "lib-27", alt: "Salad with peaches and arugula", tags: ["salad", "summer", "stone-fruit"] },
  { path: "lib-28", alt: "Black bean tacos with lime", tags: ["tacos", "dinner", "protein"] },
  { path: "lib-29", alt: "Mason jar overnight oats", tags: ["breakfast", "oats", "meal-prep"] },
  { path: "lib-30", alt: "Spread of fresh hummus, olives, and pita", tags: ["mezze", "snack", "mediterranean"] },
  { path: "lib-31", alt: "Cabbage halved on dark linen", tags: ["cabbage", "ingredient"] },
  { path: "lib-32", alt: "Mushroom risotto with parsley", tags: ["risotto", "dinner", "comfort"] },
  { path: "lib-33", alt: "Sliced strawberries fanned on yogurt", tags: ["berry", "breakfast", "yogurt"] },
  { path: "lib-34", alt: "Roasted carrots with cumin", tags: ["carrot", "side", "roast"] },
  { path: "lib-35", alt: "Watermelon slices on terracotta", tags: ["fruit", "summer", "watermelon"] },
  { path: "lib-36", alt: "Chia pudding with mango", tags: ["chia", "breakfast", "tropical"] },
  { path: "lib-37", alt: "Lentil soup with crusty bread", tags: ["soup", "dinner", "protein"] },
  { path: "lib-38", alt: "Stuffed bell peppers fresh from the oven", tags: ["peppers", "dinner"] },
  { path: "lib-39", alt: "Pumpkin halves and seeds on linen", tags: ["pumpkin", "fall", "ingredient"] },
  { path: "lib-40", alt: "A leafy green smoothie in a glass", tags: ["smoothie", "greens", "breakfast"] },
];

export interface LibraryEntry {
  url: string;
  alt: string;
  tags: string[];
}

export function getLibraryEntry(index: number): LibraryEntry {
  const i = ((index % LIBRARY_SIZE) + LIBRARY_SIZE) % LIBRARY_SIZE;
  const meta = FALLBACK_LIBRARY[i];
  const base = SITE.bunny.pullZone.replace(/\/+$/, "");
  return { url: `${base}/library/${meta.path}.webp`, alt: meta.alt, tags: meta.tags };
}

/**
 * Score the library by how well its tags overlap with the article's tags + slug.
 * Picks a deterministic but topical hero. Master scope §9C.
 *
 * `claimedIndexes` lets a seeder pin one library entry per article so we don't
 * burn the same hero on multiple posts when the corpus is bigger than the
 * library.
 */
export function assignHeroImage(
  slug: string,
  articleTags: string[],
  claimedIndexes?: Set<number>,
): LibraryEntry {
  const seedHash = hash(slug);
  const lowered = articleTags.map((t) => t.toLowerCase()).concat(slug.toLowerCase().split(/[-_/]/));
  const scored = FALLBACK_LIBRARY.map((meta, i) => {
    const overlap = meta.tags.reduce((acc, t) => acc + (lowered.includes(t) ? 2 : 0), 0);
    const tieBreak = ((seedHash * (i + 1)) % 1000) / 10000;
    return { i, score: overlap + tieBreak };
  }).sort((a, b) => b.score - a.score);
  const pick = scored.find((s) => !claimedIndexes || !claimedIndexes.has(s.i)) || scored[0];
  if (claimedIndexes) claimedIndexes.add(pick.i);
  return getLibraryEntry(pick.i);
}

export function pickGallery(
  slug: string,
  articleTags: string[],
  n = 4,
  excludeIndexes?: Set<number>,
): LibraryEntry[] {
  const lowered = articleTags.map((t) => t.toLowerCase()).concat(slug.toLowerCase().split(/[-_/]/));
  const seedHash = hash(slug);
  const scored = FALLBACK_LIBRARY.map((meta, i) => {
    const overlap = meta.tags.reduce((acc, t) => acc + (lowered.includes(t) ? 2 : 0), 0);
    const tieBreak = ((seedHash + i * 37) % 41) / 1000;
    return { i, score: overlap + tieBreak };
  }).sort((a, b) => b.score - a.score);
  const used = new Set<number>();
  const out: LibraryEntry[] = [];
  for (const s of scored) {
    if (used.has(s.i)) continue;
    if (excludeIndexes && excludeIndexes.has(s.i)) continue;
    used.add(s.i);
    out.push(getLibraryEntry(s.i));
    if (out.length >= n) break;
  }
  if (out.length < n) {
    for (const s of scored) {
      if (used.has(s.i)) continue;
      used.add(s.i);
      out.push(getLibraryEntry(s.i));
      if (out.length >= n) break;
    }
  }
  return out;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
