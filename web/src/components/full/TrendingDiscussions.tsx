import { TopicCard } from "@/components/brief/TopicCard";
import type { ProcessedTopic } from "@/types";

export function TrendingDiscussions({ topics }: { topics: ProcessedTopic[] }) {
  return <div className="grid gap-4 lg:grid-cols-3">{topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}</div>;
}
