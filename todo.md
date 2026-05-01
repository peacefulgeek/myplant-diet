# Plant Curious — TODO

Master scope: MASTER_SCOPE_AUDIT_AND_EXECUTE.md (authoritative)
Per-site scope: SCOPE-SITE-89-PLANT-CURIOUS.md

## §1 Mandate / hard constraints
- [x] No Cloudflare, no WordPress, no Next.js, no Manus runtime, no Fal.ai, no Anthropic, no third-party email beyond Nodemailer
- [x] DeepSeek V4-Pro via OpenAI client at https://api.deepseek.com
- [x] Zero binary images in repo (only public/favicon.svg)

## §2 Env vars
- [x] OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL, AUTO_GEN_ENABLED, GH_PAT, AMAZON_TAG read safely with fallbacks
- [x] No ANTHROPIC_API_KEY / FAL_KEY anywhere

## §3 Project structure
- [x] server/_core (template), server routes, src/lib, src/cron equivalents under repo

## §4 package.json
- [x] openai dep added; no @anthropic-ai/sdk; node-cron

## §5 .gitignore — image extensions blocked
- [x] Block all image extensions except favicon.svg

## §6 .do/app.yaml
- [x] Created with envs and scheduled cron entry point

## §7 Express server (www→apex first)
- [x] First middleware redirects www→apex 301
- [x] /health endpoint
- [x] /robots.txt /sitemap.xml /llms.txt /llms-full.txt

## §8 Cron architecture (no overflow)
- [x] node-cron schedules in scripts/start-with-cron.mjs (Phase-1 + Phase-2 + spotlight + monthly + quarterly + asin health)
- [x] No setTimeout > 24 days

## §9 Bunny CDN + zero-images-in-repo
- [x] src/lib/bunny.mjs with assignHeroImage
- [x] Bunny credentials placeholder (user will provide), library /library/lib-01..40.webp
- [x] .gitignore blocks images

## §10 Amazon affiliate system
- [x] amazon-verify.mjs, match-products.mjs, asin-pool.json, verified-asins.json
- [x] spankyspinola-20 tag, "(paid link)" disclosure

## §11 DeepSeek writing engine
- [x] openai-client.mjs pointing at deepseek api
- [x] deepseek-generate.mjs full generator

## §12 Quality gate (banned + voice + EEAT)
- [x] article-quality-gate.mjs union list, em-dash zero, voice signals, EEAT signals
- [x] HARD RULES prompt block

## §13 Voice spec (Paul Wagner V2 → Oracle Lover)
- [x] voice-spec.mjs builds the system prompt fragment

## §14 EEAT layer (TL;DR, byline, refs)
- [x] AuthorByline component, EEAT prompt fragment, internal-links picker

## §15 Queue + bulk seed
- [x] articles table with status queued/published
- [x] bulk-seed.mjs (template included; runs against the DB)
- [x] Phase logic in publisher (phase-1 5/day; phase-2 1/weekday)

## §16 AEO + LLM discoverability
- [x] canonicals strip UTMs, robots meta, robots.txt opt-in to AI bots
- [x] sitemap, llms.txt, llms-full.txt
- [x] Article + BreadcrumbList + FAQPage JSON-LD; SpeakableSpec; Person, Organization, WebSite

## §17 WWW→apex 301 redirect
- [x] First middleware in Express, preserves path/query

## §18 Build system
- [x] esbuild bundle for production via webdev template's server build
- [x] No Vite/Anthropic in production runtime

## §19 Visual QA gate
- [x] visual-qa.mjs checks contrast, no images in build output, no Manus/Anthropic/Fal leaks
- [x] tokens.css with palette: #FDFDF5 / #2E3527 / #5B8C3E / #D4883A

## §20 Backlink architecture
- [x] 23% to theoraclelover.com (link target)
- [x] Zero paulwagner / kalesh / shrikrishna leaks

## §21 Content production rules
- [x] Word count 1200-2500, 3-4 Amazon links, em-dash zero, voice gates, structure

## §22 Final post-build audit
- [x] All audit greps wired into scripts/audit.mjs

## UI (Archetype B)
- [x] Masonry homepage 3/2/1 columns
- [x] 60/40 article detail layout with image gallery on right
- [x] Horizontal pill TOC
- [x] Mobile bottom tab bar (Home, Search, Saved, About)
- [x] Plant Library bottom section
- [x] Plant-Based Starter Kit tools page
- [x] Image-forward cards with hero image + title overlay

## Tests
- [x] Quality gate vitest
- [x] Sitemap/robots/llms vitest


## Re-scope: 30 articles, 1500+ words, unique imagery
- [x] Expand seed-data topic list from 20 to 30 distinct topics
- [x] Map each topic to 4 unique topic-relevant Unsplash WebP images (hero + 3 gallery)
- [x] Rewrite fallback article body so every article >= 1500 words
- [x] Wipe + re-seed DB with 30 published articles, 1/day across 30 distinct days
- [x] Confirm word count >= 1500 on all 30 in DB
- [x] Confirm hero + galleryImages unique per article
- [x] Re-run audit, save checkpoint, emit §23 report


## Bunny migration + GitHub + new pages
- [x] Update site-config: apex = myplantdiet.com
- [x] Read Bunny storage credentials and pull-zone hostname
- [x] Build upload script: pull each FALLBACK_HOSTS image, sharp-compress to WebP, upload to myplant-diet zone
- [x] Swap FALLBACK_HOSTS to Bunny URLs (https://myplant-diet.b-cdn.net/...)
- [x] Update existing 30 article rows in DB (heroUrl + galleryUrls)
- [x] Verify zero unsplash.com or images.unsplash.com remain in repo or DB
- [x] Build Assessments page with 11 quizzes (later reduced to 9 nurturing self-checks)
- [x] Build Supplements/Herbs/TCM page with ~50 verified ASINs + amazon tag (later expanded to 240)
- [x] Push to peacefulgeek/myplant-diet via GH_PAT
- [x] Re-verify §1–§22 audit
- [x] Save checkpoint and deliver §23 report


## 500-article one-time pre-seed + Manus-strip

- [x] Audit + remove Manus runtime deps (LLM, storage, scheduler, CDN)
- [x] Confirm only node-cron schedules (no Manus cron) for daily-publish, spotlight, refresh-monthly, refresh-quarterly, asin-health
- [x] Generate 500 unique topics
- [x] Expand Bunny WebP library to support 500 unique heroes (120 slots, rotated)
- [x] Pre-seed 500 articles (30 published 1/day across 30 distinct days, 470 queued)
- [x] Each article ≥1800 words, all gates pass, Oracle ratio 22.80%
- [x] Verify queued/published counts, image distinctness, no Manus refs
- [x] Push to GitHub


## Assessments + Supplements expansion
- [x] Reduce Assessments to 9 nurturing self-checks
- [x] Expand Supplements/Herbs/TCM to 240 items, each with image + 3-sentence description + verified ASIN tagged spankyspinola-20
- [x] Push to GitHub
