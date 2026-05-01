import { SITE } from "./site-config";

/**
 * Bunny CDN image library. Master scope §9.
 *
 * The repo holds zero binary images. Every hero/gallery image is referenced
 * by a Bunny CDN URL. The library lives at /library/lib-NN.webp inside the
 * configured pull zone. 120 unique compressed WebP images cover the niche.
 *
 * Each entry's `tags` overlap with the topic-bank `tags` so the hero
 * scorer picks the most topical image for every article.
 */

interface Entry {
  path: string;
  alt: string;
  tags: string[];
}

const LIBRARY: Entry[] = [
  // 1-30: original library (already on Bunny)
  { path: "lib-01", alt: "Halved avocado on a marble board", tags: ["fats","breakfast","avocado","produce","creamy","staple"] },
  { path: "lib-02", alt: "Roasted vegetable sheet pan with golden squash", tags: ["dinner","squash","roast","produce","seasonal","fall"] },
  { path: "lib-03", alt: "Bowl of red lentil dal with cilantro", tags: ["dal","dinner","legumes","protein","one-pot","comfort","lentils"] },
  { path: "lib-04", alt: "Smoothie bowl topped with granola and berries", tags: ["breakfast","berries","smoothie","fruit","blender","antioxidant"] },
  { path: "lib-05", alt: "Chickpea salad with parsley and lemon", tags: ["lunch","chickpeas","salad","protein","legumes","mediterranean","quick"] },
  { path: "lib-06", alt: "Heirloom tomatoes scattered on linen", tags: ["tomato","produce","summer","seasonal","raw"] },
  { path: "lib-07", alt: "Loaf of seeded sourdough with sunlight", tags: ["bread","grain","carb","baking","staple"] },
  { path: "lib-08", alt: "Tofu stir fry with broccoli", tags: ["tofu","dinner","stir-fry","protein","soy","wok","quick","weeknight","cruciferous"] },
  { path: "lib-09", alt: "Oats and cinnamon in a stone bowl", tags: ["breakfast","oats","fiber","grain","staple","make-ahead"] },
  { path: "lib-10", alt: "Hand holding a fresh bunch of kale", tags: ["greens","kale","calcium","iron","produce","staple"] },
  { path: "lib-11", alt: "Quinoa salad with pomegranate", tags: ["quinoa","lunch","grain","protein","pantry"] },
  { path: "lib-12", alt: "Pasta with fresh basil and olive oil", tags: ["pasta","dinner","italian","weeknight","sauce","carb"] },
  { path: "lib-13", alt: "A market display of fresh squash", tags: ["squash","market","produce","seasonal","fall","beta-carotene"] },
  { path: "lib-14", alt: "Almond butter on toast with banana", tags: ["breakfast","almonds","toast","fat","protein","fruit","banana"] },
  { path: "lib-15", alt: "Jar of sprouted lentils", tags: ["legumes","sprout","protein","fiber","pantry","lentils"] },
  { path: "lib-16", alt: "Garden mint and rosemary on linen", tags: ["herbs","produce","staple"] },
  { path: "lib-17", alt: "Mushrooms in a wooden bowl", tags: ["mushrooms","produce","umami","b12-fortified"] },
  { path: "lib-18", alt: "Beetroot hummus with sesame", tags: ["beet","snack","dip","tahini","mediterranean"] },
  { path: "lib-19", alt: "Crisp green apples in a basket", tags: ["fruit","apple","fall","seasonal","produce"] },
  { path: "lib-20", alt: "Banana slices fanned on toast", tags: ["fruit","bananas","breakfast","potassium"] },
  { path: "lib-21", alt: "Vegan ramen with corn and bok choy", tags: ["ramen","dinner","asian","one-pot","umami"] },
  { path: "lib-22", alt: "Dairy-free cinnamon rolls", tags: ["dessert","baking","sweet","occasion"] },
  { path: "lib-23", alt: "Buddha bowl with tahini drizzle", tags: ["bowl","lunch","tahini","grain","veg","mediterranean"] },
  { path: "lib-24", alt: "Citrus halves on a wooden board", tags: ["citrus","produce","winter","seasonal","fruit","vitamin-c"] },
  { path: "lib-25", alt: "Hands kneading whole-wheat dough", tags: ["bread","baking","process","grain","staple"] },
  { path: "lib-26", alt: "Pan-seared portobello mushrooms", tags: ["mushrooms","dinner","umami","sear","weeknight"] },
  { path: "lib-27", alt: "Salad with peaches and arugula", tags: ["salad","summer","stone-fruit","seasonal","raw","greens"] },
  { path: "lib-28", alt: "Black bean tacos with lime", tags: ["tacos","dinner","protein","mex","handheld","quick","legumes"] },
  { path: "lib-29", alt: "Mason jar overnight oats", tags: ["breakfast","oats","make-ahead","fiber","staple"] },
  { path: "lib-30", alt: "Spread of hummus, olives, and pita", tags: ["mezze","snack","mediterranean","chickpeas","host"] },

  // 31-60: existing
  { path: "lib-31", alt: "Cabbage halved on dark linen", tags: ["cabbage","produce","cruciferous"] },
  { path: "lib-32", alt: "Mushroom risotto with parsley", tags: ["risotto","dinner","comfort","mushrooms","umami","grain"] },
  { path: "lib-33", alt: "Sliced strawberries fanned on yogurt", tags: ["berries","breakfast","yogurt","fruit","antioxidant"] },
  { path: "lib-34", alt: "Roasted carrots with cumin", tags: ["carrot","side","roast","produce","spice"] },
  { path: "lib-35", alt: "Watermelon slices on terracotta", tags: ["fruit","summer","watermelon","seasonal"] },
  { path: "lib-36", alt: "Chia pudding with mango", tags: ["chia","breakfast","tropical","seeds","omega3","fiber"] },
  { path: "lib-37", alt: "Lentil soup with crusty bread", tags: ["soup","dinner","protein","legumes","lentils","one-pot","comfort"] },
  { path: "lib-38", alt: "Stuffed bell peppers fresh from the oven", tags: ["peppers","dinner","vitamin-c","produce"] },
  { path: "lib-39", alt: "Pumpkin halves and seeds on linen", tags: ["pumpkin","fall","produce","seasonal","seeds"] },
  { path: "lib-40", alt: "Leafy green smoothie in a glass", tags: ["smoothie","greens","breakfast","blender","kale","spinach"] },

  // 41-80: themed expansion
  { path: "lib-41", alt: "Bowl of cooked brown rice", tags: ["brown-rice","grain","staple","pantry"] },
  { path: "lib-42", alt: "Tempeh strips marinating", tags: ["tempeh","soy","protein","ferment","staple"] },
  { path: "lib-43", alt: "Plate of tofu cubes seasoned", tags: ["tofu","soy","protein","staple"] },
  { path: "lib-44", alt: "Pile of dry chickpeas", tags: ["chickpeas","legumes","fiber","protein","pantry"] },
  { path: "lib-45", alt: "Bowl of dry green lentils", tags: ["lentils","legumes","fiber","protein","pantry"] },
  { path: "lib-46", alt: "Cauliflower head whole on linen", tags: ["cauliflower","produce","cruciferous","fiber"] },
  { path: "lib-47", alt: "Broccoli florets in a colander", tags: ["broccoli","produce","cruciferous","vitamin-c"] },
  { path: "lib-48", alt: "Sweet potato halves with rosemary", tags: ["sweet-potato","root","beta-carotene","produce"] },
  { path: "lib-49", alt: "Fresh spinach leaves spilling from a basket", tags: ["spinach","greens","iron","staple","produce"] },
  { path: "lib-50", alt: "Bowl of mixed berries", tags: ["berries","antioxidant","fruit","produce"] },
  { path: "lib-51", alt: "Walnuts cracked on a board", tags: ["walnuts","nuts","omega3","brain","fat","protein"] },
  { path: "lib-52", alt: "Almonds in a small bowl", tags: ["almonds","nuts","fat","protein","calcium","pantry"] },
  { path: "lib-53", alt: "Spoonful of chia seeds", tags: ["chia-seeds","seeds","omega3","fiber","pantry"] },
  { path: "lib-54", alt: "Flaxseeds in a jar", tags: ["flax-seeds","seeds","omega3","lignans","pantry","fiber"] },
  { path: "lib-55", alt: "Hemp seeds sprinkled on a smoothie", tags: ["hemp-seeds","seeds","protein","omega3","pantry"] },
  { path: "lib-56", alt: "Pumpkin seeds in a wooden scoop", tags: ["pumpkin-seeds","seeds","zinc","magnesium","pantry"] },
  { path: "lib-57", alt: "Jar of golden tahini", tags: ["tahini","sauce","calcium","staple","mediterranean","condiment"] },
  { path: "lib-58", alt: "Bottle and sprig of olive oil", tags: ["olive-oil","fat","mediterranean","staple","oil"] },
  { path: "lib-59", alt: "Bowl of red miso paste", tags: ["miso","umami","ferment","japanese","sauce","staple"] },
  { path: "lib-60", alt: "Nutritional yeast flakes", tags: ["nutritional-yeast","b12","cheesy","sprinkle","pantry"] },

  // 61-90: more themes
  { path: "lib-61", alt: "Sauerkraut in a glass jar", tags: ["sauerkraut","ferment","gut","probiotic","cabbage"] },
  { path: "lib-62", alt: "Bowl of millet porridge", tags: ["millet","grain","fiber","pantry","breakfast"] },
  { path: "lib-63", alt: "Buckwheat groats spilling out", tags: ["buckwheat","grain","gluten-free","pantry"] },
  { path: "lib-64", alt: "Pot of barley stew", tags: ["barley","grain","fiber","soup","one-pot","comfort"] },
  { path: "lib-65", alt: "Plate of plant burgers with greens", tags: ["burger","dinner","handheld","grill","weekend"] },
  { path: "lib-66", alt: "Tray of plant tacos with garnish", tags: ["tacos","dinner","handheld","mex","quick"] },
  { path: "lib-67", alt: "Slice of plant-based pizza", tags: ["pizza","weekend","cheese-free","occasion"] },
  { path: "lib-68", alt: "Plant-based dessert plate", tags: ["dessert","sweet","occasion","baking"] },
  { path: "lib-69", alt: "Breakfast spread on a wooden table", tags: ["breakfast","morning","routine","fruit","oats"] },
  { path: "lib-70", alt: "Curry simmering in a copper pot", tags: ["curry","one-pot","spice","comfort","dinner"] },
  { path: "lib-71", alt: "Bowl of lentil stew with parsley", tags: ["stew","one-pot","comfort","slow","legumes","lentils","dinner"] },
  { path: "lib-72", alt: "Stir-fry in a wok with steam rising", tags: ["stir-fry","wok","quick","weeknight","dinner","asian"] },
  { path: "lib-73", alt: "Wide salad bowl on linen", tags: ["salad","raw","quick","summer","produce"] },
  { path: "lib-74", alt: "Glass jar of fruit smoothie", tags: ["smoothie","breakfast","blender","fruit"] },
  { path: "lib-75", alt: "Mason jar of overnight oats with berries", tags: ["overnight-oats","breakfast","make-ahead","oats"] },
  { path: "lib-76", alt: "Open pantry shelves with grains and beans", tags: ["pantry","staples","budget","stock","legumes","grain"] },
  { path: "lib-77", alt: "Frozen vegetables in a tray", tags: ["freezer","batch","backup","frozen","produce"] },
  { path: "lib-78", alt: "Refrigerator drawer of produce", tags: ["fridge","fresh","weekly","produce"] },
  { path: "lib-79", alt: "Blender on a marble counter", tags: ["blender","tool","smoothie","sauce"] },
  { path: "lib-80", alt: "Instant Pot on a kitchen counter", tags: ["instant-pot","tool","pressure","beans","legumes"] },

  // 81-120: lifestyle / nutrition / theme expansion
  { path: "lib-81", alt: "Cast-iron skillet with sauteed greens", tags: ["skillet","tool","pan","sear","greens","weeknight"] },
  { path: "lib-82", alt: "Chef's knife on a wood board with vegetables", tags: ["knives","tool","knife","prep","produce"] },
  { path: "lib-83", alt: "Family meal at a table with kids", tags: ["kids","family","picky","easy"] },
  { path: "lib-84", alt: "Couple cooking together at home", tags: ["partner","compromise","host","weeknight"] },
  { path: "lib-85", alt: "Backpack with snacks ready for travel", tags: ["travel","airport","road","snack"] },
  { path: "lib-86", alt: "Bento box on an office desk", tags: ["office","lunch","desk","weekday","bento","container"] },
  { path: "lib-87", alt: "Long table set for a dinner party", tags: ["dinner-party","host","guest","menu","occasion"] },
  { path: "lib-88", alt: "Roasted holiday squash centerpiece", tags: ["thanksgiving","holiday","centerpiece","fall","squash"] },
  { path: "lib-89", alt: "Summer plate of tomatoes and corn", tags: ["summer","seasonal","fresh","raw","produce","tomato"] },
  { path: "lib-90", alt: "Steaming winter vegetable stew", tags: ["winter","seasonal","warming","stew","one-pot","comfort"] },
  { path: "lib-91", alt: "Reusable shopping tote with affordable staples", tags: ["budget","cheap","staples","pantry","produce"] },
  { path: "lib-92", alt: "Person doing yoga with a fruit plate nearby", tags: ["weight","metabolism","fitness","fruit"] },
  { path: "lib-93", alt: "Athlete eating a recovery bowl", tags: ["athletes","recovery","muscle","power","bowl","protein"] },
  { path: "lib-94", alt: "Toddler feeding themselves vegetables", tags: ["kids-nutrition","children","growth","family","produce"] },
  { path: "lib-95", alt: "Older adult with a colorful plate", tags: ["seniors","aging","longevity","produce"] },
  { path: "lib-96", alt: "Cup of chamomile tea on a nightstand", tags: ["sleep","tryptophan","mag","magnesium","calm"] },
  { path: "lib-97", alt: "Walnuts and berries arranged on a table", tags: ["brain","cognition","focus","omega","walnuts","berries"] },
  { path: "lib-98", alt: "Heart-healthy oats and berries breakfast", tags: ["heart","cholesterol","oats","fiber","berries"] },
  { path: "lib-99", alt: "Glass bowl of vibrant fruit for skin", tags: ["skin","collagen","glow","fruit","antioxidant"] },
  { path: "lib-100", alt: "Jars of fermented vegetables", tags: ["gut","microbiome","ferment","sauerkraut","probiotic"] },
  { path: "lib-101", alt: "Plate of soy and seed-based dinner", tags: ["hormones","estrogen","cycle","mood","soy"] },
  { path: "lib-102", alt: "Plant protein powder scoop", tags: ["protein","supplement","macros","muscle","powder"] },
  { path: "lib-103", alt: "B12 spray and supplement bottle", tags: ["b12","supplement","nerves"] },
  { path: "lib-104", alt: "Vitamin D3 capsule on a sunny windowsill", tags: ["vitamin-d","supplement","bone","mood"] },
  { path: "lib-105", alt: "Algae oil omega-3 capsules", tags: ["omega-3","supplement","brain","heart","algae"] },
  { path: "lib-106", alt: "Iron-rich greens and beans plate", tags: ["iron","greens","legumes","anemia","plate"] },
  { path: "lib-107", alt: "Calcium-rich tahini and greens", tags: ["calcium","tahini","greens","bone"] },
  { path: "lib-108", alt: "Zinc-rich pumpkin seeds plate", tags: ["zinc","seeds","pumpkin-seeds","immune"] },
  { path: "lib-109", alt: "Magnesium-rich dark chocolate squares", tags: ["magnesium","sleep","stress","chocolate"] },
  { path: "lib-110", alt: "Iodine-rich seaweed snack pack", tags: ["iodine","thyroid","seaweed","snack"] },
  { path: "lib-111", alt: "Ferment crock with cabbage", tags: ["ferment","gut","sauerkraut","cabbage","probiotic"] },
  { path: "lib-112", alt: "Whole-grain bowl topped with seeds", tags: ["bowl","grain","seeds","quinoa","fiber"] },
  { path: "lib-113", alt: "Bowl of tahini-dressed grain salad", tags: ["bowl","tahini","grain","mediterranean","staple"] },
  { path: "lib-114", alt: "Burger patty and side salad", tags: ["burger","weekend","handheld","salad","greens"] },
  { path: "lib-115", alt: "Tacos with avocado and lime", tags: ["tacos","avocado","handheld","mex","quick"] },
  { path: "lib-116", alt: "Pizza slice with greens on top", tags: ["pizza","greens","weekend","cheese-free"] },
  { path: "lib-117", alt: "Plate of plant tiramisu", tags: ["dessert","sweet","occasion","italian"] },
  { path: "lib-118", alt: "Granola, fruit, and yogurt parfait", tags: ["breakfast","yogurt","fruit","oats","make-ahead"] },
  { path: "lib-119", alt: "Hands holding warm, simmering soup", tags: ["soup","comfort","one-pot","winter","warming"] },
  { path: "lib-120", alt: "Bright fall harvest spread", tags: ["fall","seasonal","produce","host","squash","apple"] },
];

const LIBRARY_SIZE = LIBRARY.length;

export interface LibraryEntry {
  url: string;
  alt: string;
  tags: string[];
}

export function getLibraryEntry(index: number): LibraryEntry {
  const i = ((index % LIBRARY_SIZE) + LIBRARY_SIZE) % LIBRARY_SIZE;
  const meta = LIBRARY[i];
  const base = SITE.bunny.pullZone.replace(/\/+$/, "");
  return { url: `${base}/library/${meta.path}.webp`, alt: meta.alt, tags: meta.tags };
}

export function getLibrarySize(): number {
  return LIBRARY_SIZE;
}

export function listLibraryPaths(): string[] {
  return LIBRARY.map((e) => e.path);
}

/**
 * Score the library by tag overlap with the article's tags + slug, picks
 * a deterministic but topical hero. Master scope §9C.
 *
 * `claimedIndexes` lets the seeder pin one library entry per article so we
 * don't burn the same hero on multiple posts when the corpus is bigger
 * than the library.
 */
export function assignHeroImage(
  slug: string,
  articleTags: string[],
  claimedIndexes?: Set<number>,
): LibraryEntry {
  const seedHash = hash(slug);
  const lowered = articleTags
    .map((t) => t.toLowerCase())
    .concat(slug.toLowerCase().split(/[-_/]/));
  const scored = LIBRARY.map((meta, i) => {
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
  const lowered = articleTags
    .map((t) => t.toLowerCase())
    .concat(slug.toLowerCase().split(/[-_/]/));
  const seedHash = hash(slug);
  const scored = LIBRARY.map((meta, i) => {
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
