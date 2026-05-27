"use client";

import { useTranslations } from "next-intl";
import type { ScoredChunk } from "@/lib/simulation/retrieval";

type ContextPanelProps = {
  fittingChunks: ScoredChunk[];
  excludedChunks: ScoredChunk[];
  tokensUsed: number;
  contextLimit: number;
};

const docColors: Record<string, string> = {
  "doc-vec-db": "#3b82f6",
  "doc-embedding": "#a78bfa",
  "doc-rag": "#f59e0b",
  "doc-context": "#22c55e",
  "doc-tool-calling": "#ef4444",
};

export function ContextPanel({
  fittingChunks,
  excludedChunks,
  tokensUsed,
  contextLimit,
}: ContextPanelProps) {
  const t = useTranslations("Rag.context");
  const tShared = useTranslations("Shared");
  const usagePct = Math.min(100, Math.round((tokensUsed / contextLimit) * 100));

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {tokensUsed} / {contextLimit} {tShared("tokensUnit")}
        </span>
      </div>

      {/* Usage meter */}
      <div className="border-b border-border px-4 py-2.5">
        <div className="mb-1.5 h-2.5 overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${usagePct}%`,
              backgroundColor:
                usagePct > 90
                  ? "var(--color-danger)"
                  : usagePct > 70
                    ? "var(--color-warning)"
                    : "var(--color-success)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-muted">{t("used", { used: tokensUsed })}</span>
          <span className="text-muted">{t("free", { free: contextLimit - tokensUsed })}</span>
        </div>
      </div>

      <div className="p-4">
        {fittingChunks.length > 0 ? (
          <>
            <h4 className="mb-2 text-[11px] font-mono font-medium uppercase tracking-wider text-success/80">
              {t("inContext", { count: fittingChunks.length })}
            </h4>
            <div className="space-y-2">
              {fittingChunks.map((chunk) => {
                const color = docColors[chunk.documentId] || "#63636e";
                return (
                  <div
                    key={chunk.id}
                    className="rounded-md border border-border bg-surface-elevated p-2.5"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] font-medium text-primary truncate">
                        {chunk.documentTitle} #{chunk.index}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-muted">
                        {chunk.tokens}t
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-secondary line-clamp-2">
                      {chunk.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-4 text-center text-sm text-muted">
            {t("noFit")}
          </div>
        )}

        {excludedChunks.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-[11px] font-mono font-medium uppercase tracking-wider text-danger/80">
              {t("excluded", { count: excludedChunks.length })}
            </h4>
            <div className="space-y-2">
              {excludedChunks.map((chunk) => {
                const color = docColors[chunk.documentId] || "#63636e";
                return (
                  <div
                    key={chunk.id}
                    className="rounded-md border border-danger/15 bg-danger/[0.02] p-2.5"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] font-medium text-primary truncate">
                        {chunk.documentTitle} #{chunk.index}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-muted">
                        {chunk.tokens}t
                      </span>
                      {chunk.isRelevant && (
                        <span className="shrink-0 rounded border border-danger/30 px-1 py-0.5 text-[9px] font-mono text-danger">
                          {t("relevant")}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted line-clamp-1">
                      {chunk.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
