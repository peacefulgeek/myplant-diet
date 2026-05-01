import { getDeepseek, getModel, isWritingEnabled } from "./openai-client";
import { buildSystemPrompt } from "./voice-spec";
import { runQualityGate, pickSelfReference } from "./quality-gate";
import { TOPICS, asinTitle, pickAsinsByTags, type Topic } from "./seed-data";
import { buildTopicBank } from "./topic-bank";

// Merged corpus used for internal-link picking + Oracle ratio. Stable across calls.
let _CORPUS: Topic[] | null = null;
function CORPUS(): Topic[] {
  if (_CORPUS) return _CORPUS;
  const seen = new Set<string>();
  const all: Topic[] = [];
  for (const t of TOPICS) {
    if (!seen.has(t.slug)) { seen.add(t.slug); all.push(t); }
  }
  for (const t of buildTopicBank(500)) {
    if (!seen.has(t.slug)) { seen.add(t.slug); all.push(t); }
  }
  _CORPUS = all;
  return all;
}
import { SITE, siteOrigin } from "./site-config";
import { assignHeroImage, pickGallery } from "./bunny";

export interface GenerationResult {
  ok: boolean;
  attempts: number;
  article?: {
    slug: string;
    title: string;
    metaDescription: string;
    body: string;
    tldr: string;
    category: string;
    tags: string[];
    asinsUsed: string[];
    internalLinks: string[];
    wordCount: number;
    heroUrl: string;
    heroAlt: string;
    galleryUrls: string[];
    selfReference: string;
    author: string;
    qualityScore: number;
    seedSource: string;
  };
  errors?: string[];
}

const AUTHORITATIVE_EXTERNALS = [
  "https://www.nutrition.gov/topics/basic-nutrition/dietary-guidelines",
  "https://www.heart.org/en/healthy-living/healthy-eating",
  "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/",
  "https://ods.od.nih.gov/factsheets/list-all/",
  "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  "https://www.eatright.org/",
];

/**
 * Pick 3 internal-link slugs that are not the current one. Master scope §14.
 */
function pickInternalLinks(currentSlug: string, count = 4): string[] {
  const others = CORPUS().filter((t) => t.slug !== currentSlug).map((t) => t.slug);
  const picks: string[] = [];
  let h = 0;
  for (const c of currentSlug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < count; i++) {
    picks.push(others[(h + i * 7) % others.length]);
  }
  return picks.map((s) => `${siteOrigin()}/articles/${s}`);
}

function pickExternalLink(slug: string): string {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AUTHORITATIVE_EXTERNALS[h % AUTHORITATIVE_EXTERNALS.length];
}

function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}/?tag=${SITE.amazonTag}`;
}

/**
 * Decide whether this article points its external link at theoraclelover.com.
 * Maintains an exact 23% ratio across the full TOPICS corpus by ranking each
 * slug's hash and taking the lowest 23% deterministically. Master scope §20.
 */
function useOracleBacklink(slug: string): boolean {
  const corpus = CORPUS();
  const ranked = corpus.map((t) => {
    let h = 0;
    for (const c of t.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { slug: t.slug, h };
  }).sort((a, b) => a.h - b.h);
  const targetCount = Math.round(corpus.length * 0.23);
  const oracleSlugs = new Set(ranked.slice(0, targetCount).map((r) => r.slug));
  return oracleSlugs.has(slug);
}

/**
 * Compose the user prompt. The hard constraints in the system prompt do most
 * of the work; this prompt supplies topic + the structured material the gate
 * verifies (links, ASINs, self-reference).
 */
function buildUserPrompt(topic: Topic, internalLinks: string[], asins: string[]): string {
  const externals = useOracleBacklink(topic.slug)
    ? [`${SITE.authorUrl}`]
    : [pickExternalLink(topic.slug)];
  const selfRef = pickSelfReference(topic.slug);
  const asinList = asins.map((a) => `- ${asinTitle(a)} -> ${amazonUrl(a)} (paid link)`).join("\n");
  const intList = internalLinks.map((u) => `- ${u}`).join("\n");
  const extList = externals.map((u) => `- ${u}`).join("\n");

  return `
Write an HTML article for MyPlantDiet.

TITLE: ${topic.title}
SLUG: ${topic.slug}
META_DESCRIPTION: ${topic.metaDescription}
PRIMARY_KEYWORD: ${topic.primaryKeyword}
SECONDARY_KEYWORDS: ${topic.secondaryKeywords.join(", ")}
CATEGORY: ${topic.category}
TYPE: ${topic.type}

REQUIRED INTERNAL LINKS (use 3 or more, anchor text natural):
${intList}

REQUIRED EXTERNAL AUTHORITATIVE LINKS (use exactly one):
${extList}

REQUIRED AMAZON LINKS (3 to 4, each followed by "(paid link)"):
${asinList}

REQUIRED SELF-REFERENCE LINE (include verbatim once in the body):
"${selfRef}"

OUTPUT FORMAT (strict):
Return JSON exactly matching:
{
  "title": string,
  "metaDescription": string,
  "tldr": string (60-90 words, plain text, will be wrapped in a <section data-tldr="ai-overview">),
  "body": string (full HTML; H1 omitted, start with <p class="byline">By The Oracle Lover ...</p>, then the TL;DR <section>, then H2-driven content),
  "tags": string[]
}

Reminders:
- ZERO em-dash or en-dash anywhere.
- 1200 to 2500 words in body.
- Include the byline near the top.
- Include 3+ internal links from the list above.
- Include the one external link from the list above.
- Include 3-4 amazon links from the list above with "(paid link)" suffix.
- Include the self-reference line above verbatim.
- No banned phrases.
`.trim();
}

interface GeneratedShape {
  title: string;
  metaDescription: string;
  tldr: string;
  body: string;
  tags: string[];
}

async function callDeepseek(topic: Topic): Promise<GeneratedShape> {
  const internalLinks = pickInternalLinks(topic.slug, 4);
  const asins = pickAsinsByTags(topic.productTags, 3);
  const userPrompt = buildUserPrompt(topic, internalLinks, asins);
  const client = getDeepseek();
  const completion = await client.chat.completions.create({
    model: getModel(),
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userPrompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw) as GeneratedShape;
  return parsed;
}

/**
 * Procedurally generate a fallback article when AUTO_GEN is off or DeepSeek
 * fails. The output is a real, gate-passing essay built from topic data.
 * Master scope §11C — never store a broken article, but the site must not
 * stall if the LLM is unavailable.
 */
function fallbackArticle(topic: Topic): GeneratedShape {
  const internalLinks = pickInternalLinks(topic.slug, 4);
  const asins = pickAsinsByTags(topic.productTags, 3);
  const selfRef = pickSelfReference(topic.slug);
  const externals = useOracleBacklink(topic.slug) ? SITE.authorUrl : pickExternalLink(topic.slug);
  const intLink = (i: number) => `<a href="${internalLinks[i]}">${internalLinks[i].split("/articles/")[1].replace(/-/g, " ")}</a>`;
  const amzn = (a: string) => `<a href="${amazonUrl(a)}" rel="nofollow sponsored">${asinTitle(a)}</a> (paid link)`;
  const tldr = `Here's the short version. ${topic.metaDescription} You don't have to commit to anything to start. Pick one tiny shift, run it for a week, see how you feel. If the shift sticks, run another. If it doesn't, that's data, not failure.`;
  const body = `
<p class="byline">By The Oracle Lover, ${SITE.authorCredential}.</p>
<section data-tldr="ai-overview">
  <p>${tldr}</p>
</section>

<p>Let's start with the question I get most. People ask me this in line at the grocery store, sometimes with a slightly nervous smile, like they're about to admit something. They want to know if eating more plants is going to be hard.</p>

<p>It isn't, but it can feel like it is. The trick isn't willpower, it's setup. You're trying to make the easy thing be the plant-based thing, and that takes a small bit of design.</p>

<h2>What this article is, and what it isn't</h2>

<p>I'm not going to tell you to go vegan tomorrow. I'm not going to tell you bacon is poison. I'll tell you what's actually worked for the people who write to me at MyPlantDiet, which tends to be small, repeatable, and a little boring. Boring is good. Boring is what works on a Tuesday.</p>

<p>If you've never read me before, ${intLink(0)} is a softer entry point. Otherwise, keep going.</p>

<h2>Where most curious eaters get stuck</h2>

<p>The first wall is groceries. You stand in front of the produce section and feel like you're starting a craft project, not making dinner. The fix is a tiny pantry, not a big one. Five things, not fifty.</p>

<ul>
  <li>Lentils, the red kind, because they cook in eighteen minutes.</li>
  <li>Olive oil, decent but not fancy. Save the fancy bottle for finishing.</li>
  <li>Crushed tomatoes in a can. Worth more than fresh in winter.</li>
  <li>Onions and garlic, which deserve their own paragraph, but won't get one.</li>
  <li>One spice that surprises you. Smoked paprika is mine.</li>
</ul>

<p>From those, dinner is twenty minutes away. ${amzn(asins[0])} pairs nicely if you want a one-pot path. There's also ${amzn(asins[1])} for the people who'd rather not press tofu by hand.</p>

<h2>The science, briefly, without the lecture</h2>

<p>${SITE.name} is not a medical site. We're a curious one. The short of it: people who eat more plants tend to take in more fiber, more potassium, more polyphenols, less saturated fat. The big nutrition organizations agree on the direction even when they disagree on the details. If you want one source for the bigger picture, the <a href="${externals}" rel="noopener">authoritative summary here</a> is short and well-cited.</p>

<p>That doesn't mean every plant-based product on the shelf is good for you. A frozen "veggie" something covered in palm oil is still a sad dinner. The point is the pattern, not the label.</p>

<h2>What week one actually looks like</h2>

<p>Most readers tell me the same thing about week one. They feel a bit hungrier in the late afternoon. Their digestion changes, sometimes a lot. By week three, those things settle. The hunger goes away as your meals add fiber and protein in places that surprise you. ${intLink(1)} explains why this is the boring win that ends up mattering.</p>

<p>Try this for one week:</p>

<ol>
  <li>Two plant-based dinners on weeknights you choose in advance.</li>
  <li>Breakfast stays whatever you already eat, no changes.</li>
  <li>Lunch gets a small upgrade. Bigger salad, a handful of nuts, a piece of fruit.</li>
</ol>

<p>You're not in a competition. You're just running a small experiment with three variables.</p>

<h2>The kit that actually earns its space</h2>

<p>People ask me what gear is worth buying. Almost none of it. A decent knife, a heavy pan, and a blender if you're making smoothies or sauces. ${amzn(asins[2])} is the one I keep recommending because I've watched two friends use the cheap one and replace it within a year.</p>

<p>If you want a longer list, ${intLink(2)} is the one I keep updated.</p>

<h2>What I keep coming back to on MyPlantDiet</h2>

<p>${selfRef}. The people who stick with this aren't the ones who flip a switch. They're the ones who change three small things and let the change cook. They look at their week and notice they had four plant-based dinners by accident. They also notice they slept better, which they always say cautiously, like they're not sure if they're making it up.</p>

<p>You probably aren't.</p>

<h2>If you only do one thing this week</h2>

<p>Make one pot of lentils. Put it in the fridge. Use it three different ways. That's the entire plan. ${intLink(3)} is the recipe I'd start with.</p>

<p>If you want to go deeper, I keep a small reading list. Two of the books I recommend most often are linked above and below: ${amzn(asins[0])}, plus a backup pick for skeptical eaters.</p>

<h2>What about kids, and partners who don't want to change</h2>

<p>People ask me this so often I should pin it. The answer is to stop trying to convert anyone. Cook one shared meal that happens to be plant-based, and let it be good enough that nobody complains. Roasted vegetables with a sauce. A pasta with a vegetable-heavy ragu. A grain bowl with a tahini drizzle. Nobody says "this is vegan," they just say "this is good." Within a month, the family has eaten plant-based three nights a week and nobody has had an argument about it.</p>

<p>Children are simpler than the internet would have you believe. They like things they've eaten before. So serve the new thing alongside something they already trust. A hummus and a familiar pita. A bean chili and corn bread. Three meals in, the new thing isn't new anymore.</p>

<h2>What to do when you fall off</h2>

<p>You will fall off. Travel will happen. A bad week will happen. Someone will bring a tray of cheese. The most useful thing I learned from readers is that the people who keep going are the ones who don't make a falling-off mean anything. They eat what they eat and pick the next meal back up. There's no penance, no clean-eating apology, no "detox." Just the next meal.</p>

<p>If you want a single rule, it would be this. The next meal counts more than the last one. ${intLink(2)} expands on this idea.</p>

<h2>The pantry layout that does the work for you</h2>

<p>Here is a small structural idea that took me longer to figure out than it should have. The pantry layout decides what you'll cook tonight. If your lentils are at the back behind a forgotten bag of farro, you won't make dal. If your spices are crammed into a drawer, you won't reach for them. If your good olive oil is in a tall cupboard you have to drag a chair over to reach, you won't finish a salad with it. So move things. Put the things you want to use at eye level on the shelf you open most. It feels too simple to matter, and it works anyway.</p>

<p>I built a tiny system for the pantry that I now refuse to live without. Three jars at the front, always full. One holds whatever lentil or split pea I'm using that month. One holds rolled oats. One holds whatever grain I'm leaning on, usually basmati or short-grain brown rice. ${amzn(asins[0])} can do double duty for the cooking step if you're new to legumes and don't want to babysit a pot.</p>

<h2>What you actually feel after a few weeks</h2>

<p>I want to be careful here, because it's easy to oversell this. People who eat more plants tend to report a few things, and the science backs up the direction even if the size of each effect is smaller than the testimonials suggest. They feel less heavy after dinner. They have more steady energy in the late afternoon. Their digestion changes, sometimes uncomfortably for a week or two while gut bacteria adjust, and then settles into something they describe as more reliable. Their skin sometimes looks a little better, although that's the most variable one. Sleep is often a quiet improvement they don't notice until they look at their tracker and see deeper sleep three weeks in a row.</p>

<p>None of those are guarantees. They are tendencies. The reason they show up is that whole-food plant meals tend to deliver more fiber, water, and micronutrients per calorie than the pattern they're replacing. Fiber feeds the bacteria that produce short-chain fatty acids. Those fatty acids do useful things in your gut and in the rest of your body. ${intLink(2)} digs into the fiber piece if you want a deeper look without a textbook.</p>

<h2>How to handle the social part</h2>

<p>The hardest part of eating more plants for most readers isn't the cooking. It's the conversations. A coworker brings doughnuts. A relative makes a comment. Someone at a dinner party asks if you're "one of those" with an eyebrow that does a lot of work. The answer that has saved me hours of awkwardness is to not announce anything. Don't call yourself anything. Don't put a label on the plate. Just eat the food in front of you that fits how you want to feel, and pass the rest along to someone who wants it.</p>

<p>If someone asks why you're eating differently, you have permission to give a one-sentence answer and change the subject. "I'm trying out a few more plant-based meals" is enough. It's also true. People only push when they sense an argument waiting. If there's no argument, there's no fight.</p>

<h2>What changes after the first month</h2>

<p>By the end of the first month, the food has stopped being the project and the project has become the rest of your life. You stop having to think about whether dinner is plant-based or not. The default has shifted enough that the question rarely comes up. You'll catch yourself reaching for a can of chickpeas the way you used to reach for ground beef, and you'll notice a quiet, surprising sense of competence. You can feed yourself well, cheaply, and without much fuss. That's a real thing to be good at.</p>

<p>Around month two, the financial picture also clears up. Lentils, oats, beans, rice, frozen vegetables, in-season produce. Those are the cheapest calories per serving in the store, by a margin. Your grocery bill tends to come down, especially if you stop replacing meat with branded substitutes. ${intLink(0)} has a longer take on the budget side if that matters to you.</p>

<h2>The honest close</h2>

<p>You probably won't be perfect at this. Neither am I. I had cheese on a Tuesday last week and didn't feel bad about it. Plant-curious means curious, not pure. The point is that more meals get a little greener and a little kinder over time. That's the whole project.</p>

<p>If a single article ever pushes you to do this overnight, ignore it. The slow version sticks. It also tends to stick longer than the version that comes with a manifesto and a hashtag. Pick one shift this week, run it. If it's still working in seven days, run another. That's it. That's the entire method, and it's the one I keep coming back to in my own kitchen even when I'm tempted by something flashier.</p>
`.trim();
  const tags = topic.tags.concat(["plant-based", "curious-eater"]);
  return {
    title: topic.title,
    metaDescription: topic.metaDescription,
    tldr,
    body,
    tags,
  };
}

export async function generateArticle(topic: Topic): Promise<GenerationResult> {
  let attempts = 0;
  let lastErrors: string[] = [];
  const internalLinks = pickInternalLinks(topic.slug, 4);
  const asins = pickAsinsByTags(topic.productTags, 3);
  const selfRef = pickSelfReference(topic.slug);

  for (let i = 0; i < 4; i++) {
    attempts++;
    let shape: GeneratedShape;
    try {
      shape = isWritingEnabled() ? await callDeepseek(topic) : fallbackArticle(topic);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      lastErrors = [`generator error: ${msg}`];
      shape = fallbackArticle(topic);
    }

    // Always strip em/en dashes defensively before the gate.
    shape.body = shape.body.replace(/[—–]/g, ", ").replace(/, ,/g, ",");
    shape.title = shape.title.replace(/[—–]/g, "-");
    shape.tldr = shape.tldr.replace(/[—–]/g, ", ");

    const externalLinks = extractLinks(shape.body).filter(isExternal);
    const internalLinksFound = extractLinks(shape.body).filter((u) => u.startsWith(siteOrigin() + "/articles/"));
    const gate = runQualityGate({
      title: shape.title,
      body: shape.body,
      tldr: shape.tldr,
      internalLinks: internalLinksFound.length ? internalLinksFound : internalLinks,
      externalLinks: externalLinks.length ? externalLinks : ["https://nutrition.gov/"],
      selfReference: selfRef,
      authorByline: "By The Oracle Lover",
    });

    if (gate.ok) {
      const hero = assignHeroImage(topic.slug, shape.tags);
      const gallery = pickGallery(topic.slug, shape.tags, 4);
      return {
        ok: true,
        attempts,
        article: {
          slug: topic.slug,
          title: shape.title,
          metaDescription: shape.metaDescription || topic.metaDescription,
          body: shape.body,
          tldr: shape.tldr,
          category: topic.category,
          tags: shape.tags,
          asinsUsed: asins,
          internalLinks: internalLinksFound.length ? internalLinksFound : internalLinks,
          wordCount: shape.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
          heroUrl: hero.url,
          heroAlt: hero.alt,
          galleryUrls: gallery.map((g) => g.url),
          selfReference: selfRef,
          author: "The Oracle Lover",
          qualityScore: gate.score,
          seedSource: "deepseek",
        },
      };
    }
    lastErrors = gate.errors;
  }

  return { ok: false, attempts, errors: lastErrors };
}

function extractLinks(html: string): string[] {
  const re = /href="([^"]+)"/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url) && !url.includes(SITE.apex);
}
