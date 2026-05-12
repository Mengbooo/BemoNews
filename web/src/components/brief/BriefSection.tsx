import type { ReactNode } from "react";

interface BriefSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkLabel?: string;
  children: ReactNode;
}

export function BriefSection({ eyebrow, title, description, linkLabel = "View all →", children }: BriefSectionProps) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          {eyebrow ? <div className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-500">{eyebrow}</div> : null}
          <h2>{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-400">{description}</p> : null}
        </div>
        <a className="section-link" href="#">{linkLabel}</a>
      </div>
      {children}
    </section>
  );
}
