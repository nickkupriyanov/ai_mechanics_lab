import { describe, it, expect } from "vitest";
import {
  guardScenarios,
  guardPresets,
  evaluateInputGuard,
  evaluateOutputGuard,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/simulation/guardrails";

const allCategories: Parameters<typeof evaluateInputGuard>[2] = [
  "hate-speech",
  "pii",
  "off-topic",
  "prompt-injection",
  "harmful-code",
  "sensitive-data",
];

describe("guardScenarios", () => {
  it("has at least 6 scenarios", () => {
    expect(guardScenarios.length).toBeGreaterThanOrEqual(6);
  });

  it("each scenario has id, input, expectedGuard, and categories", () => {
    for (const scenario of guardScenarios) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.input).toBeTruthy();
      expect(scenario.expectedGuard).toBeTruthy();
      expect(scenario.categories.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("has scenarios for both input and output guards", () => {
    const inputGuards = guardScenarios.filter(
      (s) => s.expectedGuard === "input" || s.expectedGuard === "both",
    );
    const outputGuards = guardScenarios.filter(
      (s) => s.expectedGuard === "output" || s.expectedGuard === "both",
    );
    expect(inputGuards.length).toBeGreaterThan(0);
    expect(outputGuards.length).toBeGreaterThan(0);
  });
});

describe("evaluateInputGuard", () => {
  it("blocks hate-speech with strict strictness", () => {
    const scenario = guardScenarios.find((s) => s.id === "hate-speech");
    expect(scenario).toBeDefined();
    const result = evaluateInputGuard(scenario!, "strict", allCategories, true);
    expect(result.passed).toBe(false);
  });

  it("passes all-clear scenario", () => {
    const scenario = guardScenarios.find((s) => s.id === "all-clear");
    expect(scenario).toBeDefined();
    const result = evaluateInputGuard(scenario!, "standard", allCategories, true);
    expect(result.passed).toBe(true);
  });

  it("passes when input guard is disabled", () => {
    const scenario = guardScenarios.find((s) => s.id === "hate-speech");
    expect(scenario).toBeDefined();
    const result = evaluateInputGuard(scenario!, "standard", allCategories, false);
    expect(result.passed).toBe(true);
  });

  it("'injection' scenario has categories", () => {
    const scenario = guardScenarios.find((s) => s.id === "injection");
    expect(scenario).toBeDefined();
    expect(scenario!.categories.length).toBeGreaterThan(0);
  });

  it("strict blocks at least as much as permissive", () => {
    const scenario = guardScenarios.find((s) => s.id === "off-topic");
    if (scenario) {
      const permissive = evaluateInputGuard(scenario, "permissive", allCategories, true);
      const strict = evaluateInputGuard(scenario, "strict", allCategories, true);
      if (!permissive.passed) {
        expect(strict.passed).toBe(false);
      }
    }
  });
});

describe("evaluateOutputGuard", () => {
  it("passes clean scenario via output guard", () => {
    // all-clear has expectedGuard: "both", categories: []
    const scenario = guardScenarios.find((s) => s.id === "all-clear");
    expect(scenario).toBeDefined();
    const result = evaluateOutputGuard(scenario!, "standard", allCategories, true);
    expect(result.passed).toBe(true);
  });

  it("blocks PII leak scenario", () => {
    const scenario = guardScenarios.find((s) => s.id === "pii-leak");
    expect(scenario).toBeDefined();
    const result = evaluateOutputGuard(scenario!, "strict", allCategories, true);
    expect(result.passed).toBe(false);
    expect(result.sanitized).toBe(true);
  });

  it("passes when output guard is disabled", () => {
    const scenario = guardScenarios.find((s) => s.id === "pii-leak");
    expect(scenario).toBeDefined();
    const result = evaluateOutputGuard(scenario!, "standard", allCategories, false);
    expect(result.passed).toBe(true);
  });
});

describe("getCategoryColor", () => {
  it("returns a color for each category", () => {
    for (const cat of allCategories) {
      const color = getCategoryColor(cat);
      expect(color).toBeTruthy();
    }
  });
});

describe("getCategoryLabel", () => {
  it("returns a label for each category", () => {
    for (const cat of allCategories) {
      expect(getCategoryLabel(cat)).toBeTruthy();
    }
  });
});

describe("guardPresets", () => {
  it("has 4 presets", () => {
    expect(guardPresets).toHaveLength(4);
  });

  it("'open' is permissive with guards ON", () => {
    const preset = guardPresets.find((p) => p.id === "open");
    expect(preset).toBeDefined();
    expect(preset!.settings.strictness).toBe("permissive");
    expect(preset!.settings.inputGuardEnabled).toBe(true);
  });

  it("'locked' is strict with guards ON", () => {
    const preset = guardPresets.find((p) => p.id === "locked");
    expect(preset).toBeDefined();
    expect(preset!.settings.strictness).toBe("strict");
  });

  it("'no-input' has input guard OFF", () => {
    const preset = guardPresets.find((p) => p.id === "no-input");
    expect(preset).toBeDefined();
    expect(preset!.settings.inputGuardEnabled).toBe(false);
  });
});
