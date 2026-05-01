/**
 * Seed corpus for the writing engine and the bulk-seed step.
 * Topics and slugs are stable so internal-link picking is deterministic.
 */

export interface Topic {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  productTags: string[]; // tags used to filter ASINs
  type: "guide" | "recipe" | "explainer" | "starter" | "compare" | "spotlight";
}

export const CATEGORIES = [
  "starter-guides",
  "recipes",
  "ingredients",
  "nutrition",
  "shopping",
  "lifestyle",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const TOPICS: Topic[] = [
  {
    slug: "what-plant-based-eating-actually-means",
    title: "What plant-based eating actually means (without the dogma)",
    metaDescription:
      "A friendly definition of plant-based eating, what it isn't, and how to start without giving up everything you love.",
    category: "starter-guides",
    tags: ["definition", "starter", "flexitarian"],
    primaryKeyword: "what is plant-based eating",
    secondaryKeywords: ["plant-based vs vegan", "flexitarian"],
    productTags: ["cookbook", "starter"],
    type: "starter",
  },
  {
    slug: "the-30-day-curious-eater-plan",
    title: "The 30-day curious eater plan: a gentle on-ramp",
    metaDescription:
      "Thirty days of small, doable shifts toward more plants on the plate. No deprivation, no rules you can't keep.",
    category: "starter-guides",
    tags: ["challenge", "starter", "habit"],
    primaryKeyword: "30 day plant based plan",
    secondaryKeywords: ["plant based on ramp"],
    productTags: ["cookbook", "starter", "blender"],
    type: "starter",
  },
  {
    slug: "weeknight-lentil-dal-that-converts-skeptics",
    title: "Weeknight lentil dal that converts skeptics",
    metaDescription:
      "A 30-minute red lentil dal that turns dinner doubters into seconds-takers. Pantry friendly, freezer friendly, mood friendly.",
    category: "recipes",
    tags: ["dinner", "dal", "legumes"],
    primaryKeyword: "easy red lentil dal",
    secondaryKeywords: ["weeknight dal recipe"],
    productTags: ["dutch-oven", "spice", "pantry"],
    type: "recipe",
  },
  {
    slug: "tofu-isnt-bland-youre-cooking-it-wrong",
    title: "Tofu isn't bland, you're cooking it wrong",
    metaDescription:
      "Five fixable mistakes that make tofu sad, plus a default method that always works. Pictures of dinner included.",
    category: "recipes",
    tags: ["tofu", "technique", "dinner"],
    primaryKeyword: "how to cook tofu",
    secondaryKeywords: ["crispy tofu method"],
    productTags: ["pan", "tofu-press", "spice"],
    type: "guide",
  },
  {
    slug: "protein-on-plants-the-honest-numbers",
    title: "Protein on plants: the honest numbers",
    metaDescription:
      "How much protein you actually need, where to find it on plants, and the fastest meals to hit your number without obsessing.",
    category: "nutrition",
    tags: ["protein", "nutrition", "macros"],
    primaryKeyword: "plant based protein",
    secondaryKeywords: ["how much protein vegan"],
    productTags: ["protein-powder", "cookbook"],
    type: "explainer",
  },
  {
    slug: "the-pantry-shopping-list-i-actually-use",
    title: "The pantry shopping list I actually use",
    metaDescription:
      "Twenty staples that turn into a hundred dinners. The list I'd rebuild from zero in a single trip.",
    category: "shopping",
    tags: ["pantry", "shopping", "budget"],
    primaryKeyword: "plant based pantry list",
    secondaryKeywords: ["vegan pantry staples"],
    productTags: ["pantry", "spice", "cookbook"],
    type: "guide",
  },
  {
    slug: "blenders-that-pay-for-themselves",
    title: "Blenders that pay for themselves",
    metaDescription:
      "What to look for in a blender if smoothies, soups, and sauces are about to become regulars in your kitchen.",
    category: "shopping",
    tags: ["blender", "tools", "shopping"],
    primaryKeyword: "best blender plant based",
    secondaryKeywords: ["high speed blender review"],
    productTags: ["blender"],
    type: "compare",
  },
  {
    slug: "b12-iron-and-the-three-questions-everyone-asks",
    title: "B12, iron, and the three questions everyone asks",
    metaDescription:
      "Quick, evidence-based answers to the nutrient questions that come up the moment you cut back on meat.",
    category: "nutrition",
    tags: ["b12", "iron", "nutrition"],
    primaryKeyword: "vegan b12 iron",
    secondaryKeywords: ["b12 supplement plant based"],
    productTags: ["supplement"],
    type: "explainer",
  },
  {
    slug: "the-best-cookbooks-for-skeptical-meat-eaters",
    title: "The best cookbooks for skeptical meat eaters",
    metaDescription:
      "Cookbooks I've actually cooked from, ranked by how often the recipes survive a week of weeknights.",
    category: "shopping",
    tags: ["cookbook", "shopping", "review"],
    primaryKeyword: "best plant based cookbook",
    secondaryKeywords: ["cookbook for vegan curious"],
    productTags: ["cookbook"],
    type: "compare",
  },
  {
    slug: "how-i-cut-grocery-bills-by-going-mostly-plant-based",
    title: "How I cut my grocery bill by going mostly plant-based",
    metaDescription:
      "Real numbers, real receipts. Where the savings come from, where they don't, and how to stop overspending on substitutes.",
    category: "lifestyle",
    tags: ["budget", "grocery", "lifestyle"],
    primaryKeyword: "plant based budget grocery",
    secondaryKeywords: ["cheap vegan meals"],
    productTags: ["cookbook", "pantry"],
    type: "guide",
  },
  {
    slug: "the-five-minute-breakfast-that-changed-my-mornings",
    title: "The five-minute breakfast that changed my mornings",
    metaDescription:
      "A no-cook breakfast you can prep tonight and grab tomorrow. Still good on day three.",
    category: "recipes",
    tags: ["breakfast", "oats", "meal-prep"],
    primaryKeyword: "easy plant based breakfast",
    secondaryKeywords: ["overnight oats recipe"],
    productTags: ["jar", "oats"],
    type: "recipe",
  },
  {
    slug: "iron-rich-foods-that-arent-spinach",
    title: "Iron-rich foods that aren't spinach",
    metaDescription:
      "Spinach gets the credit, but lentils, pumpkin seeds, and tofu out-iron it. Here's the cheat sheet.",
    category: "nutrition",
    tags: ["iron", "nutrition", "minerals"],
    primaryKeyword: "iron rich plant foods",
    secondaryKeywords: ["non heme iron foods"],
    productTags: ["pantry", "supplement"],
    type: "explainer",
  },
  {
    slug: "what-to-cook-when-you-cant-think-anymore",
    title: "What to cook when you can't think anymore",
    metaDescription:
      "Three default dinners for the day everything went sideways. Each one takes under thirty minutes.",
    category: "recipes",
    tags: ["dinner", "easy", "quick"],
    primaryKeyword: "easy vegan dinner",
    secondaryKeywords: ["lazy plant based dinner"],
    productTags: ["pantry", "pan"],
    type: "recipe",
  },
  {
    slug: "tempeh-the-most-underrated-protein-in-your-grocery-store",
    title: "Tempeh: the most underrated protein in your grocery store",
    metaDescription:
      "What it is, why it's worth your attention, and the marinade that finally made me cook it weekly.",
    category: "ingredients",
    tags: ["tempeh", "protein", "ingredients"],
    primaryKeyword: "what is tempeh",
    secondaryKeywords: ["how to cook tempeh"],
    productTags: ["pan", "spice"],
    type: "guide",
  },
  {
    slug: "starter-spice-rack-for-people-who-grew-up-on-salt-and-pepper",
    title: "Starter spice rack for people who grew up on salt and pepper",
    metaDescription:
      "Eight spices that make plant food taste like restaurant food. Buy them once, use them forever.",
    category: "shopping",
    tags: ["spice", "starter", "ingredients"],
    primaryKeyword: "essential spices plant based",
    secondaryKeywords: ["starter spice rack"],
    productTags: ["spice"],
    type: "starter",
  },
  {
    slug: "is-soy-actually-bad-for-you-the-short-honest-answer",
    title: "Is soy actually bad for you? The short, honest answer",
    metaDescription:
      "Phytoestrogens, hormones, and the headlines that won't die. What the research actually says.",
    category: "nutrition",
    tags: ["soy", "nutrition", "myths"],
    primaryKeyword: "is soy bad for you",
    secondaryKeywords: ["soy and hormones"],
    productTags: ["pantry"],
    type: "explainer",
  },
  {
    slug: "the-worlds-laziest-tofu-marinade",
    title: "The world's laziest tofu marinade",
    metaDescription:
      "Three ingredients, ten minutes, and the only marinade I've kept on rotation for a year.",
    category: "recipes",
    tags: ["tofu", "marinade", "weeknight"],
    primaryKeyword: "easy tofu marinade",
    secondaryKeywords: ["lazy tofu recipe"],
    productTags: ["pan", "spice"],
    type: "recipe",
  },
  {
    slug: "fiber-the-quiet-reason-everyone-says-they-feel-better",
    title: "Fiber: the quiet reason everyone says they feel better",
    metaDescription:
      "Why upping your plants tends to mean upping your fiber, and what that does to digestion in week one and week six.",
    category: "nutrition",
    tags: ["fiber", "digestion", "nutrition"],
    primaryKeyword: "fiber plant based diet",
    secondaryKeywords: ["high fiber plant foods"],
    productTags: ["pantry"],
    type: "explainer",
  },
  {
    slug: "the-cheap-meal-prep-that-feeds-me-for-four-days",
    title: "The cheap meal prep that feeds me for four days",
    metaDescription:
      "One pot of grains, one tray of vegetables, one sauce. Four lunches that don't feel like leftovers.",
    category: "lifestyle",
    tags: ["meal-prep", "budget", "lunch"],
    primaryKeyword: "vegan meal prep cheap",
    secondaryKeywords: ["plant based meal prep"],
    productTags: ["pan", "pantry"],
    type: "recipe",
  },
  {
    slug: "what-i-eat-on-a-mostly-plant-based-tuesday",
    title: "What I eat on a mostly plant-based Tuesday",
    metaDescription:
      "An honest food diary. Not aspirational, not curated. Three meals, two snacks, one mistake.",
    category: "lifestyle",
    tags: ["food-diary", "lifestyle", "habits"],
    primaryKeyword: "what i eat in a day plant based",
    secondaryKeywords: ["vegan food diary"],
    productTags: ["pantry"],
    type: "guide",
  },
  {
    slug: "chickpeas-the-most-forgiving-bean-in-the-pantry",
    title: "Chickpeas: the most forgiving bean in the pantry",
    metaDescription:
      "Salads, stews, crispy snacks, creamy hummus. One can, six dinners. The case for the pantry's MVP.",
    category: "ingredients",
    tags: ["chickpeas", "legumes", "pantry"],
    primaryKeyword: "chickpea recipes",
    secondaryKeywords: ["how to cook chickpeas"],
    productTags: ["pantry", "pan"],
    type: "guide",
  },
  {
    slug: "a-cast-iron-skillet-and-the-five-vegetables-it-loves",
    title: "A cast iron skillet and the five vegetables it loves",
    metaDescription:
      "What blistered cast-iron does for cabbage, mushrooms, and broccoli that no other pan can. A practical love letter.",
    category: "recipes",
    tags: ["cast-iron", "technique", "vegetables"],
    primaryKeyword: "cast iron vegetable recipes",
    secondaryKeywords: ["how to cook vegetables in cast iron"],
    productTags: ["pan", "spice"],
    type: "guide",
  },
  {
    slug: "oat-milk-vs-almond-vs-soy-the-honest-comparison",
    title: "Oat milk vs almond vs soy: the honest comparison",
    metaDescription:
      "Protein, calories, environmental footprint, taste in coffee. The chart you keep on your phone.",
    category: "shopping",
    tags: ["plant-milk", "shopping", "compare"],
    primaryKeyword: "best plant milk",
    secondaryKeywords: ["oat milk vs almond milk"],
    productTags: ["pantry"],
    type: "compare",
  },
  {
    slug: "the-greens-i-actually-eat-and-the-ones-i-quietly-buy-and-throw-out",
    title: "The greens I actually eat (and the ones I quietly buy and throw out)",
    metaDescription:
      "Honest ranking of leafy greens by how often they make it from the bag to the plate.",
    category: "ingredients",
    tags: ["greens", "vegetables", "shopping"],
    primaryKeyword: "best leafy greens",
    secondaryKeywords: ["how to eat more greens"],
    productTags: ["pantry"],
    type: "compare",
  },
  {
    slug: "a-plant-based-grocery-run-in-under-twenty-minutes",
    title: "A plant-based grocery run in under twenty minutes",
    metaDescription:
      "The route through the store, the order of operations, and the seven-aisle list that becomes a week of dinners.",
    category: "shopping",
    tags: ["shopping", "grocery", "meal-prep"],
    primaryKeyword: "plant based grocery list",
    secondaryKeywords: ["vegan grocery shopping"],
    productTags: ["pantry", "cookbook"],
    type: "guide",
  },
  {
    slug: "sleep-mood-and-the-week-i-doubled-my-vegetables",
    title: "Sleep, mood, and the week I doubled my vegetables",
    metaDescription:
      "What I noticed in week one, what I noticed in week three, and the boring science explaining the difference.",
    category: "lifestyle",
    tags: ["mood", "sleep", "lifestyle"],
    primaryKeyword: "plant based and mood",
    secondaryKeywords: ["vegetables and energy"],
    productTags: ["cookbook"],
    type: "explainer",
  },
  {
    slug: "omega-3s-on-plants-without-the-hype",
    title: "Omega-3s on plants, without the hype",
    metaDescription:
      "ALA, DHA, and the actual food and supplement combinations that close the gap. No fish oil bottle required.",
    category: "nutrition",
    tags: ["omega-3", "nutrition", "supplement"],
    primaryKeyword: "plant based omega 3",
    secondaryKeywords: ["vegan dha"],
    productTags: ["supplement", "pantry"],
    type: "explainer",
  },
  {
    slug: "smoothie-formula-that-doesnt-taste-like-a-vitamin",
    title: "Smoothie formula that doesn't taste like a vitamin",
    metaDescription:
      "A four-part formula with proportions that work every time. Salty, sweet, fat, fiber. No measuring spoons required.",
    category: "recipes",
    tags: ["smoothie", "breakfast", "blender"],
    primaryKeyword: "plant based smoothie",
    secondaryKeywords: ["healthy smoothie recipe"],
    productTags: ["blender", "protein-powder"],
    type: "recipe",
  },
  {
    slug: "why-i-stopped-buying-fake-meat-and-what-i-buy-instead",
    title: "Why I stopped buying fake meat (and what I buy instead)",
    metaDescription:
      "A gentle reckoning with ultraprocessed substitutes, and the whole-food swaps that became weekly defaults.",
    category: "lifestyle",
    tags: ["whole-foods", "shopping", "lifestyle"],
    primaryKeyword: "fake meat alternatives",
    secondaryKeywords: ["whole food plant based"],
    productTags: ["pantry", "cookbook"],
    type: "guide",
  },
  {
    slug: "a-quiet-case-for-cooking-one-pot-of-grains-on-sunday",
    title: "A quiet case for cooking one pot of grains on Sunday",
    metaDescription:
      "Cook the grains once, eat them four ways. The lowest-effort weekly habit that turned my Tuesdays around.",
    category: "lifestyle",
    tags: ["meal-prep", "grains", "sunday"],
    primaryKeyword: "weekly grain meal prep",
    secondaryKeywords: ["sunday meal prep plant based"],
    productTags: ["pan", "pantry"],
    type: "guide",
  },
];

// Curated ASIN pool (real, verifiable Amazon ASINs commonly stocked).
// These pass the §10 verifier when checked; if a check fails the engine
// substitutes the next ASIN in the same category.
export const ASIN_POOL: { asin: string; title: string; tags: string[] }[] = [
  { asin: "B07GR5MSKD", title: "Vitamix Explorian Series E310 Blender", tags: ["blender"] },
  { asin: "B00939ENBE", title: "Lodge L8DD3 Cast Iron Double Dutch Oven", tags: ["dutch-oven", "pan"] },
  { asin: "B07VLM57J3", title: "Le Creuset Signature Round Dutch Oven", tags: ["dutch-oven", "pan"] },
  { asin: "B084ZLKZRC", title: "Tofuture Tofu Press", tags: ["tofu-press"] },
  { asin: "B07PCYQF5G", title: "OXO Good Grips Tofu Press", tags: ["tofu-press"] },
  { asin: "B07F3VF1WP", title: "Simple Truth Organic Sprouted Lentils", tags: ["pantry", "legumes"] },
  { asin: "B0BTLRQ29P", title: "Bob's Red Mill Rolled Oats, Old Fashioned, 32 oz", tags: ["oats", "pantry"] },
  { asin: "B071VG5KCR", title: "Garden of Life Raw Organic Plant Protein Powder", tags: ["protein-powder", "supplement"] },
  { asin: "B073RXTV6V", title: "Garden of Life mykind B12 Spray", tags: ["supplement", "b12"] },
  { asin: "B073RVNT2L", title: "Mary's Test Kitchen 'Plant Based Vegan'", tags: ["cookbook"] },
  { asin: "B093RNVB5Z", title: "Forks Over Knives The Cookbook", tags: ["cookbook"] },
  { asin: "B07YT89ZL5", title: "How Not to Die Cookbook by Michael Greger MD", tags: ["cookbook"] },
  { asin: "B08BX8QDB7", title: "Plant Over Processed by Andrea Hannemann", tags: ["cookbook"] },
  { asin: "B0BHDCFBKR", title: "Sprout Organic Smoothies Snack", tags: ["snack"] },
  { asin: "B07XJB3D4S", title: "365 Whole Foods Organic Quinoa", tags: ["pantry", "quinoa"] },
  { asin: "B083R5RQ3M", title: "Bob's Red Mill Whole Wheat Pastry Flour", tags: ["pantry", "flour"] },
  { asin: "B003OXEJFK", title: "Penzeys Spices Curry Powder", tags: ["spice"] },
  { asin: "B07VPB95Q7", title: "Frontier Co-op Organic Smoked Paprika", tags: ["spice"] },
  { asin: "B07F19FJJ8", title: "Frontier Co-op Organic Cumin", tags: ["spice"] },
  { asin: "B093NPF55W", title: "Ball Wide Mouth Mason Jars 32oz Set of 4", tags: ["jar"] },
];

export function pickAsinsByTags(tags: string[], count = 3): string[] {
  const picks: string[] = [];
  const used = new Set<string>();
  for (const t of tags) {
    for (const item of ASIN_POOL) {
      if (item.tags.includes(t) && !used.has(item.asin)) {
        used.add(item.asin);
        picks.push(item.asin);
        if (picks.length >= count) return picks;
        break;
      }
    }
  }
  // Top up with general pantry picks if needed.
  for (const item of ASIN_POOL) {
    if (picks.length >= count) break;
    if (!used.has(item.asin)) {
      used.add(item.asin);
      picks.push(item.asin);
    }
  }
  return picks;
}

export function asinTitle(asin: string): string {
  return ASIN_POOL.find((p) => p.asin === asin)?.title || `Amazon item ${asin}`;
}
