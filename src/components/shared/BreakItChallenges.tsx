"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export type Challenge = {
  id: string;
  text: string;
  presetId?: string;
};

type BreakItChallengesProps = {
  challenges: Challenge[];
  onApplyPreset?: (presetId: string) => void;
  sectionTitle?: string;
};

export function BreakItChallenges({
  challenges,
  onApplyPreset,
  sectionTitle,
}: BreakItChallengesProps) {
  const t = useTranslations("BreakIt");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (challenges.length === 0) return null;

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-lg border border-warning/20 bg-surface-elevated p-5">
      <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-warning">
        {sectionTitle ?? t("sectionTitle")}
      </h2>
      <div className="space-y-2">
        {challenges.map((challenge) => {
          const isDone = completed.has(challenge.id);
          return (
            <div key={challenge.id} className="flex items-start gap-3">
              <button
                onClick={() => toggle(challenge.id)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] transition-colors ${
                  isDone
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-border bg-surface text-muted hover:border-warning/40"
                }`}
              >
                {isDone ? "✓" : ""}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] leading-relaxed cursor-pointer ${
                    isDone ? "text-muted line-through" : "text-secondary"
                  }`}
                  onClick={() => toggle(challenge.id)}
                >
                  {challenge.text}
                </p>
              </div>
              {challenge.presetId && onApplyPreset && !isDone && (
                <button
                  onClick={() => onApplyPreset(challenge.presetId!)}
                  className="shrink-0 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-mono text-muted transition-colors hover:border-warning/30 hover:text-warning"
                >
                  {t("tryIt")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
