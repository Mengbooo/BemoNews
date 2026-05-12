import type { ProcessedTopic } from "@/types";

export function LeadStory({ topic }: { topic: ProcessedTopic }) {
  return (
    <article className="panel p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="eyebrow">Lead Story</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-ink-500">
          {topic.importance}
        </span>
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink-100">{topic.title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-ink-300">
        {topic.summary || "This lead topic is ready for richer editorial shaping once the summarizer and section mapper are implemented."}
      </p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-500">
        {topic.sourceIds.map((sourceID) => (
          <span key={sourceID} className="rounded-full border border-white/10 px-3 py-1">
            {sourceID}
          </span>
        ))}
      </div>
    </article>
  );
}
