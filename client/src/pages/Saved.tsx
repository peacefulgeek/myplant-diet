import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArticleCard } from "@/components/ArticleCard";

const KEY = "myplantdiet:saved";

export function getSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function toggleSavedSlug(slug: string): boolean {
  const cur = new Set(getSavedSlugs());
  let saved: boolean;
  if (cur.has(slug)) {
    cur.delete(slug);
    saved = false;
  } else {
    cur.add(slug);
    saved = true;
  }
  localStorage.setItem(KEY, JSON.stringify(Array.from(cur)));
  window.dispatchEvent(new Event("myplantdiet:saved-changed"));
  return saved;
}

export default function Saved() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(getSavedSlugs());
    setHydrated(true);
    const onChange = () => setSlugs(getSavedSlugs());
    window.addEventListener("myplantdiet:saved-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myplantdiet:saved-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const { data, isLoading } = trpc.articles.bySlugs.useQuery(
    { slugs },
    { enabled: hydrated && slugs.length > 0 }
  );

  if (!hydrated) {
    return <div className="container py-16 text-center text-foreground/60">Loading...</div>;
  }

  if (slugs.length === 0) {
    return (
      <div className="container py-20 text-center max-w-xl">
        <h1 className="font-serif text-3xl">Nothing saved yet.</h1>
        <p className="mt-3 text-foreground/70">
          Tap the bookmark on any article to keep it here. Saved privately on your device. No login. No tracking.
        </p>
        <Link
          href="/articles"
          className="mt-5 inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-3 font-medium pc-shadow"
        >
          Browse articles
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: Math.min(slugs.length, 6) }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  const articles = (data ?? []).filter((a): a is NonNullable<typeof a> => a !== null);

  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl sm:text-4xl">Your saved articles</h1>
      <p className="text-foreground/70 mt-2">A private list, kept on your device only. No account. No login.</p>
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-5">
        {articles.map((article, i) => (
          <div key={article.slug} className="mb-5 break-inside-avoid">
            <ArticleCard article={article} variant={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
