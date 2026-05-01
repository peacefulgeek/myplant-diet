import { Link } from "wouter";

const PLANTS = [
  { slug: "lentils", name: "Lentils", color: "from-amber-300/40 to-orange-300/30", note: "The 18-minute protein." },
  { slug: "tofu", name: "Tofu", color: "from-stone-200/60 to-amber-100/40", note: "Bland is a setup, not a fact." },
  { slug: "tempeh", name: "Tempeh", color: "from-amber-200/60 to-yellow-200/40", note: "The savory underdog." },
  { slug: "chickpeas", name: "Chickpeas", color: "from-yellow-200/60 to-lime-100/30", note: "Five dinners from one can." },
  { slug: "kale", name: "Kale", color: "from-emerald-300/40 to-emerald-200/30", note: "Massage it, don't fight it." },
  { slug: "sweet-potato", name: "Sweet potato", color: "from-orange-300/40 to-amber-200/30", note: "The default side." },
  { slug: "oats", name: "Oats", color: "from-stone-200/60 to-amber-100/30", note: "Breakfast on autopilot." },
  { slug: "almonds", name: "Almonds", color: "from-amber-100/60 to-stone-200/40", note: "Snack that earns its salt." },
];

export default function Library() {
  return (
    <div className="container py-12">
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl">Plant library</h1>
        <p className="mt-3 text-lg text-foreground/75">
          A growing reference of the ingredients we cook with most. One paragraph
          each. Why we love it, where to start.
        </p>
      </header>
      <section className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {PLANTS.map((p) => (
          <Link
            key={p.slug}
            href={`/articles?q=${encodeURIComponent(p.name)}`}
            className={
              "group rounded-2xl border border-border p-5 bg-gradient-to-br " +
              p.color +
              " hover:pc-shadow-lg transition-all"
            }
          >
            <h3 className="font-serif text-xl">{p.name}</h3>
            <p className="text-foreground/75 mt-1 text-sm">{p.note}</p>
            <p className="mt-3 text-xs text-primary uppercase tracking-wide">Read more</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
