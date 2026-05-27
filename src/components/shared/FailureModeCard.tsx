import type { FailureMode } from "@/types/scenes";

type FailureModeCardProps = {
  mode: FailureMode;
  active?: boolean;
};

export function FailureModeCard({ mode, active }: FailureModeCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        active
          ? "border-danger/40 bg-danger/5"
          : "border-border bg-surface hover:border-danger/20"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-sm">⚠</span>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-primary">{mode.title}</h4>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            {mode.description}
          </p>
          {active && mode.explanation && (
            <p className="mt-2 text-[12px] leading-relaxed text-danger/80">
              {mode.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
