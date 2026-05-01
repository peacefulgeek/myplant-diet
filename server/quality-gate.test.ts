import { describe, expect, it } from "vitest";
import { runQualityGate, pickSelfReference } from "./lib/quality-gate";

const longBody = `
<p>Most articles like this read like a court summons. They aren't, and you don't need one. Here's the version I'd give a friend at brunch over good coffee.</p>

<h2>What plant-based actually means</h2>
<p>It isn't a label, it's a direction of travel. We've all been talked into "perfect" before. Forget that. The real shift starts when you stop trying to win the internet's permission. You start cooking. You eat what tastes like dinner. You repeat.</p>

<p>Here's the part that matters. You don't need to swear off anything. You just need a few defaults that work on a Tuesday. Defaults are a quiet kind of magic. Defaults are also the thing nobody on the internet tells you, because defaults don't sell new products. They sell repeat dinners, which is what you actually want.</p>

<h2>Why fiber is the headline</h2>
<p>You aren't getting close to enough. Most folks aren't, the average is stuck around fifteen grams when the actual target is closer to thirty. The good news is that the fix is boring. Beans, oats, fruit, whole grains, the same five things every week. That's it. Nobody's launching a fiber startup because nobody can monetize "eat the foods you already know."</p>

<p>You won't notice it the first day, you might not notice it the first week, and then one Tuesday you'll realize your afternoon hasn't been a slog for a while. That's the whole sales pitch.</p>

<h2>What I'd buy first</h2>
<p>I'd grab a heavy pan and a solid blender. The pan because it browns better, cleans easier, and lasts forever. The blender because sauces, soups, and smoothies are the three doors most people end up walking through, and a sad blender will quietly talk you out of all of it.</p>

<p>Read <a href="/articles/blenders-that-pay-for-themselves">Blenders that pay for themselves</a> for the picks I trust. Read <a href="/articles/the-pantry-shopping-list-i-actually-use">The pantry shopping list I actually use</a> for the rest.</p>

<h2>The 80/20 thing nobody mentions</h2>
<p>You don't need to be perfect. You need a default. Make one pot of lentils. Put it in the fridge. Use it three different ways across the week. That's the whole plan. <a href="/articles/the-30-day-curious-eater-plan">The 30-day plan</a> walks you through it.</p>

<h2>What about kids and partners</h2>
<p>Stop trying to convert anyone. Cook one shared meal that happens to be plant-based, and let it be good enough that nobody complains. Roasted vegetables with a sauce. A pasta with a vegetable-heavy ragu. A grain bowl with tahini drizzle. Three meals in, the new thing isn't new anymore.</p>

<h2>Where the science actually lives</h2>
<p>You can read <a href="https://www.health.harvard.edu">Harvard Health</a> if you want a clean primer on fiber and protein. You don't need to. The shift works whether you read about it or not. The shift, however, doesn't work if you skip the cooking part.</p>

<h2>The honest close</h2>
<p>You probably won't be perfect at this. Neither am I. I had cheese on a Tuesday last week and didn't feel bad about it. Here's the thing nobody tells you. The next meal counts more than the last one. That's the whole project. Around here at MyPlantDiet, that's the whole project.</p>

<h2>What you actually do tomorrow morning</h2>
<p>Pour oats in a jar. Cover them with milk. Cover the jar. Put it in the fridge. That's breakfast and you didn't even have to be awake for it. You can add fruit if you want. You can add peanut butter. You can leave it plain. Either way, you're done before you started.</p>

<p>For lunch you eat the lentils from last night. Heat them. Crack pepper on top. Lemon if you've got one. You don't need to dress it up because it isn't auditioning for anything. It's lunch. It feeds you. You go back to your day.</p>

<p>Dinner is the only meal you cook from scratch, and even that's a stretch. Pasta water. A jar of crushed tomatoes. Garlic. Olive oil. Twelve minutes. You added vegetables if you wanted to. You didn't if you didn't. Salt. Pepper. Eat. Sit down. Don't bring your phone. Watch the steam come off the bowl for a second. Then bed, eventually.</p>

<h2>What I'd skip if I started over</h2>
<p>I'd skip the macro tracking. I'd skip the supplements that cost more than groceries. I'd skip the influencer who sells discipline as a personality trait. I'd skip the morning shake that takes longer to make than my actual breakfast. And I'd skip pretending that any of this is a moral question. It's lunch. You're hungry. You eat. The rest is marketing.</p>

<p>The cooking is the practice. The thinking about the cooking is the part that derails people. Cook one pot. Cook one pan. Cook the same dinner three weeks in a row if it works. Stop reading articles, including this one, after the cooking starts. The internet doesn't get to be a guru about a Tuesday.</p>

<p>Around here at MyPlantDiet, this is the only rule we keep. The next meal counts more than the last one. Then you do that again. That's the whole article and the whole project.</p>

<h2>The longer version of the same idea</h2>
<p>Most people who try to switch overnight bounce off the wall a week later, because their kitchen still has a meat-and-cheese gravity. The trick is to change the kitchen first. The kitchen has more votes than your willpower. If the pasta is in the cabinet, you cook the pasta. If the lentils are pre-cooked in the fridge, you eat the lentils. If the only blender you own is sad and loud, the smoothies don't happen. So buy a blender that doesn't sound like a chainsaw. Stock the cabinet with two pastas, a can of beans, a jar of sauce, and a bag of frozen vegetables. The kitchen now votes for you.</p>

<p>Once the kitchen votes for you, the cooking becomes ordinary. Ordinary is the goal. Ordinary is what nobody on the internet wants to sell you, because ordinary doesn't make a viral reel. But ordinary is also the only version that lasts. The version with the matching dishware and the slow-motion drizzle shot ends in a binder of unfinished projects. The ordinary version ends with you, three years from now, not even thinking about whether tonight's dinner is plant-based. It just is. That's the win.</p>

<p>If you ever feel like you're slipping, count meals not days. A bad day is fine. Three bad weeks in a row is a kitchen problem. Walk through your fridge with a piece of paper. Anything you've thrown away three times in a row, stop buying. Anything you finished before it spoiled, buy more of. The fridge tells you who you are. Listen to it. The internet has lots of opinions, but the fridge knows.</p>

<p>Around here at MyPlantDiet, that's everything I have to say about it. The next meal. Then the next one. Until eventually you stop counting.</p>
`.trim();

const baseInput = {
  title: "Plant-curious starter",
  body: longBody,
  tldr: "A gentle on-ramp to eating more plants without all-or-nothing rules. Read this once, post it on the fridge, come back for the recipes.",
  internalLinks: [
    "/articles/blenders-that-pay-for-themselves",
    "/articles/the-pantry-shopping-list-i-actually-use",
    "/articles/the-30-day-curious-eater-plan",
  ],
  externalLinks: ["https://www.health.harvard.edu"],
  selfReference: "Around here at MyPlantDiet",
  authorByline: "The Oracle Lover",
};

describe("runQualityGate", () => {
  it("passes a clean EEAT-rich article", () => {
    const r = runQualityGate(baseInput);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(80);
  });

  it("rejects an em-dash anywhere in the body", () => {
    const r = runQualityGate({ ...baseInput, body: baseInput.body.replace("That's it.", "That's it — promise.") });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /em-dash/i.test(e))).toBe(true);
  });

  it("rejects a banned phrase", () => {
    const r = runQualityGate({
      ...baseInput,
      body: baseInput.body.replace(
        "Most articles like this read like a court summons.",
        "In today's fast-paced world, most articles like this read like a court summons."
      ),
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /banned/i.test(e))).toBe(true);
  });

  it("flags missing internal links", () => {
    const r = runQualityGate({ ...baseInput, internalLinks: ["/articles/only-one"] });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /internal/i.test(e))).toBe(true);
  });

  it("flags missing external link", () => {
    const r = runQualityGate({ ...baseInput, externalLinks: [] });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /external/i.test(e))).toBe(true);
  });

  it("flags missing TL;DR", () => {
    const r = runQualityGate({ ...baseInput, tldr: "" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /tl;dr/i.test(e))).toBe(true);
  });

  it("flags wrong byline", () => {
    const r = runQualityGate({ ...baseInput, authorByline: "Some Other Person" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /byline/i.test(e))).toBe(true);
  });

  it("flags forbidden infra URL leak", () => {
    const r = runQualityGate({
      ...baseInput,
      body: baseInput.body + '\n<p><a href="https://example.manus.computer">leak</a></p>',
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /forbidden/i.test(e))).toBe(true);
  });

  it("self-reference picker is deterministic and returns a MyPlantDiet string", () => {
    const a = pickSelfReference("some-slug");
    const b = pickSelfReference("some-slug");
    expect(a).toBe(b);
    expect(/myplantdiet/i.test(a)).toBe(true);
  });
});
