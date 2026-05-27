"use client";

import { useTranslations } from "next-intl";
import type { Tool } from "@/lib/simulation/tool-calling";

type ToolListProps = {
  tools: Tool[];
  selectedToolId: string | null;
  scoreMap: Map<string, number>;
  useBadDescriptions: boolean;
};

export function ToolList({ tools, selectedToolId, scoreMap, useBadDescriptions }: ToolListProps) {
  const t = useTranslations("ToolCalling.tools");

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: tools.length })}
        </span>
        {useBadDescriptions && (
          <span className="rounded border border-warning/30 px-1.5 py-0.5 text-[9px] font-mono text-warning">
            {t("vagueDescriptions")}
          </span>
        )}
      </div>
      <div className="max-h-[360px] overflow-y-auto p-4">
        <div className="space-y-2">
          {tools.map((tool) => {
            const isSelected = tool.id === selectedToolId;
            const score = scoreMap.get(tool.id) ?? 0;
            const maxScore = Math.max(...scoreMap.values(), 1);
            const scorePct = (score / maxScore) * 100;

            return (
              <div
                key={tool.id}
                className={`rounded-md border p-3 transition-colors ${
                  isSelected
                    ? "border-accent/40 bg-accent/10"
                    : "border-border bg-surface-elevated hover:border-border-hover"
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[13px] font-medium text-primary">
                    {tool.name}
                  </span>
                  {tool.isDestructive && (
                    <span className="shrink-0 rounded border border-danger/30 px-1 py-0.5 text-[9px] font-mono text-danger">
                      {t("destructive")}
                    </span>
                  )}
                  {isSelected && (
                    <span className="shrink-0 rounded border border-accent/30 px-1 py-0.5 text-[9px] font-mono text-accent">
                      {t("selected")}
                    </span>
                  )}
                </div>

                {/* Score bar */}
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? "bg-accent" : "bg-muted/40"
                      }`}
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted">
                    {score.toFixed(1)}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-secondary line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {tool.parameters.map((p) => (
                    <span
                      key={p.name}
                      className="rounded border border-border px-1.5 py-0.5 text-[9px] font-mono text-muted"
                    >
                      {p.name}
                      {p.required ? "*" : ""}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
