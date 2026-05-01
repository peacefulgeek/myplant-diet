import { Link } from "wouter";

export default function About() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-serif text-4xl">About MyPlantDiet</h1>
      <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
        MyPlantDiet is a friendly, image-rich publication for people who are
        thinking about eating more plants. Not vegan-or-bust. Not preachy. Just
        practical writing for the curious eater.
      </p>
      <h2 className="font-serif text-2xl mt-10">Who writes here</h2>
      <p className="mt-3 text-foreground/80 leading-relaxed">
        Every article is written under the editorial voice of <em>The Oracle
        Lover</em>, an independent writer with a decade-plus of experience
        making complex topics feel inviting. You can find more of that work at
        {" "}
        <a href="https://theoraclelover.com" className="text-primary underline">
          theoraclelover.com
        </a>
        .
      </p>

      <h2 className="font-serif text-2xl mt-10">How we publish</h2>
      <p className="mt-3 text-foreground/80 leading-relaxed">
        MyPlantDiet publishes new articles on a steady weekday cadence. Every
        article passes a strict quality gate before it&apos;s allowed to go
        live. That means a TL;DR up top, an honest byline, internal links to
        related reading, at least one authoritative external citation, and zero
        tolerance for filler.
      </p>

      <h2 className="font-serif text-2xl mt-10">How we make money</h2>
      <p className="mt-3 text-foreground/80 leading-relaxed">
        MyPlantDiet is reader-supported and partly funded by Amazon affiliate
        links. Every paid link is labeled with &quot;(paid link)&quot;. We only
        recommend things we&apos;d give a friend. See{" "}
        <Link href="/disclosures" className="text-primary underline">
          full disclosures
        </Link>{" "}
        for the long version.
      </p>

      <h2 className="font-serif text-2xl mt-10">What we won&apos;t do</h2>
      <ul className="mt-3 list-disc pl-6 space-y-1 text-foreground/80">
        <li>Tell you to be perfect.</li>
        <li>Hide affiliate relationships.</li>
        <li>Use AI without saying so.</li>
        <li>Sell your data.</li>
      </ul>
    </div>
  );
}
