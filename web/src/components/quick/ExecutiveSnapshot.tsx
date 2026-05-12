import type { ProcessedTopic } from "@/types";

const labels = ["Thesis", "Market", "Watch", "Action"];

export function ExecutiveSnapshot({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="snapshot-grid">
      {labels.map((label, index) => {
        const topic = topics[index];
        return (
          <div key={label} className="card snapshot-card">
            <div className="card-pad">
              <div className="kicker-row">
                <span className="pill">{topic?.display?.label ?? label}</span>
              </div>
              <h3>{topic?.title ?? label}</h3>
              <p>{topic?.summary ?? ""}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
