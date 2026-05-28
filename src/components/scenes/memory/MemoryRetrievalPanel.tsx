"use client";

import { useTranslations, useLocale } from "next-intl";
import type { RetrievedMemory } from "@/lib/simulation/memory";
import { categoryColors } from "@/lib/simulation/memory";

const categoryRu: Record<string, string> = {
  preferences: "Предпочтения",
  skills: "Навыки",
  context: "Контекст",
  history: "История",
};

type MemoryRetrievalPanelProps = {
  retrieved: RetrievedMemory[];
};

export function MemoryRetrievalPanel({ retrieved }: MemoryRetrievalPanelProps) {
  const t = useTranslations("Memory.retrieval");
  const locale = useLocale();

  const above = retrieved.filter((r) => r.isAboveThreshold);
  const below = retrieved.filter((r) => !r.isAboveThreshold);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("aboveCount", { count: above.length })} / {t("totalCount", { count: retrieved.length })}
        </span>
      </div>
      <div className="max-h-[440px] space-y-2 overflow-y-auto p-4">
        {above.length > 0 && (
          <div className="mb-2">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-success">
              {t("aboveThreshold")}
            </span>
          </div>
        )}
        {above.map((r) => (
          <RetrievalRow key={r.memory.id} item={r} locale={locale} t={t} />
        ))}
          
        {below.length > 0 && (
          <>
            <div className="mt-4 mb-2 border-t border-border pt-3">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
                {t("belowThreshold")} ({below.length})
              </span>
            </div>
            {below.map((r) => (
              <RetrievalRow key={r.memory.id} item={r} locale={locale} dimmed t={t} />
            ))}
          </>
        )}

        {retrieved.length === 0 && (
          <p className="py-4 text-center text-[12px] text-muted">
            {t("noMemories")}
          </p>
        )}
      </div>
    </div>
  );
}

function RetrievalRow({
  item,
  locale,
  dimmed,
  t,
}: {
  item: RetrievedMemory;
  locale: string;
  dimmed?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const content = locale === "ru" ? item.memory.contentRu : item.memory.content;
  const category = locale === "ru" ? categoryRu[item.memory.category] ?? item.memory.category : item.memory.category;
  const reason = locale === "ru" ? item.reasonRu : item.reason;

  const scorePercent = Math.round(item.queryScore * 100);
  const scoreColor =
    scorePercent >= 70 ? "bg-success" : scorePercent >= 40 ? "bg-warning" : "bg-muted";

  return (
    <div
      className={`rounded-lg border px-3 py-2 transition-colors ${
        dimmed
          ? "border-border bg-surface opacity-50"
          : item.memory.isStale
            ? "border-warning/20 bg-warning/[0.03] border-l-2 border-l-warning/60"
            : "border-border bg-surface-elevated"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex shrink-0 flex-col items-center gap-0.5 pt-0.5">
          <span
            className={`text-[10px] font-mono font-bold ${
              dimmed ? "text-muted" : scorePercent >= 70 ? "text-success" : scorePercent >= 40 ? "text-warning" : "text-muted"
            }`}
          >
            {scorePercent}%
          </span>
          <div className={`h-8 w-1.5 rounded-full ${dimmed ? "bg-border" : scoreColor}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="rounded px-1 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${categoryColors[item.memory.category]}18`,
                color: categoryColors[item.memory.category],
              }}
            >
              {category}
            </span>
            {item.memory.isStale && (
              <span className="rounded bg-warning/15 px-1 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-warning">
                {t("stale")}
              </span>
            )}
            {!item.isAboveThreshold && (
              <span className="rounded bg-muted/10 px-1 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-muted">
                {t("excludedBadge")}
              </span>
            )}
            {dimmed && (
              <span className="ml-auto shrink-0 text-[10px] text-muted italic">
                {t("skipped")}
              </span>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-primary">{content}</p>

          {!dimmed && (
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
