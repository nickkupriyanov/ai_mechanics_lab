import { describe, it, expect } from "vitest";
import {
  scenarios,
  runEvaluation,
  detectRegressions,
} from "@/lib/simulation/evaluation";

describe("scenarios", () => {
  it("has 3 scenarios", () => {
    expect(scenarios).toHaveLength(3);
  });

  it("each scenario has test cases and descriptions", () => {
    for (const scenario of scenarios) {
      expect(scenario.testCases.length).toBeGreaterThanOrEqual(4);
      expect(scenario.name).toBeTruthy();
      expect(scenario.id).toBeTruthy();
    }
  });

  it("each test case has input, expected behavior, and category", () => {
    for (const scenario of scenarios) {
      for (const tc of scenario.testCases) {
        expect(tc.input).toBeTruthy();
        expect(tc.expectedBehavior).toBeTruthy();
        expect(tc.category).toBeTruthy();
      }
    }
  });
});

describe("runEvaluation", () => {
  it("takes scenario ID (string) and returns results", () => {
    const result = runEvaluation("customer-support", "standard");
    expect(result.length).toBeGreaterThan(0);
  });

  it("each result has score, passed, response, and note", () => {
    const results = runEvaluation("customer-support", "standard");
    for (const result of results) {
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(typeof result.passed).toBe("boolean");
      expect(result.modelResponse).toBeTruthy();
      expect(result.evaluatorNote).toBeTruthy();
    }
  });

  it("strict has fewer or equal passes than lenient", () => {
    const lenient = runEvaluation("customer-support", "lenient");
    const strict = runEvaluation("customer-support", "strict");
    const lenientPassed = lenient.filter((r) => r.passed).length;
    const strictPassed = strict.filter((r) => r.passed).length;
    expect(strictPassed).toBeLessThanOrEqual(lenientPassed);
  });

  it("returns deterministic results", () => {
    const a = runEvaluation("customer-support", "standard");
    const b = runEvaluation("customer-support", "standard");
    for (let i = 0; i < a.length; i++) {
      expect(a[i].score).toBe(b[i].score);
    }
  });

  it("returns empty for unknown scenario", () => {
    expect(runEvaluation("unknown", "standard")).toHaveLength(0);
  });
});

describe("detectRegressions", () => {
  it("detects regressions when previousScore is lower than score", () => {
    const results = runEvaluation("customer-support", "standard");
    // Add previousScore that are much higher to trigger regressions
    const withBaseline = results.map((r) => ({
      ...r,
      previousScore: Math.min(100, r.score + 20),
    }));
    const regressions = detectRegressions(withBaseline);
    expect(regressions.length).toBeGreaterThan(0);
  });

  it("returns empty when no regressions", () => {
    const results = runEvaluation("customer-support", "standard");
    const regressions = detectRegressions(results);
    expect(regressions.length).toBe(0);
  });
});
