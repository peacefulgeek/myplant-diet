import type { Request } from "express";
import { SITE, siteOrigin } from "./site-config";
import type { Article } from "../../drizzle/schema";

const STRIP_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "mc_eid",
  "mc_cid",
  "ref",
  "ref_",
  "source",
  "via",
]);

export function buildCanonical(req: Request): string {
  const url = new URL(req.originalUrl || "/", siteOrigin());
  for (const p of Array.from(url.searchParams.keys())) {
    if (STRIP_PARAMS.has(p.toLowerCase())) url.searchParams.delete(p);
  }
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return `${siteOrigin()}${pathname}${url.search}`;
}

/**
 * Robots.txt — opt-in to every named retrieval bot.
 * Master scope §16C.
 */
export function buildRobotsTxt(): string {
  const lines = [
    "# MyPlantDiet — robots.txt",
    "User-agent: *",
    "Allow: /",
    "",
    "# Explicitly allow named AI / retrieval bots",
  ];
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Bingbot",
    "CCBot",
    "Applebot",
    "Applebot-Extended",
    "DuckAssistBot",
    "Meta-ExternalAgent",
    "YouBot",
    "MistralAI-User",
    "Cohere-AI",
  ];
  for (const bot of aiBots) {
    lines.push(`User-agent: ${bot}`);
    lines.push("Allow: /");
  }
  lines.push("");
  lines.push(`Sitemap: ${siteOrigin()}/sitemap.xml`);
  lines.push("");
  lines.push("# AEO discoverability");
  lines.push(`# ${siteOrigin()}/llms.txt`);
  lines.push(`# ${siteOrigin()}/llms-full.txt`);
  return lines.join("\n");
}

export function buildSitemapXml(articles: Pick<Article, "slug" | "lastModifiedAt" | "publishedAt">[]): string {
  const origin = siteOrigin();
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { loc: `${origin}/`, lastmod: today, priority: "1.0" },
    { loc: `${origin}/articles`, lastmod: today, priority: "0.9" },
    { loc: `${origin}/about`, lastmod: today, priority: "0.6" },
    { loc: `${origin}/disclosures`, lastmod: today, priority: "0.4" },
    { loc: `${origin}/privacy`, lastmod: today, priority: "0.4" },
    { loc: `${origin}/contact`, lastmod: today, priority: "0.4" },
    { loc: `${origin}/starter-kit`, lastmod: today, priority: "0.7" },
    { loc: `${origin}/library`, lastmod: today, priority: "0.7" },
    { loc: `${origin}/assessments`, lastmod: today, priority: "0.8" },
    { loc: `${origin}/supplements`, lastmod: today, priority: "0.8" },
  ];
  const xml: string[] = [];
  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const u of staticUrls) {
    xml.push(`  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`);
  }
  for (const a of articles) {
    const lastmod = (a.lastModifiedAt || a.publishedAt || new Date()).toISOString().slice(0, 10);
    xml.push(`  <url><loc>${origin}/articles/${a.slug}</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>`);
  }
  xml.push("</urlset>");
  return xml.join("\n");
}

export function buildLlmsTxt(articles: Pick<Article, "slug" | "title" | "metaDescription" | "category">[]): string {
  const origin = siteOrigin();
  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline}`);
  lines.push("");
  lines.push(
    `${SITE.name} is a plant-based, vegan-curious publication for people thinking about eating more plants without the all-or-nothing pressure. Practical guides, gentle nudges, recipes, and the science behind the shift.`
  );
  lines.push("");
  const grouped = new Map<string, typeof articles>();
  for (const a of articles) {
    const arr = grouped.get(a.category) || [];
    arr.push(a);
    grouped.set(a.category, arr);
  }
  for (const [cat, arts] of Array.from(grouped.entries())) {
    lines.push(`## ${cat}`);
    lines.push("");
    for (const a of arts) {
      lines.push(`- [${a.title}](${origin}/articles/${a.slug}): ${a.metaDescription}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function buildLlmsFullTxt(
  articles: Pick<
    Article,
    | "slug"
    | "title"
    | "metaDescription"
    | "category"
    | "tags"
    | "body"
    | "publishedAt"
    | "lastModifiedAt"
    | "author"
  >[]
): string {
  const origin = siteOrigin();
  const out: string[] = [];
  out.push(`# ${SITE.name} — full corpus`);
  out.push("");
  for (const a of articles) {
    const plain = htmlToPlain(a.body);
    out.push("---");
    out.push(`slug: ${a.slug}`);
    out.push(`title: ${a.title}`);
    out.push(`url: ${origin}/articles/${a.slug}`);
    out.push(`category: ${a.category}`);
    out.push(`tags: ${(a.tags || []).join(", ")}`);
    out.push(`author: ${a.author}`);
    if (a.publishedAt) out.push(`published: ${a.publishedAt.toISOString()}`);
    if (a.lastModifiedAt) out.push(`updated: ${a.lastModifiedAt.toISOString()}`);
    out.push("---");
    out.push("");
    out.push(plain);
    out.push("");
  }
  return out.join("\n");
}

function htmlToPlain(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
