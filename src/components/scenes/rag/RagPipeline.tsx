"use client";

import { useTranslations } from "next-intl";

type PipelineStage = {
  id: string;
  label: string;
  value: string;
  active: boolean;
};

type RagPipelineProps = {
  docCount: number;
  chunkCount: number;
  retrievalCount: number;
  fittingCount: number;
  excludedCount: number;
  hasAnswer: boolean;
};

export function RagPipeline({
  docCount,
  chunkCount,
  retrievalCount,
  fittingCount,
  excludedCount,
  hasAnswer,
}: RagPipelineProps) {
  const t = useTranslations("Rag.pipeline");

  const stages: PipelineStage[] = [
    { id: "docs", label: t("documents"), value: `${docCount}`, active: true },
    {
      id: "chunking",
      label: t("chunking"),
      value: t("chunks", { count: chunkCount }),
      active: chunkCount > 0,
    },
    { id: "embeddings", label: t("embeddings"), value: t("vectorized"), active: chunkCount > 0 },
    { id: "vecdb", label: t("vectorDb"), value: t("indexed"), active: chunkCount > 0 },
    {
      id: "retrieval",
      label: t("retrieval"),
      value: t("results", { count: retrievalCount }),
      active: retrievalCount > 0,
    },
    {
      id: "context",
      label: t("context"),
      value: t("fit", { fit: fittingCount, excl: excludedCount }),
      active: fittingCount > 0,
    },
    {
      id: "answer",
      label: t("answer"),
      value: hasAnswer ? t("generated") : t("pending"),
      active: hasAnswer,
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-3">
      <div className="flex items-center justify-center gap-0 overflow-x-auto">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center shrink-0">
            <div
              className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[90px] transition-colors ${
                stage.active
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-surface-hover border border-border opacity-50"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-medium uppercase tracking-wider ${
                  stage.active ? "text-accent" : "text-muted"
                }`}
              >
                {stage.label}
              </span>
              <span
                className={`mt-0.5 text-[11px] font-medium ${
                  stage.active ? "text-primary" : "text-muted"
                }`}
              >
                {stage.value}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className="mx-1 shrink-0">
                <svg
                  className={`h-3 w-4 ${stages[i + 1].active ? "text-accent/40" : "text-muted/20"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
