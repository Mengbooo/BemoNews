import type { ProcessedTopic } from "@/types";

export function NewTools({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="tools-grid">
      {topics.map((topic) => (
        <article key={topic.id} className="tool-card">
          <div className="content">
            <div className="tool-icon">{topic.display?.icon ?? topic.title.slice(0, 1)}</div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
            <div className="tool-tags">
              {(topic.display?.pills ?? topic.tags.slice(0, 2)).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
