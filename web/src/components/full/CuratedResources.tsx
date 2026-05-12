import { TopicCard } from "@/components/brief/TopicCard";
import type { ProcessedTopic } from "@/types";

export function CuratedResources({ topics }: { topics: ProcessedTopic[] }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}</div>;
}
