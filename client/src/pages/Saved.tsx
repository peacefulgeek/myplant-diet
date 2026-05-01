import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { ArticleCard } from "@/components/ArticleCard";
import { getLoginUrl } from "@/const";

export default function Saved() {
  const { isAuthenticated, loading } = useAuth();
  const enabled = isAuthenticated;
  const { data, isLoading } = trpc.saved.list.useQuery(undefined, { enabled });

  if (loading) {
    return <div className="container py-16 text-center text-foreground/60">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-20 text-center max-w-xl">
        <h1 className="font-serif text-3xl">Save articles to read later</h1>
        <p className="mt-3 text-foreground/70">
          Sign in to keep a private list of pieces worth coming back to.
        </p>
        <a
          href={getLoginUrl()}
          className="mt-5 inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-3 font-medium pc-shadow"
        >
          Sign in
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container py-20 text-center max-w-xl">
        <h1 className="font-serif text-3xl">Nothing saved yet.</h1>
        <p className="mt-3 text-foreground/70">
          Tap the bookmark on any article to keep it here.
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

  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl sm:text-4xl">Your saved articles</h1>
      <p className="text-foreground/70 mt-2">A private list. Only you see this.</p>
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-5">
        {data.map((row, i) => (
          <div key={row.article.slug} className="mb-5 break-inside-avoid">
            <ArticleCard article={row.article} variant={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
