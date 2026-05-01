import { Link } from "wouter";
import { Sparkles } from "lucide-react";

const KIT = [
  { day: "Days 1-3", focus: "Pantry first", text: "Build a five-thing pantry: lentils, olive oil, crushed tomatoes, onions, smoked paprika." },
  { day: "Days 4-7", focus: "One swap a day", text: "Swap one familiar dinner for a plant-forward version. Keep breakfast and lunch the same." },
  { day: "Week 2", focus: "Two plant dinners", text: "Choose two weeknights in advance. Make extra. Eat it again the next day at lunch." },
  { day: "Week 3", focus: "Try one new ingredient", text: "Tofu, tempeh, or lentils, you pick. One recipe, twice." },
  { day: "Week 4", focus: "Settle in", text: "Notice how you feel. Sleep, energy, digestion. Keep what works, drop what doesn't." },
];

const PICKS = [
  { name: "A heavy pan", asin: "B00939ENBE", why: "Browns better, cleans easier, lasts forever." },
  { name: "A solid blender", asin: "B07GR5MSKD", why: "Sauces, soups, smoothies. The single appliance that earns its space." },
  { name: "A starter cookbook", asin: "B093RNVB5Z", why: "Recipes that survive a Tuesday." },
];

export default function StarterKit() {
  return (
    <div className="container py-12">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/65">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 30-day on-ramp
        </span>
        <h1 className="font-serif text-4xl mt-2">A gentle 30-day starter kit</h1>
        <p className="mt-3 text-lg text-foreground/75 leading-relaxed">
          Five small shifts, four weeks, no purity tests. Read it once, post it on
          the fridge, come back for the recipes when you need them.
        </p>
      </header>

      <section className="mt-10 grid md:grid-cols-2 gap-6">
        {KIT.map((k) => (
          <article
            key={k.day}
            className="rounded-2xl border border-border bg-card p-6 pc-shadow"
          >
            <p className="text-xs uppercase tracking-wide text-secondary-foreground/80">
              {k.day}
            </p>
            <h2 className="font-serif text-2xl mt-1">{k.focus}</h2>
            <p className="mt-2 text-foreground/75">{k.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Three things actually worth buying</h2>
        <p className="text-foreground/65 mt-1 text-sm">
          Affiliate links are marked &quot;(paid link)&quot;. Editorial is independent.
        </p>
        <ul className="mt-5 grid sm:grid-cols-3 gap-5">
          {PICKS.map((p) => (
            <li key={p.asin} className="rounded-2xl border border-border bg-card p-5 pc-shadow">
              <h3 className="font-serif text-lg">{p.name}</h3>
              <p className="text-foreground/75 mt-1 text-sm">{p.why}</p>
              <a
                href={`https://www.amazon.com/dp/${p.asin}/?tag=spankyspinola-20`}
                rel="nofollow sponsored"
                className="mt-3 inline-flex items-center text-primary text-sm underline"
              >
                See on Amazon (paid link)
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-3xl bg-primary/5 p-8 border border-primary/20">
        <h2 className="font-serif text-2xl">Keep going</h2>
        <p className="mt-2 text-foreground/80 max-w-2xl">
          The next step is your kitchen, not another rule. Pick one recipe and
          make it twice this week.
        </p>
        <Link
          href="/articles"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-medium pc-shadow"
        >
          Browse the recipe library
        </Link>
      </section>
    </div>
  );
}
