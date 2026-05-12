import type { ProcessedTopic } from "@/types";

export function IndustryResearch({ topics }: { topics: ProcessedTopic[] }) {
  const midpoint = Math.ceil(topics.length / 2);
  const columns = [topics.slice(0, midpoint), topics.slice(midpoint)];

  return (
    <div className="industry-grid">
      {columns.map((column, index) => (
        <ul key={index} className="industry-list">
          {column.map((topic) => (
            <li key={topic.id}>
              <strong>{topic.title}</strong>
              <div className="tiny-meta">{(topic.display?.meta ?? [topic.sourceIds[0], topic.publishedAt.slice(0, 10)]).join(" · ")}</div>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
