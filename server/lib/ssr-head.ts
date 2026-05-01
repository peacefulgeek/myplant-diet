import type { Request, Response, Express } from "express";
import { buildCanonical, escapeHtml } from "./aeo";
import { SITE, siteOrigin } from "./site-config";
import { getPublishedBySlug, listPublished } from "./article-db";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  extractFaqs,
} from "./jsonld";
import type { Article } from "../../drizzle/schema";

interface HeadCtx {
  title: string;
  description: string;
  ogImage: string;
  jsonLd: Record<string, unknown>[];
  tldrHtml: string;
  ogType: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

function injectHead(htmlShell: string, req: Request, ctx: HeadCtx): string {
  const canonical = buildCanonical(req);
  const jsonLdScripts = ctx.jsonLd
    .map(
      (o) =>
        `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`
    )
    .join("");
  const ogTags: string[] = [
    `<meta property="og:type" content="${ctx.ogType}">`,
    `<meta property="og:title" content="${escapeHtml(ctx.title)}">`,
    `<meta property="og:description" content="${escapeHtml(ctx.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}">`,
  ];
  if (ctx.ogImage) ogTags.push(`<meta property="og:image" content="${ctx.ogImage}">`);
  if (ctx.publishedTime)
    ogTags.push(`<meta property="article:published_time" content="${ctx.publishedTime}">`);
  if (ctx.modifiedTime)
    ogTags.push(`<meta property="article:modified_time" content="${ctx.modifiedTime}">`);
  if (ctx.author)
    ogTags.push(`<meta property="article:author" content="${escapeHtml(ctx.author)}">`);

  const twitter = [
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(ctx.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(ctx.description)}">`,
  ];
  if (ctx.ogImage) twitter.push(`<meta name="twitter:image" content="${ctx.ogImage}">`);

  const headInject = [
    `<title>${escapeHtml(ctx.title)}</title>`,
    `<meta name="description" content="${escapeHtml(ctx.description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
    `<meta name="theme-color" content="#5B8C3E">`,
    ...ogTags,
    ...twitter,
    jsonLdScripts,
  ].join("\n    ");

  let out = htmlShell
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "");

  out = out.replace("</head>", `    ${headInject}\n  </head>`);

  // Pre-shell TL;DR + structured fallback for crawlers that don't run JS.
  if (ctx.tldrHtml) {
    out = out.replace(
      '<div id="root"></div>',
      `<div id="root"></div>\n    <noscript>${ctx.tldrHtml}</noscript>\n    <template id="pc-tldr">${ctx.tldrHtml}</template>`
    );
  }
  return out;
}

/**
 * Build SSR head for any page. Article pages get full Article+Breadcrumb+FAQ schema.
 * Lists / static pages get Organization + Website + light meta.
 */
export async function buildHead(req: Request): Promise<HeadCtx> {
  const raw = req.originalUrl || req.url || req.path || "/";
  const url = raw.split("?")[0];
  if (url.startsWith("/articles/")) {
    const slug = url.replace("/articles/", "").split("?")[0].split("/")[0];
    const article = await getPublishedBySlug(slug);
    if (article) return articleHead(article);
  }
  if (url === "/" || url === "/articles") {
    const list = await listPublished(8);
    return listHead(list);
  }
  return staticHead(url);
}

function articleHead(a: Article): HeadCtx {
  const tldr = a.tldr || extractFirstSection(a.body);
  const faqs = extractFaqs(a.body);
  const jsonLd: Record<string, unknown>[] = [
    buildArticleJsonLd(a),
    buildBreadcrumbJsonLd(a),
    buildOrganizationJsonLd(),
  ];
  const faqLd = buildFaqJsonLd(faqs);
  if (faqLd) jsonLd.push(faqLd);
  return {
    title: `${a.title} — ${SITE.name}`,
    description: a.metaDescription || tldr.slice(0, 160),
    ogImage: a.heroUrl,
    ogType: "article",
    publishedTime: a.publishedAt?.toISOString(),
    modifiedTime: (a.lastModifiedAt || a.publishedAt)?.toISOString(),
    author: a.author,
    jsonLd,
    tldrHtml: tldr
      ? `<section data-tldr="ai-overview" aria-label="In short"><p>${escapeHtml(tldr)}</p></section>`
      : "",
  };
}

function listHead(_list: Article[]): HeadCtx {
  return {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "A gentle, image-rich plant-based publication. Practical guides, recipes, and the science behind eating more plants. Not preachy. Not perfect. Just curious.",
    ogImage: `${siteOrigin()}/favicon.svg`,
    ogType: "website",
    jsonLd: [buildWebsiteJsonLd(), buildOrganizationJsonLd()],
    tldrHtml: "",
  };
}

function staticHead(url: string): HeadCtx {
  const map: Record<string, { title: string; description: string }> = {
    "/about": {
      title: `About — ${SITE.name}`,
      description:
        "MyPlantDiet is a plant-based publication for the curious. Written by The Oracle Lover. Honest, gentle, useful.",
    },
    "/disclosures": {
      title: `Disclosures — ${SITE.name}`,
      description:
        "Affiliate disclosure, medical disclaimer, and editorial policies for MyPlantDiet.",
    },
    "/privacy": {
      title: `Privacy — ${SITE.name}`,
      description: "MyPlantDiet privacy policy.",
    },
    "/contact": {
      title: `Contact — ${SITE.name}`,
      description: `Reach the MyPlantDiet editor.`,
    },
    "/starter-kit": {
      title: `Plant-Based Starter Kit — ${SITE.name}`,
      description:
        "The exact tools, books, and supplements that make eating more plants easier.",
    },
    "/library": {
      title: `Plant Library — ${SITE.name}`,
      description: "An A-to-Z library of plants, foods, and dishes worth knowing.",
    },
  };
  const m = map[url] || {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "A plant-based publication for the curious.",
  };
  return {
    title: m.title,
    description: m.description,
    ogImage: `${siteOrigin()}/favicon.svg`,
    ogType: "website",
    jsonLd: [buildOrganizationJsonLd(), buildWebsiteJsonLd()],
    tldrHtml: "",
  };
}

function extractFirstSection(html: string): string {
  const m = html.match(/<section[^>]*data-tldr[^>]*>([\s\S]*?)<\/section>/i);
  if (m) return m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return "";
}

/**
 * Wrap the index.html response so head injection happens on every HTML route.
 * Works for both vite dev (transformed shell) and prod (served file).
 */
export function withHeadInjection(app: Express): void {
  app.use(async (req, res, next) => {
    const accept = (req.headers.accept || "").toLowerCase();
    if (req.method !== "GET" || !accept.includes("text/html")) {
      next();
      return;
    }
    const path = (req.originalUrl || req.url || req.path || "/").split("?")[0];
    if (path.startsWith("/api") || path.startsWith("/manus-storage") || path.includes(".")) {
      next();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origSend: any = res.send.bind(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origEnd: any = res.end.bind(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origWrite: any = res.write.bind(res);
    const chunks: Buffer[] = [];
    let captured = true;
    (res as Response).send = ((body: unknown) => {
      if (typeof body === "string" && body.includes("<div id=\"root\">")) {
        Promise.resolve(buildHead(req))
          .then((ctx) => origSend(injectHead(body, req, ctx)))
          .catch(() => origSend(body));
        return res;
      }
      captured = false;
      return origSend(body as never);
    }) as Response["send"];
    (res as Response).write = ((chunk: unknown, ...rest: unknown[]) => {
      if (captured && chunk) {
        try {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
          return true;
        } catch {
          captured = false;
        }
      }
      return origWrite(chunk, ...rest);
    }) as Response["write"];
    (res as Response).end = ((chunk?: unknown, ...rest: unknown[]) => {

      if (captured) {
        if (chunk) {
          try {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
          } catch {}
        }
        const body = Buffer.concat(chunks).toString("utf8");
        if (body.includes('<div id="root">')) {
          Promise.resolve(buildHead(req))
            .then((ctx) => {
              const out = injectHead(body, req, ctx);
              res.setHeader("content-type", "text/html; charset=utf-8");
              res.setHeader("content-length", Buffer.byteLength(out));
              return origEnd(out);
            })
            .catch(() => origEnd(body));
          return res as never;
        }
        return origEnd(body);
      }
      return origEnd(chunk, ...rest);
    }) as Response["end"];
    next();
  });
}
