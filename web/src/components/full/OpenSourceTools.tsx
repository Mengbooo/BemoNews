import type { ProcessedTopic } from "@/types";

export function OpenSourceTools({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="oss-grid">
      {topics.map((topic) => (
        <article key={topic.id} className="oss-item">
          <div className="oss-icon">{topic.display?.icon ?? topic.title.slice(0, 1)}</div>
          <div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
