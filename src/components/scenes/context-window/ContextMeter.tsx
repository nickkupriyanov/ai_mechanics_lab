"use client";

import { useTranslations } from "next-intl";
import type { ContextBlock, BlockType } from "@/lib/simulation/context-window";
import { blockColors } from "@/lib/simulation/context-window";

const legendKeys: Record<BlockType, string> = {
  system: "system",
  history: "history",
  retrieved: "retrieved",
  tools: "tools",
  memory: "memory",
  query: "query",
  noise: "noise",
};

type ContextMeterProps = {
  fittingBlocks: ContextBlock[];
  excludedBlocks: ContextBlock[];
  tokensUsed: number;
  contextSize: number;
  hasEssentialExcluded: boolean;
};

export function ContextMeter({
  fittingBlocks,
  excludedBlocks,
  tokensUsed,
  contextSize,
  hasEssentialExcluded,
}: ContextMeterProps) {
  const t = useTranslations("ContextWindow");
  const totalTokens = tokensUsed + excludedBlocks.reduce((s, b) => s + b.tokens, 0);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("contextMeter")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("tokensUsed", { used: tokensUsed, total: contextSize })}
        </span>
      </div>

      {/* Main bar */}
      <div className="px-4 py-3">
        <div className="mb-2 h-3 overflow-hidden rounded-full bg-surface-hover">
          {/* Segments */}
          <div className="flex h-full" style={{ width: `${Math.min(100, (totalTokens / contextSize) * 100)}%` }}>
            {fittingBlocks.map((block) => {
              const pct = (block.tokens / contextSize) * 100;
              return (
                <div
                  key={block.id}
                  className="h-full shrink-0 transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: blockColors[block.type],
                  }}
                  title={`${block.label}: ${block.tokens} ${t("tokensUnit")}`}
                />
              );
            })}
            {excludedBlocks.map((block) => {
              const pct = (block.tokens / contextSize) * 100;
              return (
                <div
                  key={block.id}
                  className="h-full shrink-0"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: blockColors[block.type],
                    opacity: 0.2,
                    borderLeft: "2px dashed var(--color-danger)",
                  }}
                  title={`${block.label} (${t("excludedBadge").toLowerCase()}): ${block.tokens} ${t("tokensUnit")}`}
                />
              );
            })}
          </div>
        </div>

        {/* Usage summary */}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-muted">
            {fittingBlocks.length} {t("legendBlocksInContext")}
          </span>
          {hasEssentialExcluded && (
            <span className="text-danger font-medium">
              {t("essentialExcluded")}
            </span>
          )}
          {excludedBlocks.length > 0 && !hasEssentialExcluded && (
            <span className="text-warning">
              {t("excludedSummary", { count: excludedBlocks.length })}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-4 py-2">
        {(Object.keys(blockColors) as BlockType[]).map((type) => (
          <div key={type} className="flex items-center gap-1">
            <span
              className="h-1.5 w-3 rounded-sm"
              style={{ backgroundColor: blockColors[type] }}
            />
            <span className="text-[9px] font-mono text-muted">
              {t(`legend.${legendKeys[type]}`)}
            </span>
          </div>
        ))}
        <span className="text-[9px] text-muted/50">— {t("legend.dashed")}</span>
      </div>
    </div>
  );
}
