import { useParams } from "react-router-dom";
import { BriefSection } from "@/components/brief/BriefSection";
import { CompactStory } from "@/components/brief/CompactStory";
import { HeroSection } from "@/components/brief/HeroSection";
import { LeadStory } from "@/components/brief/LeadStory";
import { DecisionSignals } from "@/components/quick/DecisionSignals";
import { ExecutiveSnapshot } from "@/components/quick/ExecutiveSnapshot";
import { WatchlistActions } from "@/components/quick/WatchlistActions";
import { useBrief } from "@/hooks/useBrief";
import type { ProcessedTopic } from "@/types";

export function QuickBriefPage() {
  const { date } = useParams();
  const { data, loading, error } = useBrief(date, "quick");

  if (loading) return <div className="muted">Loading quick brief…</div>;
  if (error || !data) return <div className="muted text-red-300">{error ?? "Brief unavailable"}</div>;

  const topBrief = getSectionTopics(data.topics, data.brief.sections, "top-brief");
  const leadTopic = topBrief[0];
  const compactTopics = topBrief.slice(1);

  return (
    <div className="quick">
      <HeroSection brief={data.brief} mode="quick" />

      <BriefSection title="Executive Snapshot" linkLabel="View logic →">
        <ExecutiveSnapshot topics={getSectionTopics(data.topics, data.brief.sections, "executive-snapshot")} />
      </BriefSection>

      <BriefSection title="Top Brief" linkLabel="Full issue →">
        <div className="story-grid" id="top-stories">
          {leadTopic ? <LeadStory topic={leadTopic} /> : null}
          <aside className="compact-list">
            {compactTopics.map((topic) => (
              <CompactStory key={topic.id} topic={topic} />
            ))}
          </aside>
        </div>
      </BriefSection>

      <BriefSection title="Decision Signals" linkLabel="Export notes →">
        <DecisionSignals topics={getSectionTopics(data.topics, data.brief.sections, "decision-signals")} />
      </BriefSection>

      <BriefSection title="Watchlist & Next Moves" linkLabel="Track all →">
        <WatchlistActions topics={getSectionTopics(data.topics, data.brief.sections, "watchlist")} />
      </BriefSection>

      <BriefCTA
        heading={data.brief.display?.ctaHeading ?? "Stay ahead, without reading everything."}
        body={data.brief.display?.ctaBody ?? data.brief.summary}
        input={data.brief.display?.ctaInput ?? "editor@bemonews.ai"}
        button={data.brief.display?.ctaButton ?? "Subscribe"}
      />
    </div>
  );
}

function getSectionTopics(
  topics: ProcessedTopic[],
  sections: { key: string; topicIds: string[] }[],
  key: string,
) {
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const section = sections.find((item) => item.key === key);
  return section?.topicIds.map((id) => topicById.get(id)).filter(Boolean) as ProcessedTopic[] ?? [];
}

function BriefCTA({ heading, body, input, button }: { heading: string; body: string; input: string; button: string }) {
  return (
    <section className="cta">
      <div className="cta-inner">
        <div>
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
        <form className="cta-form">
          <input type="email" value={input} readOnly aria-label="Email address" />
          <button className="button" type="button">{button}</button>
        </form>
      </div>
    </section>
  );
}
