import type { ProcessedTopic } from "@/types";

export function WatchlistActions({ topics }: { topics: ProcessedTopic[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-5">
        <div className="text-sm font-medium text-ink-300">Watchlist</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {topics.slice(0, 4).map((topic) => (
            <div key={topic.id} className="rounded-md border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium text-ink-100">{topic.title}</div>
              <div className="mt-2 text-sm text-ink-400">{topic.summary || "Watch signal placeholder."}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel p-5">
        <div className="text-sm font-medium text-ink-300">Next Actions</div>
        <div className="mt-4 space-y-3">
          {topics.slice(0, 4).map((topic) => (
            <div key={topic.id} className="rounded-md border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium text-ink-100">{topic.title}</div>
              <div className="mt-2 text-sm text-ink-400">{topic.summary || "Action suggestion placeholder."}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
