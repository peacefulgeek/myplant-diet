export default function Privacy() {
  return (
    <div className="container py-12 max-w-3xl pc-prose">
      <h1>Privacy</h1>
      <p>
        MyPlantDiet collects only what it needs to make the site work and to
        understand how it&apos;s used. We don&apos;t sell or rent your data.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Basic analytics: pages viewed, referrer, device type.</li>
        <li>Account info if you sign in (name, email, OAuth identifier).</li>
        <li>Saved articles you&apos;ve bookmarked, only while signed in.</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        A single session cookie keeps you signed in. Analytics is privacy-first
        and aggregated.
      </p>
      <h2>Third parties</h2>
      <p>
        Outbound links (including affiliate links) follow standard browser
        referer rules. We do not embed cross-site trackers.
      </p>
      <h2>Contact</h2>
      <p>
        Email us at hello@myplantdiet.com for privacy questions or data
        deletion requests.
      </p>
    </div>
  );
}
