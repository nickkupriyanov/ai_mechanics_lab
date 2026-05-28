"use client";

import { useTranslations, useLocale } from "next-intl";
import { allQueries } from "@/lib/simulation/memory";
import type { RetrievedMemory } from "@/lib/simulation/memory";
import { estimateTokens } from "@/lib/simulation/memory";

type MemoryContextPanelProps = {
  fitting: RetrievedMemory[];
  excluded: RetrievedMemory[];
  contextLimit: number;
  tokensUsed: number;
  hasEssentialExcluded: boolean;
  queryId: string;
};

export function MemoryContextPanel({
  fitting,
  excluded,
  contextLimit,
  tokensUsed,
  hasEssentialExcluded,
  queryId,
}: MemoryContextPanelProps) {
  const t = useTranslations("Memory.context");
  const tShared = useTranslations("Shared");
  const locale = useLocale();

  const freeSpace = Math.max(0, contextLimit - tokensUsed);
  const query = allQueries.find((q) => q.id === queryId);
  const queryText = locale === "ru" ? query?.queryRu ?? "" : query?.query ?? "";

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("tokensLabel", { used: tokensUsed, limit: contextLimit })}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Token meter */}
        <div className="space-y-1">
          <div className="h-3 w-full rounded-full bg-border overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${
                tokensUsed > contextLimit
                  ? "bg-danger"
                  : tokensUsed > contextLimit * 0.85
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${Math.min(100, Math.round((tokensUsed / contextLimit) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-success">{t("used", { tokens: tokensUsed })}</span>
            <span className="text-muted">{t("free", { tokens: freeSpace })}</span>
          </div>
        </div>

        {/* Fitting blocks */}
        {fitting.length > 0 ? (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-success">
              {t("inContext", { count: fitting.length })}
            </span>
            {fitting.map((r) => {
              const content = locale === "ru" ? r.memory.contentRu : r.memory.content;
              const tokens = estimateTokens(r.memory.content);
              return (
                <div
                  key={r.memory.id}
                  className="rounded-md border border-border bg-surface-elevated px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] leading-relaxed text-primary">{content}</span>
                    <span className="shrink-0 text-[10px] font-mono text-muted">
                      ~{tokens} tok.
                    </span>
                  </div>
                  {r.memory.isStale && (
                    <span className="mt-1 inline-block rounded bg-warning/15 px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-warning">
                      {t("stale")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-2 text-center text-[12px] text-muted">{t("noMemories")}</p>
        )}

        {/* Excluded */}
        {excluded.length > 0 && (
          <div className="border-t border-border pt-3 space-y-1.5">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-danger">
              {t("excluded", { count: excluded.length })}
            </span>
            {excluded.map((r) => {
              const content = locale === "ru" ? r.memory.contentRu : r.memory.content;
              const tokens = estimateTokens(r.memory.content);
              return (
                <div
                  key={r.memory.id}
                  className="rounded-md border border-dashed border-danger/20 bg-danger/[0.02] px-3 py-2 opacity-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] leading-relaxed text-secondary line-through">
                      {content}
                    </span>
                    <span className="shrink-0 text-[10px] font-mono text-danger/60">
                      ~{tokens} tok.
                    </span>
                  </div>
                </div>
              );
            })}

            {hasEssentialExcluded && (
              <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 mt-2">
                <p className="text-[11px] font-medium text-danger">
                  {t("overflowWarning")}
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-danger/70">
                  {t("overflowWarningDesc")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Prompt preview */}
        {fitting.length > 0 && (
          <div className="border-t border-border pt-3">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
              {t("promptPreview")}
            </span>
            <div className="mt-2 max-h-[220px] overflow-y-auto rounded-md border border-border bg-surface-elevated p-3">
              <pre className="whitespace-pre-wrap break-words text-[10px] leading-relaxed text-secondary font-mono">
                <span className="text-muted">{tShared("systemLabel")}</span>
                {"\n"}{t("systemPrompt")}
                {"\n\n"}
                <span className="text-muted">{t("memoryLabel", { count: fitting.length })}</span>
                {"\n"}
                {fitting.map((r) => {
                  const content = locale === "ru" ? r.memory.contentRu : r.memory.content;
                  return `${r.memory.isStale ? `${t("stalePrefix")} ` : ""}- ${content}\n`;
                }).join("")}
                {"\n"}
                <span className="text-muted">{tShared("userLabel")}</span>
                {"\n"}{queryText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
