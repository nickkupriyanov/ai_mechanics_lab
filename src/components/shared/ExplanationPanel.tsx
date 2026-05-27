import { type ReactNode } from "react";

type ExplanationPanelProps = {
  children: ReactNode;
};

export function ExplanationPanel({ children }: ExplanationPanelProps) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-secondary">{children}</div>
  );
}

type ExplanationSectionProps = {
  title: string;
  children: ReactNode;
};

export function ExplanationSection({ title, children }: ExplanationSectionProps) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-mono font-medium uppercase tracking-wider text-accent">
        {title}
      </h3>
      <div className="space-y-2 text-secondary">{children}</div>
    </section>
  );
}
