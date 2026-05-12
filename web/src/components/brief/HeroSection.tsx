import type { BriefDraft } from "@/types";

interface HeroSectionProps {
  brief: BriefDraft;
  mode?: "quick" | "full";
}

export function HeroSection({ brief, mode = brief.type }: HeroSectionProps) {
  const display = brief.display;
  const stats = display?.heroStats?.length
    ? display.heroStats
    : [
        { value: String(brief.stats.selectedTopics), label: "Topics selected" },
        { value: String(brief.stats.crossSourceTopics), label: "Cross-source" },
        { value: brief.date, label: "Date" },
      ];
  const meta = display?.heroMeta ?? [`${brief.stats.selectedTopics} topics`, `${brief.stats.crossSourceTopics} cross-source`, brief.date];

  return (
    <section className={["hero", mode === "quick" ? "compact" : ""].join(" ")}>
      <div>
        <div className="eyebrow">{display?.eyebrow ?? (brief.type === "quick" ? "Quick Brief" : "Full Brief")}</div>
        <h1 className="hero-title">{display?.heroTitle ?? brief.title}</h1>
        <p className="hero-summary">{display?.heroSummary ?? brief.summary}</p>
        <div className="hero-actions">
          <a className="button" href="#top-stories">{brief.type === "quick" ? "Read today's brief" : "Subscribe"}</a>
          <a className="button-secondary" href={brief.type === "quick" ? "/2026-05-12/full" : "/2026-05-12/quick"}>
            {brief.type === "quick" ? "Open full issue" : "Read quick briefing"}
          </a>
        </div>
        <div className="hero-meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      {mode === "quick" ? (
        <aside className="hero-panel">
          <div className="hero-panel-content">
            <div className="hero-label">Today&apos;s Readout</div>
            <div className="orbital-visual">
              <div className="orbital-card" />
            </div>
            <div className="mini-stats">
              {stats.map((item) => (
                <Metric key={`${item.value}-${item.label}`} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
        </aside>
      ) : (
        <aside className="hero-art" aria-label="Brief visual">
          <div className="hero-card" />
        </aside>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
