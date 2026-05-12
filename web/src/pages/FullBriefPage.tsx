import { useParams } from "react-router-dom";
import { BriefSection } from "@/components/brief/BriefSection";
import { CompactStory } from "@/components/brief/CompactStory";
import { HeroSection } from "@/components/brief/HeroSection";
import { LeadStory } from "@/components/brief/LeadStory";
import { CommunityPicks } from "@/components/full/CommunityPicks";
import { CuratedResources } from "@/components/full/CuratedResources";
import { IndustryResearch } from "@/components/full/IndustryResearch";
import { NewTools } from "@/components/full/NewTools";
import { OpenSourceTools } from "@/components/full/OpenSourceTools";
import { TrendingDiscussions } from "@/components/full/TrendingDiscussions";
import { useBrief } from "@/hooks/useBrief";
import type { ProcessedTopic } from "@/types";

export function FullBriefPage() {
  const { date } = useParams();
  const { data, loading, error } = useBrief(date, "full");

  if (loading) return <div className="muted">Loading full brief…</div>;
  if (error || !data) return <div className="muted text-red-300">{error ?? "Brief unavailable"}</div>;

  const topStories = getSectionTopics(data.topics, data.brief.sections, "top-stories");
  const leadTopic = topStories[0];
  const compactTopics = topStories.slice(1);

  return (
    <div className="full">
      <HeroSection brief={data.brief} mode="full" />

      <BriefSection title="Top Stories">
        <div className="top-stories" id="top-stories">
          {leadTopic ? <LeadStory topic={leadTopic} /> : null}
          <aside className="compact-list">
            {compactTopics.map((topic) => (
              <CompactStory key={topic.id} topic={topic} />
            ))}
          </aside>
        </div>
      </BriefSection>

      <BriefSection title="Trending Discussions">
        <TrendingDiscussions topics={getSectionTopics(data.topics, data.brief.sections, "trending-discussions")} />
      </BriefSection>

      <BriefSection title="Community Picks">
        <CommunityPicks topics={getSectionTopics(data.topics, data.brief.sections, "community-picks")} />
      </BriefSection>

      <BriefSection title="Industry & Research">
        <IndustryResearch topics={getSectionTopics(data.topics, data.brief.sections, "industry-research")} />
      </BriefSection>

      <BriefSection title="New Tools">
        <NewTools topics={getSectionTopics(data.topics, data.brief.sections, "new-tools")} />
      </BriefSection>

      <BriefSection title="Curated Resources">
        <CuratedResources topics={getSectionTopics(data.topics, data.brief.sections, "curated-resources")} />
      </BriefSection>

      <BriefSection title="Open Source & Tools">
        <OpenSourceTools topics={getSectionTopics(data.topics, data.brief.sections, "open-source")} />
      </BriefSection>

      <BriefCTA
        heading={data.brief.display?.ctaHeading ?? "Stay ahead in AI"}
        body={data.brief.display?.ctaBody ?? data.brief.summary}
        input={data.brief.display?.ctaInput ?? "Enter your email"}
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
          <input type="email" placeholder={input} aria-label="Email address" />
          <button className="button" type="button">{button}</button>
        </form>
      </div>
    </section>
  );
}
