import type { ProcessedTopic } from "@/types";

export function TopicCard({ topic }: { topic: ProcessedTopic }) {
  return (
    <article className="discussion-card">
      <div className="discussion-head">{(topic.display?.meta ?? [topic.primaryCategory]).join(" · ")}</div>
      <h3>{topic.title}</h3>
      <p>{topic.summary}</p>
      <div className="discussion-footer">
        {(topic.display?.footer ?? topic.tags.slice(0, 2)).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}
