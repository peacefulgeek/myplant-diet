import { Link, useLocation } from "wouter";
import { Home as HomeIcon, Search, Bookmark, Info } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/articles", label: "Search", Icon: Search },
  { href: "/saved", label: "Saved", Icon: Bookmark },
  { href: "/about", label: "About", Icon: Info },
];

export function MobileTabBar() {
  const [path] = useLocation();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-[oklch(0.985_0.018_95/0.95)] backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="grid grid-cols-4">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex flex-col items-center justify-center py-2 gap-1 text-xs " +
                (active ? "text-primary" : "text-foreground/70 hover:text-foreground")
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
