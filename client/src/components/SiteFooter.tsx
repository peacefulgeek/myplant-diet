import { Link } from "wouter";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-[oklch(0.96_0.018_95)]">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-semibold text-lg">Plant Curious</span>
          </div>
          <p className="mt-3 max-w-md text-foreground/75 leading-relaxed">
            A gentle, image-rich plant-based publication. Practical guides, recipes,
            and the science behind eating more plants. Not preachy, not perfect,
            just curious.
          </p>
          <p className="mt-3 text-sm text-foreground/60">
            By <a href="https://theoraclelover.com" className="underline">The Oracle Lover</a>.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Read</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/articles" className="hover:text-primary">All articles</Link></li>
            <li><Link href="/library" className="hover:text-primary">Plant library</Link></li>
            <li><Link href="/starter-kit" className="hover:text-primary">Starter kit</Link></li>
            <li><Link href="/saved" className="hover:text-primary">Saved</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Site</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/disclosures" className="hover:text-primary">Disclosures</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-xs text-foreground/60 flex flex-col md:flex-row gap-2 md:justify-between">
          <p>&copy; {new Date().getFullYear()} Plant Curious. All rights reserved.</p>
          <p>
            Affiliate links are marked &quot;(paid link)&quot;. Editorial is independent.
          </p>
        </div>
      </div>
      <div className="md:hidden h-16" />
    </footer>
  );
}
