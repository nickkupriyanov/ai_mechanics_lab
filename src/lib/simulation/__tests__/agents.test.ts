import { describe, it, expect } from "vitest";
import { agentScenarios, agentsPresets } from "@/lib/simulation/agents";

describe("agentScenarios", () => {
  it("has all 4 scenarios", () => {
    expect(agentScenarios).toHaveLength(4);
  });

  it("each scenario has required fields", () => {
    for (const scenario of agentScenarios) {
      expect(scenario).toHaveProperty("id");
      expect(scenario).toHaveProperty("goal");
      expect(scenario).toHaveProperty("goalRu");
      expect(scenario).toHaveProperty("steps");
      expect(scenario.steps.length).toBeGreaterThan(0);
    }
  });

  it("'find-restaurant' scenario has at least 2 steps", () => {
    const scenario = agentScenarios.find((s) => s.id === "find-restaurant");
    expect(scenario).toBeDefined();
    expect(scenario!.steps.length).toBeGreaterThanOrEqual(2);
  });

  it("'vague-goal' scenario exists with Russian goal", () => {
    const scenario = agentScenarios.find((s) => s.id === "vague-goal");
    expect(scenario).toBeDefined();
    expect(scenario!.goalRu).toBeTruthy();
  });

  it("last step of 'debug-bug' is complete", () => {
    const scenario = agentScenarios.find((s) => s.id === "debug-bug");
    expect(scenario).toBeDefined();
    const lastStep = scenario!.steps[scenario!.steps.length - 1];
    expect(lastStep.isComplete).toBe(true);
  });

  it("each step has translated fields", () => {
    for (const scenario of agentScenarios) {
      for (const step of scenario.steps) {
        expect(step.action).toBeTruthy();
        expect(step.actionRu).toBeTruthy();
        expect(step.observation).toBeTruthy();
        expect(step.observationRu).toBeTruthy();
        expect(step.reflection).toBeTruthy();
        expect(step.reflectionRu).toBeTruthy();
      }
    }
  });
});

describe("agentsPresets", () => {
  it("has 4 presets", () => {
    expect(agentsPresets).toHaveLength(4);
  });

  it("each preset has required settings", () => {
    for (const preset of agentsPresets) {
      expect(preset).toHaveProperty("id");
      expect(preset).toHaveProperty("title");
      expect(preset).toHaveProperty("settings");
      expect(preset.settings.maxSteps).toBeGreaterThan(0);
      expect(typeof preset.settings.enableReflection).toBe("boolean");
    }
  });

  it("'infinite-loop' has stopCondition disabled", () => {
    const preset = agentsPresets.find((p) => p.id === "infinite-loop");
    expect(preset).toBeDefined();
    expect(preset!.settings.enableStopCondition).toBe(false);
    expect(preset!.settings.toolReliability).toBe("poor");
  });

  it("'wrong-tool' has vague-goal scenario", () => {
    const preset = agentsPresets.find((p) => p.id === "wrong-tool");
    expect(preset).toBeDefined();
    expect(preset!.settings.scenarioId).toBe("vague-goal");
  });

  it("all preset scenarioIds reference existing scenarios", () => {
    const scenarioIds = new Set(agentScenarios.map((s) => s.id));
    for (const preset of agentsPresets) {
      expect(scenarioIds.has(preset.settings.scenarioId)).toBe(true);
    }
  });
});
