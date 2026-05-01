import { describe, expect, it } from "vitest";
import {
  buildRobotsTxt,
  buildSitemapXml,
  buildLlmsTxt,
  buildLlmsFullTxt,
} from "./lib/aeo";

const sampleArticles = [
  {
    slug: "tofu-isnt-bland-youre-cooking-it-wrong",
    title: "Tofu isn't bland, you're cooking it wrong",
    metaDescription: "Five fixable mistakes that make tofu sad, plus a default method that always works.",
    category: "recipes",
    publishedAt: new Date("2026-04-20T00:00:00Z"),
    lastModifiedAt: new Date("2026-04-20T00:00:00Z"),
    body: "<p>Body content here.</p>",
    tldr: "TL;DR copy.",
  },
  {
    slug: "iron-rich-foods-that-arent-spinach",
    title: "Iron-rich foods that aren't spinach",
    metaDescription: "Spinach gets the credit, but lentils and tofu out-iron it.",
    category: "nutrition",
    publishedAt: new Date("2026-04-28T00:00:00Z"),
    lastModifiedAt: new Date("2026-04-28T00:00:00Z"),
    body: "<p>Body 2.</p>",
    tldr: "TL;DR 2.",
  },
];

describe("AEO library", () => {
  it("robots.txt opts in every named AI bot and points at sitemap", () => {
    const txt = buildRobotsTxt();
    for (const bot of [
      "GPTBot",
      "ChatGPT-User",
      "OAI-SearchBot",
      "ClaudeBot",
      "Claude-Web",
      "anthropic-ai",
      "PerplexityBot",
      "Google-Extended",
      "Applebot-Extended",
      "CCBot",
      "DuckAssistBot",
    ]) {
      expect(txt).toContain(`User-agent: ${bot}`);
    }
    expect(txt).toMatch(/Allow: \//);
    expect(txt).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });

  it("sitemap.xml lists every article with lastmod and absolute apex URL", () => {
    const xml = buildSitemapXml(sampleArticles as never);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("https://myplantdiet.com/articles/tofu-isnt-bland-youre-cooking-it-wrong");
    expect(xml).toContain("<lastmod>2026-04-20</lastmod>");
    expect(xml).not.toContain("manus.computer");
  });

  it("llms.txt groups by category and includes summary line", () => {
    const txt = buildLlmsTxt(sampleArticles as never);
    expect(txt).toContain("# MyPlantDiet");
    expect(txt).toContain("## recipes");
    expect(txt).toContain("## nutrition");
    expect(txt).toContain("Tofu isn't bland");
    expect(txt).toContain("Iron-rich foods");
  });

  it("llms-full.txt includes article body for each article", () => {
    const txt = buildLlmsFullTxt(sampleArticles as never);
    expect(txt).toContain("Tofu isn't bland");
    expect(txt).toContain("Body content here.");
    expect(txt).toContain("Iron-rich");
  });
});
