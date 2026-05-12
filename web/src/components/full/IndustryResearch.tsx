import { CompactStory } from "@/components/brief/CompactStory";
import type { ProcessedTopic } from "@/types";

export function IndustryResearch({ topics }: { topics: ProcessedTopic[] }) {
  return <div className="grid gap-4 lg:grid-cols-2">{topics.map((topic) => <CompactStory key={topic.id} topic={topic} />)}</div>;
}
