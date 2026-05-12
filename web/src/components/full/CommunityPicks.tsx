import type { ProcessedTopic } from "@/types";

export function CommunityPicks({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="media-grid">
      {topics.map((topic) => (
        <article key={topic.id} className="media-card">
          <div className="media-thumb" />
          <div className="content">
            <div className="media-meta">{(topic.display?.meta ?? [topic.primaryCategory]).join(" · ")}</div>
            <h3>{topic.title}</h3>
            <p>{topic.display?.footer?.[0] ?? topic.sourceIds[0]}</p>
            <div className="tiny-meta">{topic.display?.footer?.[1] ?? topic.publishedAt.slice(0, 10)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
