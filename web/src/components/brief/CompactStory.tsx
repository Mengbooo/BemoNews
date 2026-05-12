import type { ProcessedTopic } from "@/types";

export function CompactStory({ topic }: { topic: ProcessedTopic }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.15em] text-ink-500">{topic.primaryCategory}</div>
      <h3 className="mt-2 text-base font-medium text-ink-100">{topic.title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-400">{topic.summary || "Scaffold placeholder summary."}</p>
    </article>
  );
}
