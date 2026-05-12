import { useParams } from "react-router-dom";
import { BriefSection } from "@/components/brief/BriefSection";
import { CompactStory } from "@/components/brief/CompactStory";
import { HeroSection } from "@/components/brief/HeroSection";
import { LeadStory } from "@/components/brief/LeadStory";
import { DecisionSignals } from "@/components/quick/DecisionSignals";
import { ExecutiveSnapshot } from "@/components/quick/ExecutiveSnapshot";
import { WatchlistActions } from "@/components/quick/WatchlistActions";
import { useBrief } from "@/hooks/useBrief";

export function QuickBriefPage() {
  const { date } = useParams();
  const { data, loading, error } = useBrief(date, "quick");

  if (loading) return <div className="muted">Loading quick brief…</div>;
  if (error || !data) return <div className="muted text-red-300">{error ?? "Brief unavailable"}</div>;

  const leadTopic = data.topics[0];
  const compactTopics = data.topics.slice(1, 4);

  return (
    <div className="space-y-10">
      <HeroSection
        brief={data.brief}
        meta={[
          `${data.brief.stats.selectedTopics} topics`,
          `${data.brief.stats.crossSourceTopics} cross-source`,
          `${data.brief.date}`,
        ]}
      />

      <BriefSection eyebrow="Snapshot" title="Executive Snapshot">
        <ExecutiveSnapshot topics={data.topics.slice(0, 4)} />
      </BriefSection>

      <BriefSection eyebrow="Top Brief" title="Lead story and key supporting signals">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          {leadTopic ? <LeadStory topic={leadTopic} /> : null}
          <div className="space-y-4">
            {compactTopics.map((topic) => (
              <CompactStory key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </BriefSection>

      <BriefSection eyebrow="Signals" title="Decision Signals">
        <DecisionSignals topics={data.topics.slice(0, 3)} />
      </BriefSection>

      <BriefSection eyebrow="Watchlist" title="Watchlist and next actions">
        <WatchlistActions topics={data.topics.slice(0, 4)} />
      </BriefSection>
    </div>
  );
}
