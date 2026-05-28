"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useMemoryStore } from "@/store/memory-store";
import {
  allMemories,
  retrieveMemories,
  buildContext,
} from "@/lib/simulation/memory";
import { MemoryList } from "./MemoryList";
import { MemoryRetrievalPanel } from "./MemoryRetrievalPanel";
import { MemoryContextPanel } from "./MemoryContextPanel";
import { MemoryControls } from "./MemoryControls";

export function MemoryScene() {
  const t = useTranslations("Memory.pipeline");
  const { activeSnippetIds, selectedQueryId, contextLimit, toggleSnippet } =
    useMemoryStore();

  const activeSet = useMemo(
    () => new Set(activeSnippetIds),
    [activeSnippetIds],
  );

  const retrieved = useMemo(
    () => retrieveMemories(allMemories, activeSet, selectedQueryId),
    [activeSet, selectedQueryId],
  );

  const ctx = useMemo(
    () => buildContext(retrieved, contextLimit),
    [retrieved, contextLimit],
  );

  const handleToggle = useCallback(
    (id: string) => toggleSnippet(id),
    [toggleSnippet],
  );

  const aboveCount = retrieved.filter((r) => r.isAboveThreshold).length;

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="rounded-lg border border-border bg-surface px-2 py-3">
        <div className="flex items-center justify-center gap-0 overflow-x-auto">
          {[
            { label: t("saved"), value: t("savedValue", { count: activeSnippetIds.length }), active: true },
            { label: t("retrieval"), value: t("retrievalValue", { count: aboveCount }), active: true },
            { label: t("context"), value: t("contextValue", { fit: ctx.fitting.length, excl: ctx.excluded.length }), active: true },
          ].map((stage, i, arr) => (
            <div key={stage.label} className="flex items-center shrink-0">
              <div
                className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[90px] transition-colors ${
                  stage.active
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-surface-hover border border-border opacity-50"
                }`}
              >
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-accent">
                  {stage.label}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-primary truncate max-w-[90px]">
                  {stage.value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <svg className="mx-1 h-3 w-4 shrink-0 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr_280px] lg:grid-cols-[1fr_1fr_320px]">
        {/* Column 1: Memory list + retrieval */}
        <div className="space-y-4 min-w-0">
          <MemoryList onToggle={handleToggle} />
          <MemoryRetrievalPanel retrieved={retrieved} />
        </div>

        {/* Column 2: Context */}
        <div className="min-w-0">
          <MemoryContextPanel
            fitting={ctx.fitting}
            excluded={ctx.excluded}
            contextLimit={contextLimit}
            tokensUsed={ctx.tokensUsed}
            hasEssentialExcluded={ctx.hasEssentialExcluded}
            queryId={selectedQueryId}
          />
        </div>

        {/* Column 3: Controls */}
        <div className="space-y-4">
          <MemoryControls />
        </div>
      </div>
    </div>
  );
}
