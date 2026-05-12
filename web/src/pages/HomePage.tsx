import { format } from "date-fns";
import { Link } from "react-router-dom";
import { BriefSection } from "@/components/brief/BriefSection";
import { useManifest } from "@/hooks/useManifest";

export function HomePage() {
  const { data, loading, error } = useManifest();

  return (
    <div className="space-y-10">
      <section className="panel p-6 sm:p-8">
        <span className="eyebrow">Home</span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">Daily intelligence, organized around decisions.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-300">
          This scaffold already speaks the same data contract as the Go backend. The next layer is to enrich the pipeline output and map it into the final editorial layout.
        </p>
      </section>

      <BriefSection
        eyebrow="Manifest"
        title="Available brief runs"
        description="The homepage is manifest-driven. Once the pipeline writes quick/full drafts, this list becomes the archive entry point."
      >
        {loading ? <div className="muted">Loading manifest…</div> : null}
        {error ? <div className="muted text-red-300">{error}</div> : null}
        {!loading && !error && data ? (
          <div className="grid gap-4">
            {data.briefs.length === 0 ? (
              <div className="panel p-5 text-sm text-ink-400">No briefs yet. Trigger `/api/generate` once the backend is running.</div>
            ) : (
              data.briefs.map((entry) => (
                <Link
                  key={`${entry.date}-${entry.type}`}
                  to={`/${entry.date}${entry.type === "quick" ? "/quick" : "/full"}`}
                  className="panel flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-lg font-semibold text-ink-100">{entry.title}</div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-ink-500">
                      {entry.type}
                    </span>
                  </div>
                  <div className="text-sm text-ink-400">
                    {format(new Date(entry.generatedAt), "yyyy-MM-dd HH:mm")} · {entry.stats.selectedTopics} topics
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : null}
      </BriefSection>
    </div>
  );
}
