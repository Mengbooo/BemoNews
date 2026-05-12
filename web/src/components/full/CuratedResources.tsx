import type { ProcessedTopic } from "@/types";

export function CuratedResources({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="resources-grid">
      {topics.map((topic) => (
        <article key={topic.id} className="resource-card">
          <div className="content">
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
            <div className="resource-row">
              <span>{topic.display?.footer?.[0] ?? topic.tags[0]}</span>
              <span>→</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
