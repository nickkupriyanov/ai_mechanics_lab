"use client";

import { useTranslations } from "next-intl";

type EvaluationPipelineProps = {
  totalTests: number;
  passedTests: number;
  passRate: number;
};

export function EvaluationPipeline({
  totalTests,
  passedTests,
  passRate,
}: EvaluationPipelineProps) {
  const t = useTranslations("Evaluation.pipeline");

  const colorClass =
    passRate > 80
      ? "border-success/30 bg-success/10 text-success"
      : passRate > 50
        ? "border-warning/30 bg-warning/10 text-warning"
        : "border-danger/30 bg-danger/10 text-danger";

  const stages = [
    {
      label: t("testCases"),
      value: t("testCasesValue", { count: totalTests }),
    },
    { label: t("model"), value: t("responses") },
    { label: t("evaluator"), value: t("scored") },
    {
      label: t("result"),
      value: t("resultValue", { passed: passedTests, total: totalTests }),
      color: colorClass,
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-3">
      <div className="flex items-center justify-center gap-0 overflow-x-auto">
        {stages.map((stage, i, arr) => (
          <div key={stage.label} className="flex items-center shrink-0">
            <div
              className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[90px] transition-colors ${stage.color ?? "bg-accent/10 border border-accent/30"}`}
            >
              <span
                className={`text-[10px] font-mono font-medium uppercase tracking-wider ${stage.color ? "" : "text-accent"}`}
              >
                {stage.label}
              </span>
              {stage.value && (
                <span
                  className={`mt-0.5 text-[10px] font-medium truncate max-w-[110px] text-primary`}
                >
                  {stage.value}
                </span>
              )}
            </div>
            {i < arr.length - 1 && (
              <svg
                className="mx-1 h-3 w-4 shrink-0 text-accent/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
