import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const { data, isLoading, refetch } = trpc.admin.cronRuns.useQuery();
  const counts = trpc.articles.countPublished.useQuery();
  const generateOne = trpc.admin.generateOne.useMutation({
    onSuccess: (r) => {
      if (r.ok) toast.success(`Queued ${("slug" in r ? r.slug : "")}`);
      else toast.error(("reason" in r ? r.reason : "Failed") || "Failed");
      refetch();
    },
  });

  if (loading) return <div className="container py-16">Loading...</div>;
  if (!isAdmin) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl">Admin only</h1>
        <p className="text-foreground/70 mt-2">Sign in as the site owner to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl">Admin dashboard</h1>
          <p className="text-foreground/65 mt-1 text-sm">
            Cron health, article counts, and manual seeding.
          </p>
        </div>
        <button
          onClick={() => generateOne.mutate({})}
          disabled={generateOne.isPending}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm pc-shadow"
        >
          {generateOne.isPending ? "Generating..." : "Queue one new article"}
        </button>
      </header>

      <section className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="rounded-2xl border border-border bg-card p-5 pc-shadow">
          <p className="text-xs uppercase text-foreground/55">Published</p>
          <p className="font-serif text-3xl mt-1">{counts.data?.count ?? "..."}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 pc-shadow">
          <p className="text-xs uppercase text-foreground/55">Cron jobs tracked</p>
          <p className="font-serif text-3xl mt-1">
            {data ? Object.keys(data.byJob).length : "..."}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 pc-shadow">
          <p className="text-xs uppercase text-foreground/55">Last run</p>
          <p className="font-serif text-lg mt-1">
            {data?.rows[0]?.ranAt
              ? new Date(data.rows[0].ranAt).toLocaleString()
              : "no runs yet"}
          </p>
        </div>
      </section>

      <h2 className="font-serif text-xl mb-3">Job history</h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-accent/40 text-foreground/65">
            <tr>
              <th className="text-left px-4 py-2">Job</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Detail</th>
              <th className="text-left px-4 py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-2 font-medium">{r.job}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "inline-flex rounded-full px-2 py-0.5 text-xs " +
                      (r.status === "ok"
                        ? "bg-primary/15 text-primary"
                        : r.status === "skipped"
                          ? "bg-accent text-accent-foreground"
                          : "bg-destructive/15 text-destructive")
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-foreground/70">{r.detail || ""}</td>
                <td className="px-4 py-2 text-foreground/55">
                  {new Date(r.ranAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {(!data || data.rows.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground/55">
                  {isLoading ? "Loading..." : "No cron runs yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
