import type { ProcessedTopic } from "@/types";

export function LeadStory({ topic }: { topic: ProcessedTopic }) {
  const pills = topic.display?.pills ?? ["Breaking", topic.primaryCategory, topic.importance];
  const points = topic.display?.points ?? [];
  const meta = topic.display?.meta ?? [new Date(topic.publishedAt).toLocaleDateString(), `${topic.richnessScore.toFixed(1)} richness`];

  return (
    <article className="card lead-story">
      <div className="card-pad">
        <div className="kicker-row">
          {pills.map((pill, index) => (
            <span key={pill} className={["pill", index === 0 ? "breaking" : ""].join(" ")}>{pill}</span>
          ))}
        </div>
        <div className="lead-layout">
          <div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
            {points.length ? (
              <div className="lead-points">
                {points.map((point) => (
                  <div key={point} className="lead-point">{point}</div>
                ))}
              </div>
            ) : null}
            <div className={points.length ? "lead-foot" : "meta-line"}>
              {(points.length ? topic.display?.footer ?? meta : meta).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="lead-visual" />
        </div>
      </div>
    </article>
  );
}
