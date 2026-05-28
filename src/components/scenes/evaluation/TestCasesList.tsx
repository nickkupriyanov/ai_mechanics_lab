"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { EvalResult, TestCase } from "@/lib/simulation/evaluation";

type TestCasesListProps = {
  testCases: TestCase[];
  results: EvalResult[];
  showRegressions: boolean;
};

const categoryColors: Record<TestCase["category"], string> = {
  accuracy: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  safety: "border-green-500/40 bg-green-500/10 text-green-400",
  completeness: "border-purple-500/40 bg-purple-500/10 text-purple-400",
  tone: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

export function TestCasesList({
  testCases,
  results,
  showRegressions,
}: TestCasesListProps) {
  const t = useTranslations("Evaluation.testCases");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isRegression = (r: EvalResult): boolean => {
    return (
      r.previousScore !== undefined &&
      r.score < r.previousScore - 15
    );
  };

  const displayedCases = testCases
    .map((tc) => {
      const result = results.find((r) => r.testCaseId === tc.id);
      return { tc, result };
    })
    .filter(({ result }) => {
      if (!result) return true;
      if (!showRegressions) return true;
      return !result.passed || isRegression(result);
    });

  return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: testCases.length })}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            {results.filter((r) => r.passed).length} {t("passed")}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" />
            {results.filter((r) => !r.passed).length} {t("failed")}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
        {displayedCases.map(({ tc, result }) => {
          const isExpanded = expandedId === tc.id;
          const reg = result ? isRegression(result) : false;

          return (
            <div key={tc.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : tc.id)}
                className="w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Score bar */}
                  {result && (
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`text-[10px] font-mono font-bold w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          reg
                            ? "border-danger text-danger bg-danger/10"
                            : result.passed
                              ? "border-success text-success bg-success/10"
                              : "border-danger text-danger bg-danger/10"
                        }`}
                      >
                        {result.score}
                      </div>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Category badge + Pass/Fail */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider ${categoryColors[tc.category]}`}
                      >
                        {tc.category}
                      </span>
                      {result && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                            reg
                              ? "border-danger/40 bg-danger/10 text-danger"
                              : result.passed
                                ? "border-success/40 bg-success/10 text-success"
                                : "border-danger/40 bg-danger/10 text-danger"
                          }`}
                        >
                          {reg
                            ? t("regression")
                            : result.passed
                              ? t("pass")
                              : t("fail")}
                        </span>
                      )}
                    </div>

                    {/* Input text */}
                    <p className="text-sm font-medium text-primary leading-relaxed">
                      {tc.input}
                    </p>

                    {/* Expected behavior */}
                    <p className="mt-1 text-[12px] text-muted leading-relaxed">
                      {tc.expectedBehavior}
                    </p>
                  </div>

                  {/* Expand arrow */}
                  <svg
                    className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && result && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Score details */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                        {t("score")}
                      </span>
                      <span className="text-[11px] text-muted">
                        {t("thresholdHint", { score: result.score })}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          result.score >= 85
                            ? "bg-success"
                            : result.score >= 70
                              ? "bg-warning"
                              : "bg-danger"
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Model response */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                      {t("modelResponse")}
                    </span>
                    <pre className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-surface p-3 text-[12px] leading-relaxed text-secondary font-mono">
                      {result.modelResponse}
                    </pre>
                  </div>

                  {/* Evaluator note */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                      {t("evaluatorNote")}
                    </span>
                    <p className="mt-1 text-[12px] leading-relaxed text-secondary">
                      {result.evaluatorNote}
                    </p>
                  </div>

                  {/* Previous score / regression */}
                  {result.previousScore !== undefined && (
                    <div className="rounded-md border border-danger/20 bg-danger/5 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-danger">
                          {result.score < result.previousScore - 15
                            ? t("regressionDetected")
                            : t("previousScore")}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="text-[13px] font-medium text-primary">
                          {result.previousScore} → {result.score}
                        </span>
                        <span className="text-[11px] text-danger">
                          {result.previousScore - result.score > 0
                            ? `-${result.previousScore - result.score} pts`
                            : `+${result.score - result.previousScore} pts`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
