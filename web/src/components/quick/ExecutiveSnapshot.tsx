import type { ProcessedTopic } from "@/types";

const labels = ["Thesis", "Market", "Watch", "Action"];

export function ExecutiveSnapshot({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {labels.map((label, index) => {
        const topic = topics[index];
        return (
          <div key={label} className="panel p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-500">{label}</div>
            <div className="mt-4 text-lg font-semibold text-ink-100">{topic?.title ?? `${label} placeholder`}</div>
            <p className="mt-3 text-sm leading-6 text-ink-400">
              {topic?.summary ?? "This slot is ready for brief shaping once the quick brief builder is refined."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
