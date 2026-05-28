"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { EvalResult, TestCase } from "@/lib/simulation/evaluation";
import { detectRegressions } from "@/lib/simulation/evaluation";

type ScoreCardProps = {
  results: EvalResult[];
  testCases: TestCase[];
  showRegressions: boolean;
};

type CatKey = "accuracy" | "safety" | "completeness" | "tone";

export function ScoreCard({ results, testCases, showRegressions }: ScoreCardProps) {
  const t = useTranslations("Evaluation.scoreCard");

  const { totalTests, passedTests, passRate, grade, byCategory, regressions } =
    useMemo(() => {
      const totalTests = results.length;
      const passedTests = results.filter((r) => r.passed).length;
      const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

      let grade: string;
      if (passRate >= 90) grade = "A";
      else if (passRate >= 70) grade = "B";
      else if (passRate >= 50) grade = "C";
      else grade = "F";

      const catScores: Record<CatKey, { total: number; passed: number }> = {
        accuracy: { total: 0, passed: 0 },
        safety: { total: 0, passed: 0 },
        completeness: { total: 0, passed: 0 },
        tone: { total: 0, passed: 0 },
      };

      results.forEach((r) => {
        const tc = testCases.find((c) => c.id === r.testCaseId);
        if (tc && catScores[tc.category]) {
          catScores[tc.category].total++;
          if (r.passed) catScores[tc.category].passed++;
        }
      });

      const regressions = detectRegressions(results);

      return {
        totalTests,
        passedTests,
        passRate,
        grade,
        byCategory: catScores,
        regressions,
      };
    }, [results, testCases]);

  const gradeColor =
    grade === "A"
      ? "text-success"
      : grade === "B"
        ? "text-success/80"
        : grade === "C"
          ? "text-warning"
          : "text-danger";

  const passRateColor =
    passRate > 80
      ? "text-success"
      : passRate > 50
        ? "text-warning"
        : "text-danger";

  const catNames: Record<CatKey, string> = {
    accuracy: t("accuracy"),
    safety: t("safety"),
    completeness: t("completeness"),
    tone: t("tone"),
  };

  const catColors: Record<CatKey, string> = {
    accuracy: "bg-blue-500",
    safety: "bg-green-500",
    completeness: "bg-purple-500",
    tone: "bg-amber-500",
  };

  return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <div className="border-b border-border px-4 py-2.5">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Main score row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${passRateColor}`}>
                {passRate}%
              </span>
              <span className={`text-lg font-bold ${gradeColor}`}>
                {t("grade")}: {grade}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted">
              {t("passedLabel", { passed: passedTests, total: totalTests })}
            </p>
          </div>
          {showRegressions && regressions.length > 0 && (
            <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-1.5">
              <span className="text-[11px] font-medium text-danger">
                {t("regressionsDetected", { count: regressions.length })}
              </span>
            </div>
          )}
        </div>

        {/* Pass rate bar */}
        <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              passRate > 80
                ? "bg-success"
                : passRate > 50
                  ? "bg-warning"
                  : "bg-danger"
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>

        {/* By category */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
            {t("byCategory")}
          </span>
          <div className="flex flex-wrap gap-2">
            {(["accuracy", "safety", "completeness", "tone"] as CatKey[]).map(
              (cat) => {
                const data = byCategory[cat];
                if (data.total === 0) return null;
                const pct = Math.round((data.passed / data.total) * 100);
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1"
                  >
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${catColors[cat]}`}
                    />
                    <span className="text-[11px] text-secondary">
                      {catNames[cat]}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        pct >= 80
                          ? "text-success"
                          : pct >= 50
                            ? "text-warning"
                            : "text-danger"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
