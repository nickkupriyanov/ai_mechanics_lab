"use client";

import { useMemo } from "react";
import { useEvaluationStore } from "@/store/evaluation-store";
import {
  runEvaluation,
  scenarios,
} from "@/lib/simulation/evaluation";
import { EvaluationPipeline } from "./EvaluationPipeline";
import { ScoreCard } from "./ScoreCard";
import { TestCasesList } from "./TestCasesList";
import { EvaluationControls } from "./EvaluationControls";

export function EvaluationScene() {
  const {
    selectedScenarioId,
    strictness,
    showRegressions,
    baselineScores,
  } = useEvaluationStore();

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId),
    [selectedScenarioId],
  );

  const results = useMemo(
    () => runEvaluation(selectedScenarioId, strictness, baselineScores),
    [selectedScenarioId, strictness, baselineScores],
  );

  if (!scenario) return null;

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const passRate =
    totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline flow */}
      <EvaluationPipeline
        totalTests={totalTests}
        passedTests={passedTests}
        passRate={passRate}
      />

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        {/* Column 1: ScoreCard + Test cases */}
        <div className="space-y-4 min-w-0">
          <ScoreCard
            results={results}
            testCases={scenario.testCases}
            showRegressions={showRegressions}
          />
          <TestCasesList
            testCases={scenario.testCases}
            results={results}
            showRegressions={showRegressions}
          />
        </div>

        {/* Column 2: Controls */}
        <div className="space-y-4">
          <EvaluationControls />
        </div>
      </div>
    </div>
  );
}
