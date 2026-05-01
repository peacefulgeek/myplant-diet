/**
 * Site identity. The apex is the canonical hostname (no www).
 * Bunny CDN credentials are baked in here so the site is fully self-contained
 * with the single OPENAI_API_KEY env var; nothing else is required at runtime.
 */
export const SITE = {
  name: "MyPlantDiet",
  tagline: "Curious about plants? Start here.",
  apex: process.env.SITE_APEX || "myplantdiet.com",
  author: "The Oracle Lover",
  authorUrl: "https://theoraclelover.com",
  authorCredential:
    "plant-based curiosity, 10+ years of writing about gentle dietary change",
  niche:
    "transitioning to plant-based eating, vegan-curious, flexitarian, conscious eating",
  amazonTag: process.env.AMAZON_TAG || "spankyspinola-20",
  bunny: {
    storageZone: process.env.BUNNY_STORAGE_ZONE || "myplant-diet",
    apiKey:
      process.env.BUNNY_API_KEY ||
      "dc6bdfdd-6454-403e-942b924b59ec-4a7e-49db",
    pullZone:
      process.env.BUNNY_PULL_ZONE || "https://myplant-diet.b-cdn.net",
    hostname:
      process.env.BUNNY_HOSTNAME || "ny.storage.bunnycdn.com",
  },
} as const;

export function siteOrigin(): string {
  return `https://${SITE.apex}`;
}
