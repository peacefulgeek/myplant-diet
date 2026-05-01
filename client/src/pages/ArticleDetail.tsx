import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Bookmark, ArrowLeft, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { toggleSavedSlug, getSavedSlugs } from "@/pages/Saved";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = trpc.articles.bySlug.useQuery({ slug: slug || "" });

  const headings = useMemo(() => {
    if (!data?.body) return [] as { id: string; text: string }[];
    const out: { id: string; text: string }[] = [];
    const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(data.body)) !== null) {
      const text = m[1].replace(/<[^>]+>/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      out.push({ id, text });
    }
    return out;
  }, [data?.body]);

  // Inject ids on H2 elements after render so the TOC can scroll-to.
  const articleRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!articleRef.current) return;
    const h2s = articleRef.current.querySelectorAll("h2");
    headings.forEach((h, i) => {
      const el = h2s[i];
      if (el && !el.id) el.id = h.id;
    });
  }, [data?.body, headings]);

  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    if (!articleRef.current || headings.length === 0) return;
    const h2s = Array.from(articleRef.current.querySelectorAll("h2"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [headings]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse h-10 w-1/2 bg-muted rounded mb-4" />
        <div className="aspect-[16/8] bg-muted rounded-2xl" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl">Article not found.</h1>
        <Link href="/articles" className="mt-4 inline-block text-primary underline">
          Back to articles
        </Link>
      </div>
    );
  }

  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  const updatedAt = data.lastModifiedAt ? new Date(data.lastModifiedAt) : publishedAt;
  const minutes = Math.max(1, Math.round((data.wordCount || 1500) / 220));
  const gallery = (data.galleryUrls as string[]) || [];

  return (
    <article className="container py-8 md:py-12">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1 text-sm text-foreground/65 hover:text-primary mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All articles
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center rounded-full bg-secondary/15 text-secondary-foreground/90 text-[11px] font-medium px-2.5 py-1 tracking-wide uppercase">
          {data.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl leading-tight mt-3 max-w-4xl">
          {data.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/65">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> By {data.author || "The Oracle Lover"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {minutes} min read
          </span>
          {publishedAt && (
            <time dateTime={publishedAt.toISOString()} className="text-foreground/55">
              Published {publishedAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {updatedAt && publishedAt && updatedAt.getTime() !== publishedAt.getTime() && (
            <time dateTime={updatedAt.toISOString()} className="text-foreground/55">
              Updated {updatedAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <button
            onClick={() => {
              if (!data?.slug) return;
              const isSaved = toggleSavedSlug(data.slug);
              toast.success(isSaved ? "Saved on this device" : "Removed from saved");
            }}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            <Bookmark className={`h-3.5 w-3.5 ${data?.slug && getSavedSlugs().includes(data.slug) ? "fill-current" : ""}`} /> Save
          </button>
        </div>
      </header>

      {/* Pill TOC */}
      {headings.length > 0 && (
        <nav
          aria-label="Table of contents"
          className="-mx-4 px-4 mb-6 overflow-x-auto whitespace-nowrap"
        >
          <ul className="inline-flex gap-2">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={
                    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm transition " +
                    (activeId === h.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent border-border")
                  }
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden pc-shadow-lg mb-8">
        <img
          src={data.heroUrl}
          alt={data.heroAlt || data.title}
          className="w-full aspect-[16/8] object-cover"
        />
      </div>

      {/* 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div
          ref={articleRef}
          className="pc-prose lg:col-span-7"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
        <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((url, i) => (
              <div
                key={url + i}
                className={
                  "rounded-2xl overflow-hidden pc-shadow " +
                  (i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-[1/1]")
                }
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border p-5 bg-card">
            <h3 className="font-serif text-lg">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(data.tags as string[] || []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-accent text-accent-foreground text-xs px-2.5 py-1"
                >
                  #{t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-foreground/55">
              Affiliate links throughout this site are marked &quot;(paid link)&quot;.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
