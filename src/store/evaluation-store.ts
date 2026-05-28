import { create } from "zustand";
import type { Strictness } from "@/lib/simulation/evaluation";

type EvaluationState = {
  selectedScenarioId: string;
  strictness: Strictness;
  showRegressions: boolean;
  selectedPreset: string | null;
  baselineScores: Record<string, number>;

  setScenario: (id: string) => void;
  setStrictness: (s: Strictness) => void;
  toggleRegressions: (v: boolean) => void;
  resetBaseline: () => void;
  applyPreset: (presetId: string) => void;
};

const defaultBaseline: Record<string, number> = {
  "customer-support-s1": 85,
  "customer-support-s2": 90,
  "customer-support-s3": 100,
  "customer-support-s4": 70,
  "customer-support-s5": 80,
  "code-generation-g1": 88,
  "code-generation-g2": 45,
  "code-generation-g3": 88,
  "code-generation-g4": 90,
  "code-generation-g5": 83,
  "content-moderation-m1": 100,
  "content-moderation-m2": 95,
  "content-moderation-m3": 93,
  "content-moderation-m4": 60,
  "content-moderation-m5": 10,
};

const regressionBaseline: Record<string, number> = {
  "customer-support-s1": 90,
  "customer-support-s2": 95,
  "customer-support-s3": 100,
  "customer-support-s4": 85,
  "customer-support-s5": 88,
  "code-generation-g1": 92,
  "code-generation-g2": 70,
  "code-generation-g3": 92,
  "code-generation-g4": 95,
  "code-generation-g5": 88,
  "content-moderation-m1": 100,
  "content-moderation-m2": 98,
  "content-moderation-m3": 96,
  "content-moderation-m4": 75,
  "content-moderation-m5": 25,
};

export const useEvaluationStore = create<EvaluationState>((set) => ({
  selectedScenarioId: "customer-support",
  strictness: "standard",
  showRegressions: false,
  selectedPreset: null,
  baselineScores: {},

  setScenario: (selectedScenarioId) =>
    set({ selectedScenarioId, selectedPreset: null }),

  setStrictness: (strictness) => set({ strictness, selectedPreset: null }),

  toggleRegressions: (showRegressions) =>
    set({ showRegressions, selectedPreset: null }),

  resetBaseline: () => set({ baselineScores: { ...defaultBaseline } }),

  applyPreset: (presetId) => {
    switch (presetId) {
      case "all-passing":
        set({
          selectedScenarioId: "customer-support",
          strictness: "standard",
          showRegressions: false,
          baselineScores: {},
          selectedPreset: presetId,
        });
        break;
      case "strict-fail":
        set({
          strictness: "strict",
          showRegressions: false,
          baselineScores: {},
          selectedPreset: presetId,
        });
        break;
      case "regression":
        set({
          selectedScenarioId: "customer-support",
          strictness: "standard",
          showRegressions: true,
          baselineScores: { ...regressionBaseline },
          selectedPreset: presetId,
        });
        break;
      case "lenient-pass":
        set({
          strictness: "lenient",
          showRegressions: false,
          baselineScores: {},
          selectedPreset: presetId,
        });
        break;
      default:
        break;
    }
  },
}));
