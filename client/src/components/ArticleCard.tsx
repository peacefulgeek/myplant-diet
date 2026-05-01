import { Link } from "wouter";

export interface ArticleCardData {
  slug: string;
  title: string;
  metaDescription?: string;
  heroUrl: string;
  heroAlt?: string | null;
  category: string;
  tags?: string[] | null;
  publishedAt?: Date | string | null;
  wordCount?: number;
}

const HEIGHTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[5/6]", "aspect-[1/1]"];

export function ArticleCard({
  article,
  variant = 0,
  showCategory = true,
}: {
  article: ArticleCardData;
  variant?: number;
  showCategory?: boolean;
}) {
  const aspect = HEIGHTS[variant % HEIGHTS.length];
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-2xl overflow-hidden pc-shadow hover:pc-shadow-lg transition-all bg-card"
    >
      <div className={"relative w-full " + aspect + " overflow-hidden"}>
        <img
          src={article.heroUrl}
          alt={article.heroAlt || article.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.02_110/0.85)] via-[oklch(0.18_0.02_110/0.25)] to-transparent" />
        {showCategory && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[oklch(0.985_0.018_95/0.95)] text-foreground/85 text-[11px] font-medium px-2.5 py-1 tracking-wide uppercase">
            {article.category}
          </span>
        )}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
          <h3 className="font-serif text-lg sm:text-xl leading-tight drop-shadow-sm">
            {article.title}
          </h3>
          {article.metaDescription && (
            <p className="mt-1 text-white/80 text-sm line-clamp-2">
              {article.metaDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
