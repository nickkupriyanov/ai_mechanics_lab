"use client";

import { useTranslations } from "next-intl";
import type { ScoredChunk } from "@/lib/simulation/retrieval";

type RetrievalPanelProps = {
  retrieved: ScoredChunk[];
  topK: number;
};

const docColors: Record<string, string> = {
  "doc-vec-db": "#3b82f6",
  "doc-embedding": "#a78bfa",
  "doc-rag": "#f59e0b",
  "doc-context": "#22c55e",
  "doc-tool-calling": "#ef4444",
};

function scoreColor(score: number): string {
  if (score >= 0.7) return "var(--color-success)";
  if (score >= 0.4) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function RetrievalPanel({ retrieved, topK }: RetrievalPanelProps) {
  const t = useTranslations("Rag.retrieval");
  const tShared = useTranslations("Shared");

  function scoreLabel(score: number): string {
    if (score >= 0.7) return t("strong");
    if (score >= 0.4) return t("moderate");
    return t("weak");
  }

  if (retrieved.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("title")}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 py-8 text-sm text-muted">
          {t("noChunks")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("topK", { k: topK })}
        </span>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {retrieved.map((chunk, i) => {
            const color = docColors[chunk.documentId] || "#63636e";
            const isNoise = !chunk.isRelevant && chunk.score > 0.25;

            return (
              <div
                key={chunk.id}
                className={`rounded-md border p-3 ${
                  isNoise
                    ? "border-danger/20 bg-danger/[0.03]"
                    : "border-border bg-surface-elevated"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted">
                    #{i + 1}
                  </span>
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[12px] font-medium text-primary truncate flex-1">
                    {chunk.documentTitle}
                  </span>
                </div>

                {/* Score bar */}
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(chunk.score * 100)}%`,
                        backgroundColor: scoreColor(chunk.score),
                      }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums" style={{ color: scoreColor(chunk.score) }}>
                    {t("score", { score: (chunk.score * 100).toFixed(0) })}
                  </span>
                  <span
                    className="shrink-0 rounded border px-1 py-0.5 text-[9px] font-mono uppercase"
                    style={{
                      borderColor: scoreColor(chunk.score),
                      color: scoreColor(chunk.score),
                    }}
                  >
                    {scoreLabel(chunk.score)}
                  </span>
                  {isNoise && (
                    <span className="shrink-0 rounded border border-danger/30 px-1 py-0.5 text-[9px] font-mono uppercase text-danger">
                      {t("noise")}
                    </span>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed text-secondary line-clamp-2">
                  {chunk.text}
                </p>
                <div className="mt-1 text-[10px] font-mono text-muted">
                  {chunk.tokens} {tShared("tokensUnit")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
