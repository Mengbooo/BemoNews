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

export function FullBriefPage() {
  const { date } = useParams();
  const { data, loading, error } = useBrief(date, "full");

  if (loading) return <div className="muted">Loading full brief…</div>;
  if (error || !data) return <div className="muted text-red-300">{error ?? "Brief unavailable"}</div>;

  const leadTopic = data.topics[0];
  const compactTopics = data.topics.slice(1, 6);

  return (
    <div className="space-y-10">
      <HeroSection
        brief={data.brief}
        meta={[
          `${data.brief.stats.selectedTopics} topics`,
          `${data.brief.stats.inputItems} input items`,
          `${data.brief.date}`,
        ]}
      />

      <BriefSection eyebrow="Top Stories" title="Lead story and supporting list">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          {leadTopic ? <LeadStory topic={leadTopic} /> : null}
          <div className="space-y-4">
            {compactTopics.map((topic) => (
              <CompactStory key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </BriefSection>

      <BriefSection eyebrow="Community" title="Trending Discussions">
        <TrendingDiscussions topics={data.topics.slice(0, 6)} />
      </BriefSection>

      <BriefSection eyebrow="Picks" title="Community Picks">
        <CommunityPicks topics={data.topics.slice(0, 4)} />
      </BriefSection>

      <BriefSection eyebrow="Research" title="Industry & Research">
        <IndustryResearch topics={data.topics.slice(0, 6)} />
      </BriefSection>

      <BriefSection eyebrow="Tools" title="New Tools">
        <NewTools topics={data.topics.slice(0, 4)} />
      </BriefSection>

      <BriefSection eyebrow="Resources" title="Curated Resources">
        <CuratedResources topics={data.topics.slice(0, 8)} />
      </BriefSection>

      <BriefSection eyebrow="Open Source" title="Open Source & Tools">
        <OpenSourceTools topics={data.topics.slice(0, 6)} />
      </BriefSection>
    </div>
  );
}
