import { SITE } from "./site-config";

/**
 * Bunny CDN image library. Master scope §9.
 *
 * The repo holds zero binary images. Every hero/gallery image is referenced
 * by a Bunny CDN URL. The library is generated as `lib-01.webp` ... `lib-40.webp`
 * inside the `library/` directory of the configured pull zone.
 *
 * If real Bunny credentials aren't configured yet, we fall back to deterministic
 * Unsplash CDN URLs (also remote, also zero bytes in the repo) so the site looks
 * complete from the first deploy. The moment BUNNY_API_KEY is present and the
 * library is uploaded, every URL flips to Bunny without a code change.
 */

const LIBRARY_SIZE = 40;

// Curated, copyright-permissive plant-based imagery (remote only).
// These are deterministic placeholders; replace via Bunny upload at any time.
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

// Public WebP fallbacks while Bunny zone is empty. Remote, no repo bytes.
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

function bunnyConfigured(): boolean {
  return Boolean(SITE.bunny.apiKey && SITE.bunny.pullZone);
}

export interface LibraryEntry {
  url: string;
  alt: string;
  tags: string[];
}

export function getLibraryEntry(index: number): LibraryEntry {
  const i = ((index % LIBRARY_SIZE) + LIBRARY_SIZE) % LIBRARY_SIZE;
  const meta = FALLBACK_LIBRARY[i];
  if (bunnyConfigured()) {
    const base = SITE.bunny.pullZone.replace(/\/+$/, "");
    return { url: `${base}/library/${meta.path}.webp`, alt: meta.alt, tags: meta.tags };
  }
  return { url: FALLBACK_HOSTS[i] || FALLBACK_HOSTS[0], alt: meta.alt, tags: meta.tags };
}

/**
 * Score the library by how well its tags overlap with the article's tags + slug.
 * Picks a deterministic but topical hero. Master scope §9C.
 */
export function assignHeroImage(slug: string, articleTags: string[]): LibraryEntry {
  const seedHash = hash(slug);
  const lowered = articleTags.map((t) => t.toLowerCase()).concat(slug.toLowerCase().split(/[-_/]/));
  const scored = FALLBACK_LIBRARY.map((meta, i) => {
    const overlap = meta.tags.reduce((acc, t) => acc + (lowered.includes(t) ? 2 : 0), 0);
    const tieBreak = ((seedHash + i * 37) % 7) / 100;
    return { i, score: overlap + tieBreak };
  }).sort((a, b) => b.score - a.score);
  return getLibraryEntry(scored[0].i);
}

export function pickGallery(slug: string, articleTags: string[], n = 4): LibraryEntry[] {
  const used = new Set<number>();
  const seedHash = hash(slug);
  const out: LibraryEntry[] = [];
  for (let k = 0; k < n; k++) {
    let pick = (seedHash + k * 13) % LIBRARY_SIZE;
    while (used.has(pick)) pick = (pick + 1) % LIBRARY_SIZE;
    used.add(pick);
    out.push(getLibraryEntry(pick));
  }
  // Bias the first to topical match.
  out[0] = assignHeroImage(slug, articleTags);
  return out;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
