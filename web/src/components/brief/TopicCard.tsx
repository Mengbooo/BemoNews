import type { ProcessedTopic } from "@/types";

export function TopicCard({ topic }: { topic: ProcessedTopic }) {
  return (
    <article className="panel h-full p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.15em] text-ink-400">
          {topic.primaryCategory}
        </span>
        <span className="text-xs uppercase tracking-[0.15em] text-ink-500">{topic.importance}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-7 text-ink-100">{topic.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-300">{topic.summary || "Summary scaffold pending topic summarizer."}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-ink-500">
        {topic.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
