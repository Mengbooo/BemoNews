import type { ProcessedTopic } from "@/types";

const columns = ["What changed", "Why it matters", "What to do"];

export function DecisionSignals({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="decision-grid">
      {columns.map((label, index) => {
        const topic = topics[index];
        const points = topic?.display?.points ?? [];
        return (
          <div key={label} className="card signal-card">
            <div className="card-pad">
              <div className="signal-label">{label}</div>
              <h3>{topic?.title ?? label}</h3>
              <p>{topic?.summary ?? ""}</p>
              {points.length ? (
                <ul>
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
