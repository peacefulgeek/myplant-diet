import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArticleCard } from "@/components/ArticleCard";
import { Search } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "starter-guides", label: "Starter Guides" },
  { value: "recipes", label: "Recipes" },
  { value: "ingredients", label: "Ingredients" },
  { value: "nutrition", label: "Nutrition" },
  { value: "shopping", label: "Shopping" },
  { value: "lifestyle", label: "Lifestyle" },
];

export default function Articles() {
  const [category, setCategory] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const params = useMemo(
    () => ({
      limit: 48,
      offset: 0,
      category: category || undefined,
      q: q || undefined,
    }),
    [category, q]
  );

  const { data, isLoading } = trpc.articles.list.useQuery(params);
  const items = data?.items || [];

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl">Articles</h1>
        <p className="text-foreground/70 mt-2 max-w-2xl">
          Browse the full library. Filter by category, or search for a recipe, ingredient, or
          idea.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <input
            type="search"
            placeholder="Search articles, ingredients, recipes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={
                "rounded-full text-sm px-4 py-2 border " +
                (category === c.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent border-border")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <h3 className="font-serif text-xl">No matches yet.</h3>
          <p className="text-foreground/65 mt-2">Try a different search or category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {items.map((a, i) => (
            <div key={a.slug} className="mb-5 break-inside-avoid">
              <ArticleCard article={a} variant={i} />
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-sm text-foreground/55">
        Showing {items.length} of {data?.total || 0}.
      </p>
    </div>
  );
}
