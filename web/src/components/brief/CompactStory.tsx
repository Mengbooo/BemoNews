import type { ProcessedTopic } from "@/types";

export function CompactStory({ topic }: { topic: ProcessedTopic }) {
  return (
    <article className="compact-story">
      <div className="compact-mark">{topic.display?.icon ?? topic.title.slice(0, 1)}</div>
      <div>
        <strong>{topic.title}</strong>
        <p>{topic.summary}</p>
        <div className="compact-meta">{(topic.display?.meta ?? [topic.primaryCategory, topic.importance]).join(" · ")}</div>
      </div>
    </article>
  );
}
