/**
 * 500-topic generator. Combines themes × angles to produce a deterministic,
 * unique, EEAT-friendly topic set. Used by the one-time bulk-seed only.
 */
import type { Topic, Category } from "./seed-data";

interface Theme {
  base: string;        // canonical base slug (e.g. "lentils")
  pretty: string;      // pretty title fragment
  category: Category;
  tags: string[];
  productTags: string[];
}

const THEMES: Theme[] = [
  { base: "lentils",     pretty: "Lentils",            category: "ingredients", tags: ["legumes","fiber","protein"], productTags: ["pantry","legume"] },
  { base: "chickpeas",   pretty: "Chickpeas",          category: "ingredients", tags: ["legumes","fiber","protein"], productTags: ["pantry","legume"] },
  { base: "tofu",        pretty: "Tofu",               category: "ingredients", tags: ["soy","protein","staple"],   productTags: ["pantry","soy"] },
  { base: "tempeh",      pretty: "Tempeh",             category: "ingredients", tags: ["soy","protein","ferment"],  productTags: ["pantry","soy"] },
  { base: "oats",        pretty: "Oats",               category: "ingredients", tags: ["breakfast","fiber","grain"], productTags: ["pantry","grain"] },
  { base: "quinoa",      pretty: "Quinoa",             category: "ingredients", tags: ["grain","protein","pantry"], productTags: ["pantry","grain"] },
  { base: "brown-rice",  pretty: "Brown rice",         category: "ingredients", tags: ["grain","staple","pantry"],  productTags: ["pantry","grain"] },
  { base: "millet",      pretty: "Millet",             category: "ingredients", tags: ["grain","fiber","pantry"],   productTags: ["pantry","grain"] },
  { base: "buckwheat",   pretty: "Buckwheat",          category: "ingredients", tags: ["grain","gluten-free"],      productTags: ["pantry","grain"] },
  { base: "barley",      pretty: "Barley",             category: "ingredients", tags: ["grain","fiber","soup"],     productTags: ["pantry","grain"] },
  { base: "kale",        pretty: "Kale",               category: "ingredients", tags: ["greens","calcium","iron"],  productTags: ["greens"] },
  { base: "spinach",     pretty: "Spinach",            category: "ingredients", tags: ["greens","iron","staple"],   productTags: ["greens"] },
  { base: "broccoli",    pretty: "Broccoli",           category: "ingredients", tags: ["cruciferous","vitamin-c"],  productTags: ["produce"] },
  { base: "cauliflower", pretty: "Cauliflower",        category: "ingredients", tags: ["cruciferous","fiber"],      productTags: ["produce"] },
  { base: "sweet-potato",pretty: "Sweet potato",       category: "ingredients", tags: ["root","beta-carotene"],     productTags: ["produce"] },
  { base: "mushrooms",   pretty: "Mushrooms",          category: "ingredients", tags: ["umami","b12-fortified"],    productTags: ["produce"] },
  { base: "avocado",     pretty: "Avocado",            category: "ingredients", tags: ["fat","creamy","staple"],    productTags: ["produce"] },
  { base: "berries",     pretty: "Berries",            category: "ingredients", tags: ["antioxidant","fruit"],      productTags: ["produce"] },
  { base: "bananas",     pretty: "Bananas",            category: "ingredients", tags: ["fruit","potassium"],         productTags: ["produce"] },
  { base: "almonds",     pretty: "Almonds",            category: "ingredients", tags: ["nuts","fat","protein"],     productTags: ["pantry","nuts"] },
  { base: "walnuts",     pretty: "Walnuts",            category: "ingredients", tags: ["nuts","omega3","brain"],    productTags: ["pantry","nuts"] },
  { base: "chia-seeds",  pretty: "Chia seeds",         category: "ingredients", tags: ["seeds","omega3","fiber"],   productTags: ["pantry","seeds"] },
  { base: "flax-seeds",  pretty: "Flaxseeds",          category: "ingredients", tags: ["seeds","omega3","lignans"], productTags: ["pantry","seeds"] },
  { base: "hemp-seeds",  pretty: "Hemp seeds",         category: "ingredients", tags: ["seeds","protein"],          productTags: ["pantry","seeds"] },
  { base: "pumpkin-seeds",pretty:"Pumpkin seeds",      category: "ingredients", tags: ["seeds","zinc","magnesium"], productTags: ["pantry","seeds"] },
  { base: "tahini",      pretty: "Tahini",             category: "ingredients", tags: ["sauce","calcium","staple"], productTags: ["pantry","condiment"] },
  { base: "olive-oil",   pretty: "Olive oil",          category: "ingredients", tags: ["fat","mediterranean"],      productTags: ["pantry","oil"] },
  { base: "miso",        pretty: "Miso",               category: "ingredients", tags: ["umami","ferment","japanese"],productTags: ["pantry","ferment"] },
  { base: "nutritional-yeast",pretty:"Nutritional yeast",category:"ingredients",tags:["b12","cheesy","sprinkle"],   productTags: ["pantry","supplement"] },
  { base: "sauerkraut",  pretty: "Sauerkraut",         category: "ingredients", tags: ["ferment","gut","probiotic"], productTags: ["ferment"] },

  { base: "fiber",       pretty: "Fiber",              category: "nutrition",   tags: ["fiber","gut","metabolism"],  productTags: ["supplement"] },
  { base: "protein",     pretty: "Plant protein",      category: "nutrition",   tags: ["protein","macros","muscle"], productTags: ["supplement"] },
  { base: "iron",        pretty: "Iron",               category: "nutrition",   tags: ["iron","anemia","greens"],    productTags: ["supplement"] },
  { base: "calcium",     pretty: "Calcium",            category: "nutrition",   tags: ["calcium","bone"],            productTags: ["supplement"] },
  { base: "b12",         pretty: "Vitamin B12",        category: "nutrition",   tags: ["b12","nerves","supplement"], productTags: ["supplement"] },
  { base: "vitamin-d",   pretty: "Vitamin D",          category: "nutrition",   tags: ["vitamin-d","bone","mood"],   productTags: ["supplement"] },
  { base: "omega-3",     pretty: "Omega-3 (ALA, EPA, DHA)",category:"nutrition",tags:["omega3","brain","heart"],    productTags: ["supplement"] },
  { base: "zinc",        pretty: "Zinc",               category: "nutrition",   tags: ["zinc","immune","seeds"],     productTags: ["supplement"] },
  { base: "magnesium",   pretty: "Magnesium",          category: "nutrition",   tags: ["magnesium","sleep","stress"],productTags: ["supplement"] },
  { base: "iodine",      pretty: "Iodine",             category: "nutrition",   tags: ["iodine","thyroid","seaweed"],productTags: ["supplement"] },

  { base: "buddha-bowl", pretty: "Buddha bowls",       category: "recipes",     tags: ["bowl","grain","veg"],        productTags: ["bowl","cookbook"] },
  { base: "grain-bowl",  pretty: "Grain bowls",        category: "recipes",     tags: ["bowl","grain","quick"],      productTags: ["bowl","cookbook"] },
  { base: "stir-fry",    pretty: "Stir-fries",         category: "recipes",     tags: ["wok","quick","weeknight"],   productTags: ["pan","wok"] },
  { base: "curry",       pretty: "Curries",            category: "recipes",     tags: ["one-pot","spice","comfort"], productTags: ["pan","spice"] },
  { base: "soup",        pretty: "Soups",              category: "recipes",     tags: ["one-pot","seasonal","comfort"],productTags:["pot","cookbook"] },
  { base: "stew",        pretty: "Stews",              category: "recipes",     tags: ["one-pot","comfort","slow"],  productTags: ["pot","cookbook"] },
  { base: "pasta",       pretty: "Pasta",              category: "recipes",     tags: ["weeknight","carb","sauce"],  productTags: ["cookbook"] },
  { base: "salad",       pretty: "Salads",             category: "recipes",     tags: ["raw","quick","summer"],      productTags: ["cookbook"] },
  { base: "smoothie",    pretty: "Smoothies",          category: "recipes",     tags: ["breakfast","blender","fruit"],productTags:["blender"] },
  { base: "overnight-oats",pretty:"Overnight oats",    category: "recipes",     tags: ["breakfast","make-ahead"],    productTags: ["pantry"] },
  { base: "burger",      pretty: "Plant burgers",      category: "recipes",     tags: ["dinner","handheld","grill"], productTags: ["cookbook"] },
  { base: "tacos",       pretty: "Plant tacos",        category: "recipes",     tags: ["mex","handheld","quick"],    productTags: ["cookbook"] },
  { base: "pizza",       pretty: "Plant pizza",        category: "recipes",     tags: ["weekend","cheese-free"],     productTags: ["cookbook"] },
  { base: "dessert",     pretty: "Dessert",            category: "recipes",     tags: ["sweet","occasion"],          productTags: ["cookbook"] },
  { base: "breakfast",   pretty: "Breakfast",          category: "recipes",     tags: ["morning","routine"],         productTags: ["cookbook"] },

  { base: "pantry",      pretty: "Pantry",             category: "shopping",    tags: ["staples","budget","stock"],  productTags: ["pantry"] },
  { base: "freezer",     pretty: "Freezer",            category: "shopping",    tags: ["batch","backup","frozen"],   productTags: ["pantry","frozen"] },
  { base: "fridge",      pretty: "Fridge",             category: "shopping",    tags: ["fresh","weekly","produce"],  productTags: ["produce"] },
  { base: "blender",     pretty: "Blender",            category: "shopping",    tags: ["tool","smoothie","sauce"],   productTags: ["blender","tool"] },
  { base: "instant-pot", pretty: "Instant Pot",        category: "shopping",    tags: ["tool","pressure","beans"],   productTags: ["pressure-cooker","tool"] },
  { base: "skillet",     pretty: "Cast-iron skillet",  category: "shopping",    tags: ["tool","pan","sear"],         productTags: ["pan","tool"] },
  { base: "knives",      pretty: "Chef's knife",       category: "shopping",    tags: ["tool","knife","prep"],       productTags: ["knife","tool"] },

  { base: "kids",        pretty: "Cooking for kids",   category: "lifestyle",   tags: ["family","picky","easy"],     productTags: ["cookbook"] },
  { base: "partner",     pretty: "Cooking with a meat-eater partner",category:"lifestyle",tags:["partner","compromise"],productTags:["cookbook"] },
  { base: "travel",      pretty: "Plant-based travel", category: "lifestyle",   tags: ["travel","airport","road"],   productTags: ["snack","bar"] },
  { base: "office",      pretty: "Office lunches",     category: "lifestyle",   tags: ["lunch","desk","weekday"],    productTags: ["bento","container"] },
  { base: "dinner-party",pretty: "Dinner parties",     category: "lifestyle",   tags: ["host","guest","menu"],       productTags: ["cookbook"] },
  { base: "thanksgiving",pretty: "Thanksgiving",       category: "lifestyle",   tags: ["holiday","centerpiece"],     productTags: ["cookbook"] },
  { base: "summer",      pretty: "Summer plant cooking",category:"lifestyle",   tags: ["seasonal","fresh","raw"],    productTags: ["produce"] },
  { base: "winter",      pretty: "Winter plant cooking",category:"lifestyle",   tags: ["seasonal","warming","stew"], productTags: ["pot"] },
  { base: "budget",      pretty: "Plant-based on a budget",category:"lifestyle",tags: ["budget","cheap","staples"],  productTags: ["pantry"] },
  { base: "weight",      pretty: "Eating plants and weight",category:"nutrition",tags:["weight","metabolism"],       productTags: ["supplement"] },
  { base: "athletes",    pretty: "Plants for athletes", category:"nutrition",   tags: ["recovery","muscle","power"], productTags: ["supplement"] },
  { base: "kids-nutrition",pretty:"Plants for growing kids",category:"nutrition",tags:["children","growth"],         productTags: ["supplement"] },
  { base: "seniors",     pretty: "Plants in your sixties+",category:"nutrition",tags: ["aging","longevity"],         productTags: ["supplement"] },
  { base: "sleep",       pretty: "Plants and sleep",   category: "nutrition",   tags: ["sleep","tryptophan","mag"],  productTags: ["supplement"] },
  { base: "brain",       pretty: "Plants for the brain",category:"nutrition",   tags: ["cognition","focus","omega"], productTags: ["supplement"] },
  { base: "heart",       pretty: "Plants for the heart",category:"nutrition",   tags: ["cholesterol","heart"],       productTags: ["supplement"] },
  { base: "skin",        pretty: "Plants for skin",    category: "nutrition",   tags: ["skin","collagen","glow"],    productTags: ["supplement"] },
  { base: "gut",         pretty: "Plants for the gut", category: "nutrition",   tags: ["microbiome","gut","ferment"],productTags: ["supplement"] },
  { base: "hormones",    pretty: "Plants and hormones",category: "nutrition",   tags: ["estrogen","cycle","mood"],   productTags: ["supplement"] },
];

interface Angle {
  suffix: string;       // slug suffix
  titleFmt: string;     // {N} = pretty
  metaFmt: string;
  type: Topic["type"];
}

const ANGLES: Angle[] = [
  { suffix: "for-beginners",                titleFmt: "{N} for beginners",                              metaFmt: "A friendly introduction to {n}, with no jargon and no purity tests.",                    type: "starter" },
  { suffix: "the-honest-guide",             titleFmt: "The honest guide to {n}",                         metaFmt: "What {n} actually does for you, what it doesn't, and what to do tomorrow morning.",     type: "guide" },
  { suffix: "what-i-buy-and-why",           titleFmt: "{N}: what I buy and why",                         metaFmt: "The {n} brands and varieties that earn their shelf space, and the ones I skip.",       type: "spotlight" },
  { suffix: "vs-the-marketing",             titleFmt: "{N} vs the marketing",                            metaFmt: "What the label says about {n} versus what's actually in the bowl.",                    type: "explainer" },
  { suffix: "in-thirty-minutes",            titleFmt: "{N} dinner in thirty minutes",                    metaFmt: "A weeknight {n} plan you can pull off after a long day.",                              type: "recipe" },
  { suffix: "five-ways",                    titleFmt: "Five ways to use {n} this week",                 metaFmt: "Stretch one batch of {n} into five different dinners without getting bored.",          type: "recipe" },
  { suffix: "starter-recipe",               titleFmt: "A starter {n} recipe that works",                 metaFmt: "The first {n} recipe to teach yourself, why it works, and how to riff on it.",        type: "recipe" },
  { suffix: "make-it-cheaper",              titleFmt: "How to do {n} for less money",                    metaFmt: "Cutting the price of {n} without cutting the quality.",                                type: "guide" },
  { suffix: "common-mistakes",              titleFmt: "The common mistakes with {n}",                    metaFmt: "Why {n} sometimes goes sideways, and how to recover the dish.",                       type: "explainer" },
  { suffix: "a-week-of-it",                 titleFmt: "A week with {n} on the menu",                     metaFmt: "Seven days of {n} dinners and what changed for me.",                                  type: "guide" },
  { suffix: "a-month-of-it",                titleFmt: "A month of cooking more {n}",                     metaFmt: "Thirty days of leaning into {n} and what I'd tell a friend at the end.",             type: "guide" },
  { suffix: "starter-shopping-list",        titleFmt: "{N}: the starter shopping list",                  metaFmt: "What to put in the cart the very first time you try {n} at home.",                    type: "starter" },
  { suffix: "what-the-research-says",       titleFmt: "{N}: what the research actually says",            metaFmt: "An honest read of the recent {n} science without the headlines.",                      type: "explainer" },
  { suffix: "compared-to-the-alternative", titleFmt: "{N} compared to the obvious alternative",          metaFmt: "Where {n} wins, where it loses, and which one I'd buy this week.",                    type: "compare" },
  { suffix: "for-busy-weeknights",          titleFmt: "{N} for the busy weeknight cook",                 metaFmt: "Fast, low-effort {n} that survives a Tuesday with no patience.",                       type: "recipe" },
  { suffix: "for-the-skeptic",              titleFmt: "{N} for the skeptical eater",                     metaFmt: "Reasons to give {n} a fair shot when nothing about it sounds appealing yet.",         type: "explainer" },
  { suffix: "and-what-to-skip",             titleFmt: "What to embrace and what to skip with {n}",       metaFmt: "The parts of the {n} world worth your money and the parts that aren't.",              type: "spotlight" },
];

function makeMeta(theme: Theme, angle: Angle): { title: string; meta: string; pkw: string } {
  const N = theme.pretty;
  const n = theme.pretty.toLowerCase();
  return {
    title: angle.titleFmt.replace("{N}", N).replace("{n}", n),
    meta: angle.metaFmt.replace("{N}", N).replace("{n}", n),
    pkw: `${theme.base.replace(/-/g, " ")} ${angle.suffix.replace(/-/g, " ")}`,
  };
}

/**
 * Builds a deterministic 500-topic list. Cap is enforced.
 */
export function buildTopicBank(limit = 500): Topic[] {
  const out: Topic[] = [];
  const usedSlugs = new Set<string>();
  for (const angle of ANGLES) {
    for (const theme of THEMES) {
      const slug = `${theme.base}-${angle.suffix}`;
      if (usedSlugs.has(slug)) continue;
      usedSlugs.add(slug);
      const m = makeMeta(theme, angle);
      out.push({
        slug,
        title: m.title,
        metaDescription: m.meta,
        category: theme.category,
        tags: theme.tags,
        primaryKeyword: m.pkw,
        secondaryKeywords: [theme.pretty.toLowerCase(), angle.suffix.replace(/-/g, " ")],
        productTags: theme.productTags,
        type: angle.type,
      });
      if (out.length >= limit) return out;
    }
  }
  return out.slice(0, limit);
}
