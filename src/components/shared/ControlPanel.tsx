import { type ReactNode } from "react";

type ControlPanelProps = {
  title: string;
  children: ReactNode;
};

export function ControlPanel({ title, children }: ControlPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <div className="border-b border-border px-4 py-2.5">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {title}
        </h3>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

type ControlRowProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function ControlRow({ label, hint, children }: ControlRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-secondary">{label}</label>
      </div>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
