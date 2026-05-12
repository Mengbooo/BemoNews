import type { BriefDraft } from "@/types";

interface HeroSectionProps {
  brief: BriefDraft;
  meta?: string[];
}

export function HeroSection({ brief, meta = [] }: HeroSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
      <div className="panel p-6 sm:p-8">
        <span className="eyebrow">{brief.type === "quick" ? "Quick Brief" : "Full Brief"}</span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
          {brief.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-300">{brief.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {meta.map((item) => (
            <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-sm text-ink-400">
              {item}
            </span>
          ))}
        </div>
      </div>

      <aside className="panel p-6">
        <div className="text-sm font-medium text-ink-300">Today&apos;s Readout</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Metric label="Topics selected" value={String(brief.stats.selectedTopics)} />
          <Metric label="Input items" value={String(brief.stats.inputItems)} />
          <Metric label="Cross-source" value={String(brief.stats.crossSourceTopics)} />
          <Metric label="Date" value={brief.date} mono />
        </div>
      </aside>
    </section>
  );
}

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-ink-500">{label}</div>
      <div className={["mt-3 text-2xl font-semibold text-ink-100", mono ? "font-mono text-lg" : ""].join(" ")}>
        {value}
      </div>
    </div>
  );
}
