import type { ReactNode } from "react";

interface BriefSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function BriefSection({ eyebrow, title, description, children }: BriefSectionProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-100">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm text-ink-400">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
