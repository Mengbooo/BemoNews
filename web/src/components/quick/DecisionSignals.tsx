import type { ProcessedTopic } from "@/types";

const columns = ["What Changed", "Why It Matters", "What To Do"];

export function DecisionSignals({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((label, index) => {
        const topic = topics[index];
        return (
          <div key={label} className="panel p-5">
            <div className="text-sm font-medium text-ink-300">{label}</div>
            <div className="mt-4 text-lg font-semibold text-ink-100">{topic?.title ?? "Signal placeholder"}</div>
            <p className="mt-3 text-sm leading-6 text-ink-400">
              {topic?.summary ?? "The quick brief scaffold is ready to map topic summaries into decision-oriented copy."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
