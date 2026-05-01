/**
 * Quality gate for every generated article. Master scope §12 + §13.
 *
 * Returns { ok, score, errors, warnings }. The pipeline regenerates up to 4
 * times if !ok, and never persists a failing article.
 */

// Union list of banned words/phrases (master scope §12A) — never drop an item.
const BANNED_PHRASES: string[] = [
  // section 12A.1 — corporate filler
  "leverage",
  "synergy",
  "robust",
  "best-in-class",
  "best in class",
  "deep dive",
  "circle back",
  "low-hanging fruit",
  "move the needle",
  "boil the ocean",
  "open the kimono",
  "win-win",
  "thought leader",
  "thought leadership",
  "paradigm shift",
  "ecosystem",
  "stakeholder",
  "ideate",
  "actionable",
  "scalable",
  "next-level",
  "game-changer",
  "game changer",
  "disruptive",
  "10x",
  // §12A.2 — AI tells
  "in today's fast-paced world",
  "in today's world",
  "in the realm of",
  "navigate the complex",
  "delve into",
  "delving into",
  "unleash",
  "unlock",
  "embark on a journey",
  "journey of",
  "tapestry",
  "tapestry of",
  "kaleidoscope",
  "symphony of",
  "treasure trove",
  "stand the test of time",
  "in conclusion",
  "to sum it up",
  "as we have seen",
  "it's important to note",
  "it is important to note",
  "needless to say",
  "at the end of the day",
  "in essence",
  "in summary",
  // §12A.3 — overconfident hedges + clichés
  "studies have shown",
  "research suggests",
  "scientifically proven",
  "experts agree",
  "many people believe",
  "as you can see",
  "without a doubt",
  "undoubtedly",
  "in any case",
  "needless",
  // §12A.4 — vegan-blog filler
  "plant-powered",
  "plant powered",
  "guilt-free",
  "guilt free",
  "wholesome goodness",
  "good for the planet and good for you",
  "your taste buds will thank you",
  "your body will thank you",
  "tastes amazing",
  "absolutely delicious",
  "super easy",
  "super simple",
  "the holy grail",
  // §12A.5 — leakage / ID strings
  "paulwagner",
  "paul wagner",
  "kalesh",
  "shrikrishna",
  "manus",
  "anthropic",
  "claude",
  "fal.ai",
  "fal_key",
];

const SELF_REFERENCES = [
  "I write MyPlantDiet",
  "Around here at MyPlantDiet",
  "When I started MyPlantDiet",
  "On MyPlantDiet",
  "What I keep coming back to on MyPlantDiet",
  "If you're new to MyPlantDiet",
];

export interface GateInput {
  title: string;
  body: string;
  tldr: string;
  internalLinks: string[]; // urls
  externalLinks: string[]; // urls
  selfReference: string;
  authorByline?: string;
}

export interface GateResult {
  ok: boolean;
  score: number;
  errors: string[];
  warnings: string[];
}

export function runQualityGate(input: GateInput): GateResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  const bodyText = stripTags(input.body).toLowerCase();
  const titleLower = input.title.toLowerCase();

  // 1. Em-dash zero tolerance (any em or en dash anywhere kills the gate).
  if (/[—–]/.test(input.body) || /[—–]/.test(input.title) || /[—–]/.test(input.tldr)) {
    errors.push("em-dash or en-dash detected (zero-tolerance)");
    score -= 30;
  }

  // 2. Banned word/phrase union list — no exceptions.
  for (const phrase of BANNED_PHRASES) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(bodyText) || re.test(titleLower)) {
      errors.push(`banned phrase: "${phrase}"`);
      score -= 5;
    }
  }

  // 3. Voice signals — must feel conversational, not corporate.
  const sentences = bodyText.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 1100) {
    errors.push(`word count too low (${wordCount} < 1100)`);
    score -= 20;
  }
  if (wordCount > 2700) {
    warnings.push(`word count high (${wordCount} > 2700)`);
    score -= 5;
  }

  const contractions = /\b(don't|can't|won't|isn't|aren't|i'm|you're|we're|it's|that's|here's|there's|let's|i've|you've|we've)\b/gi;
  const contractionMatches = bodyText.match(contractions) || [];
  if (contractionMatches.length < 6) {
    errors.push(`too few contractions (${contractionMatches.length} < 6) — sounds robotic`);
    score -= 15;
  }

  const direct = /\byou(?:r|'re|'ve|'ll)?\b/gi;
  const directMatches = bodyText.match(direct) || [];
  if (directMatches.length < 8) {
    errors.push(`not enough direct address (${directMatches.length} < 8 'you')`);
    score -= 10;
  }

  // Sentence variance — shortest 5 vs longest 5 should differ enough.
  const lengths = sentences.map((s) => s.split(/\s+/).length).sort((a, b) => a - b);
  if (lengths.length >= 10) {
    const shortMean = avg(lengths.slice(0, 5));
    const longMean = avg(lengths.slice(-5));
    if (longMean - shortMean < 8) {
      warnings.push("low sentence-length variance");
      score -= 5;
    }
  }

  // 4. EEAT signals — TL;DR + byline + 3+ internal + 1+ external + self-ref.
  if (!input.tldr || stripTags(input.tldr).length < 80) {
    errors.push("missing or too-short TL;DR");
    score -= 10;
  }
  if (!input.authorByline || !/oracle lover/i.test(input.authorByline)) {
    errors.push("missing author byline (The Oracle Lover)");
    score -= 10;
  }
  if (input.internalLinks.length < 3) {
    errors.push(`internal links < 3 (have ${input.internalLinks.length})`);
    score -= 10;
  }
  if (input.externalLinks.length < 1) {
    errors.push("no external authoritative link");
    score -= 10;
  }
  if (!input.selfReference || !/myplantdiet/i.test(input.selfReference)) {
    errors.push("missing self-reference line");
    score -= 5;
  }

  // 5. Forbidden link targets in body (should never publish a Cloudflare/WP/Manus URL).
  if (/(cloudflare\.com|wordpress\.com|wp-content|manus\.computer)/i.test(input.body)) {
    errors.push("forbidden infra URL leaked into body");
    score -= 20;
  }

  return { ok: errors.length === 0 && score >= 70, score: Math.max(score, 0), errors, warnings };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);
}

/**
 * Pick a self-reference deterministically per article. Master scope §20.
 */
export function pickSelfReference(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return SELF_REFERENCES[h % SELF_REFERENCES.length];
}

export const BANNED_LIST = BANNED_PHRASES;
