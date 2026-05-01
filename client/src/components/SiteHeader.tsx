import { Link, useLocation } from "wouter";
import { Leaf, Search, Bookmark, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/library", label: "Library" },
  { href: "/assessments", label: "Assessments" },
  { href: "/supplements", label: "Supplements" },
  { href: "/starter-kit", label: "Starter Kit" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [path] = useLocation();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/70 backdrop-blur-md bg-[oklch(0.985_0.018_95/0.85)]">
      <div className="container flex items-center gap-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground pc-shadow">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">MyPlantDiet</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "px-3 py-2 rounded-full transition-colors " +
                (path === l.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full hover:bg-accent text-foreground/80"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link
            href="/saved"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full hover:bg-accent text-foreground/80"
            aria-label="Saved"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            href="/starter-kit"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium pc-shadow hover:opacity-95 transition"
          >
            <Sparkles className="h-4 w-4" />
            Starter Kit
          </Link>
        </div>
      </div>
    </header>
  );
}
