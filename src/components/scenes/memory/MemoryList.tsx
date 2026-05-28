"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemoryStore } from "@/store/memory-store";
import { allMemories, categoryColors } from "@/lib/simulation/memory";
import type { MemorySnippet } from "@/lib/simulation/memory";

type MemoryListProps = {
  onToggle?: (id: string) => void;
};

const categoryRu: Record<string, string> = {
  preferences: "Предпочтения",
  skills: "Навыки",
  context: "Контекст",
  history: "История",
};

export function MemoryList({ onToggle }: MemoryListProps) {
  const t = useTranslations("Memory.list");
  const locale = useLocale();
  const { activeSnippetIds, deleteSnippet } = useMemoryStore();
  const activeSet = new Set(activeSnippetIds);

  const handleDelete = (id: string) => {
    deleteSnippet(id);
  };

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: allMemories.length })}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("activeCount", { count: activeSnippetIds.length })}
        </span>
      </div>
      <div className="max-h-[520px] space-y-2 overflow-y-auto p-4">
        {allMemories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            isActive={activeSet.has(memory.id)}
            locale={locale}
            onToggle={() => onToggle?.(memory.id)}
            onDelete={() => handleDelete(memory.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MemoryCard({
  memory,
  isActive,
  locale,
  onToggle,
  onDelete,
}: {
  memory: MemorySnippet;
  isActive: boolean;
  locale: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const tCard = useTranslations("Memory.list");
  const content = locale === "ru" ? memory.contentRu : memory.content;
  const timestamp = locale === "ru" ? memory.timestampRu : memory.timestamp;
  const category = locale === "ru" ? categoryRu[memory.category] ?? memory.category : memory.category;

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 transition-colors ${
        isActive
          ? "border-accent/30 bg-accent/[0.04]"
          : "border-border bg-surface opacity-50"
      } ${memory.isStale ? "border-l-2 border-l-warning/60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="rounded px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${categoryColors[memory.category]}18`,
                color: categoryColors[memory.category],
              }}
            >
              {category}
            </span>
            {memory.isStale && (
              <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-warning">
                {tCard("stale")}
              </span>
            )}
            <span className="ml-auto shrink-0 text-[10px] text-muted">{timestamp}</span>
          </div>

          <p
            className="text-[12px] leading-relaxed text-primary cursor-pointer"
            onClick={onToggle}
          >
            {content}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-border">
              <div
                className={`h-1 rounded-full transition-all ${
                  memory.relevanceScore >= 0.7
                    ? "bg-success"
                    : memory.relevanceScore >= 0.4
                      ? "bg-warning"
                      : "bg-muted"
                }`}
                style={{ width: `${Math.round(memory.relevanceScore * 100)}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] font-mono text-muted">
              {Math.round(memory.relevanceScore * 100)}%
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          title="Delete"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
