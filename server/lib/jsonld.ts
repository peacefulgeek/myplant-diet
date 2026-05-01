import { SITE, siteOrigin } from "./site-config";
import type { Article } from "../../drizzle/schema";

export function buildArticleJsonLd(a: Article): Record<string, unknown> {
  const url = `${siteOrigin()}/articles/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: (a.lastModifiedAt || a.publishedAt)?.toISOString(),
    inLanguage: "en",
    isAccessibleForFree: true,
    wordCount: a.wordCount,
    articleSection: a.category,
    image: a.heroUrl
      ? {
          "@type": "ImageObject",
          url: a.heroUrl,
          contentUrl: a.heroUrl,
          creditText: SITE.name,
          creator: { "@type": "Person", name: a.author },
          license: `${siteOrigin()}/disclosures`,
        }
      : undefined,
    author: {
      "@type": "Person",
      name: a.author,
      url: SITE.authorUrl,
      jobTitle: "Editor",
      knowsAbout: ["plant-based eating", "vegan transition", "flexitarian"],
      sameAs: [SITE.authorUrl],
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: siteOrigin(),
      logo: { "@type": "ImageObject", url: `${siteOrigin()}/favicon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ['[data-tldr="ai-overview"]'],
    },
  };
}

export function buildBreadcrumbJsonLd(a: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin()}/` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteOrigin()}/articles` },
      {
        "@type": "ListItem",
        position: 3,
        name: a.category,
        item: `${siteOrigin()}/articles?category=${encodeURIComponent(a.category)}`,
      },
      { "@type": "ListItem", position: 4, name: a.title, item: `${siteOrigin()}/articles/${a.slug}` },
    ],
  };
}

export function buildFaqJsonLd(faqs: { q: string; a: string }[]): Record<string, unknown> | null {
  if (!faqs || faqs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 6).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: siteOrigin(),
    logo: `${siteOrigin()}/favicon.svg`,
    knowsAbout: [
      "plant-based eating",
      "vegan curious",
      "flexitarian",
      "conscious eating",
      "plant nutrition",
    ],
    sameAs: [SITE.authorUrl],
  };
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteOrigin(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteOrigin()}/articles?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function extractFaqs(html: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const re = /<h(2|3|4)[^>]*>([^<]*\?)\s*<\/h\1>\s*([\s\S]*?)(?=<h(?:1|2|3|4)|<aside|<\/article|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const q = match[2].trim();
    const aRaw = match[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (q && aRaw) out.push({ q, a: aRaw.slice(0, 600) });
  }
  return out;
}
