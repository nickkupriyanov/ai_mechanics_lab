"use client";

import { useTranslations } from "next-intl";
import { useEmbeddingsStore } from "@/store/embeddings-store";
import { ControlPanel } from "@/components/shared/ControlPanel";

export function EmbeddingsControls() {
  const t = useTranslations("Embeddings");
  const tShared = useTranslations("Shared");
  const viewMode = useEmbeddingsStore((s) => s.viewMode);
  const setViewMode = useEmbeddingsStore((s) => s.setViewMode);
  const clearSelection = useEmbeddingsStore((s) => s.clearSelection);

  return (
    <div className="space-y-4">
      <ControlPanel title={tShared("similarityMode")}>
        <div className="space-y-2">
          <button
            onClick={() => setViewMode("semantic")}
            className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
              viewMode === "semantic"
                ? "border-accent/40 bg-accent/10"
                : "border-border bg-surface hover:border-border-hover"
            }`}
          >
            <span
              className={`text-[12px] font-medium ${
                viewMode === "semantic" ? "text-accent" : "text-secondary"
              }`}
            >
              {t("semanticSimilarity")}
            </span>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
              {t("semanticDesc")}
            </p>
          </button>
          <button
            onClick={() => setViewMode("keyword")}
            className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
              viewMode === "keyword"
                ? "border-accent/40 bg-accent/10"
                : "border-border bg-surface hover:border-border-hover"
            }`}
          >
            <span
              className={`text-[12px] font-medium ${
                viewMode === "keyword" ? "text-accent" : "text-secondary"
              }`}
            >
              {t("keywordSimilarity")}
            </span>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
              {t("keywordDesc")}
            </p>
          </button>
        </div>
      </ControlPanel>

      <button
        onClick={clearSelection}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[12px] text-muted transition-colors hover:border-border-hover hover:text-primary"
      >
        {tShared("clearSelection")}
      </button>
    </div>
  );
}
