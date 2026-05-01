/**
 * Site identity. The apex is the canonical hostname (no www).
 * Update SITE_APEX once a real domain is bound — until then the
 * dev/preview URL is used as a graceful fallback.
 */
export const SITE = {
  name: "Plant Curious",
  tagline: "Curious about plants? Start here.",
  apex: process.env.SITE_APEX || "plantcurious.com",
  author: "The Oracle Lover",
  authorUrl: "https://theoraclelover.com",
  authorCredential:
    "plant-based curiosity, 10+ years of writing about gentle dietary change",
  niche:
    "transitioning to plant-based eating, vegan-curious, flexitarian, conscious eating",
  amazonTag: process.env.AMAZON_TAG || "spankyspinola-20",
  // Bunny CDN config — placeholder until creds are provided.
  bunny: {
    storageZone: process.env.BUNNY_STORAGE_ZONE || "plant-curious",
    apiKey: process.env.BUNNY_API_KEY || "",
    pullZone: process.env.BUNNY_PULL_ZONE || "https://plant-curious.b-cdn.net",
    hostname: process.env.BUNNY_HOSTNAME || "ny.storage.bunnycdn.com",
  },
} as const;

export function siteOrigin(): string {
  return `https://${SITE.apex}`;
}
