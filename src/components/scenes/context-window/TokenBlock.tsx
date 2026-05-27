"use client";

import { useTranslations } from "next-intl";
import type { ContextBlock } from "@/lib/simulation/context-window";
import { blockColors } from "@/lib/simulation/context-window";

type TokenBlockProps = {
  block: ContextBlock;
  excluded?: boolean;
};

export function TokenBlock({ block, excluded }: TokenBlockProps) {
  const t = useTranslations("ContextWindow");
  const color = blockColors[block.type];
  const isEssential = block.essential;
  const isSummarized = block.id === "history-summary";
  const label = isSummarized ? t("summarized") : block.label;

  return (
    <div
      className={`rounded-md border p-3 transition-colors ${
        excluded
          ? "border-danger/20 bg-danger/[0.02] opacity-50"
          : isEssential
            ? "border-accent/15 bg-accent/[0.03]"
            : "border-border bg-surface-elevated"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className={`text-[12px] font-medium truncate ${excluded ? "text-muted" : "text-primary"}`}>
          {label}
        </span>
        <span className={`shrink-0 font-mono text-[10px] tabular-nums ${excluded ? "text-muted/60" : "text-muted"}`}>
          {block.tokens}t
        </span>
        {isEssential && !excluded && (
          <span className="shrink-0 rounded border border-accent/30 px-1 py-0.5 text-[9px] font-mono text-accent">
            {t("essential")}
          </span>
        )}
        {isEssential && excluded && (
          <span className="shrink-0 rounded border border-danger/30 px-1 py-0.5 text-[9px] font-mono text-danger">
            {t("lost")}
          </span>
        )}
        {excluded && !isEssential && (
          <span className="shrink-0 rounded border border-warning/30 px-1 py-0.5 text-[9px] font-mono text-warning/70">
            {t("excludedBadge")}
          </span>
        )}
      </div>
      <p className={`text-[11px] leading-relaxed line-clamp-3 ${excluded ? "text-muted/50" : "text-secondary"}`}>
        {block.content}
      </p>
    </div>
  );
}
