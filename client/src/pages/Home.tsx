import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Sparkles, BookOpen, Leaf } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";

const HERO_BG =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=80&fm=webp";

export default function Home() {
  const { data, isLoading } = trpc.articles.list.useQuery({ limit: 24, offset: 0 });

  const items = data?.items || [];
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container pt-10 pb-14 md:pt-16 md:pb-20 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/65 mb-4">
              <Leaf className="h-3.5 w-3.5 text-primary" /> Curious about plants?
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Eat more plants, gently. <em className="not-italic text-primary">Without giving up</em> the things you love.
            </h1>
            <p className="mt-5 text-lg text-foreground/75 max-w-xl">
              Plant-based recipes, beginner-friendly guides, and the science behind feeling
              better. No dogma. No purity tests. Just useful, image-rich writing for the
              plant-curious.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/starter-kit"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-medium pc-shadow hover:opacity-95"
              >
                <Sparkles className="h-4 w-4" /> Start the 30-day on-ramp
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-medium hover:bg-accent"
              >
                <BookOpen className="h-4 w-4" /> Browse articles
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden pc-shadow-lg aspect-[4/5]">
              <img
                src={HERO_BG}
                alt="Sunlit cream table with fresh greens, herbs, and a wooden spoon"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.55_0.12_138/0.18)] to-[oklch(0.71_0.13_60/0.18)] mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden md:block bg-card pc-shadow-lg rounded-2xl px-4 py-3 text-sm">
              <p className="text-foreground/65">Today on Plant Curious</p>
              <p className="font-medium">{featured?.title || "Fresh ideas, every weekday"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="container">
          <Link
            href={`/articles/${featured.slug}`}
            className="block rounded-3xl overflow-hidden pc-shadow-lg group"
          >
            <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full">
              <img
                src={featured.heroUrl}
                alt={featured.heroAlt || featured.title}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.02_110/0.85)] via-[oklch(0.18_0.02_110/0.25)] to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-secondary/90 text-secondary-foreground text-[11px] font-medium px-2.5 py-1 tracking-wide uppercase mb-3">
                  Featured
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-2 text-white/85 text-base sm:text-lg max-w-2xl line-clamp-2">
                  {featured.metaDescription}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Section title */}
      <section className="container mt-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">Latest from the kitchen</h2>
            <p className="text-foreground/65 text-sm mt-1">
              New writing every weekday. Image-rich. Practical. Not preachy.
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex text-sm rounded-full border border-border bg-card px-4 py-2 hover:bg-accent"
          >
            All articles
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : rest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <h3 className="font-serif text-xl">The kitchen is warming up.</h3>
            <p className="text-foreground/65 mt-2">
              The first articles are queued and will publish on the schedule. Come back tomorrow.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm"
            >
              Learn more about Plant Curious
            </Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {rest.map((a, i) => (
              <div key={a.slug} className="mb-5 break-inside-avoid">
                <ArticleCard article={a} variant={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
