import { Link, useParams } from "react-router-dom";
import { BriefSection } from "@/components/brief/BriefSection";

export function DatePage() {
  const { date = "" } = useParams();

  return (
    <div className="space-y-8">
      <section className="panel p-6 sm:p-8">
        <span className="eyebrow">Archive Day</span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-100">{date}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-300">
          This date hub is the shared entry point for quick and full reports. As the manifest gets richer, we can add summary metrics and links to delivery runs here.
        </p>
      </section>

      <BriefSection title="Choose a reading mode">
        <div className="grid gap-4 md:grid-cols-2">
          <Link to={`/${date}/quick`} className="panel p-5 hover:bg-white/10">
            <div className="text-xs uppercase tracking-[0.15em] text-ink-500">Quick</div>
            <div className="mt-3 text-xl font-semibold text-ink-100">4-minute situational readout</div>
            <p className="mt-3 text-sm leading-6 text-ink-400">Optimized for concise scanning, high-priority topics, and decision support blocks.</p>
          </Link>
          <Link to={`/${date}/full`} className="panel p-5 hover:bg-white/10">
            <div className="text-xs uppercase tracking-[0.15em] text-ink-500">Full</div>
            <div className="mt-3 text-xl font-semibold text-ink-100">Expanded research and community sweep</div>
            <p className="mt-3 text-sm leading-6 text-ink-400">Designed for complete inspection across official blogs, research, engineering, community, media, and newsletters.</p>
          </Link>
        </div>
      </BriefSection>
    </div>
  );
}
