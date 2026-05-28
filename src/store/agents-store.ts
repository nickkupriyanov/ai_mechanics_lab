"use client";

import { create } from "zustand";
import {
  agentScenarios,
  agentsPresets,
  type ToolReliability,
} from "@/lib/simulation/agents";

export type ExecutedStep = {
  id: string;
  action: string;
  actionRu: string;
  toolName: string;
  toolArgs: Record<string, string>;
  observation: string;
  observationRu: string;
  reflection: string;
  reflectionRu: string;
  isComplete: boolean;
  isError: boolean;
  stepNumber: number;
};

type AgentsState = {
  scenarioId: string;
  maxSteps: number;
  currentStep: number;
  enableReflection: boolean;
  toolReliability: ToolReliability;
  enableStopCondition: boolean;
  executedSteps: ExecutedStep[];
  isDone: boolean;
  isStuck: boolean;
  selectedPreset: string | null;

  setScenario: (scenarioId: string) => void;
  setMaxSteps: (n: number) => void;
  setReflection: (v: boolean) => void;
  setReliability: (r: ToolReliability) => void;
  setStopCondition: (v: boolean) => void;
  runNextStep: () => void;
  reset: () => void;
  applyPreset: (presetId: string) => void;
};

function getScenario(scenarioId: string) {
  return agentScenarios.find((s) => s.id === scenarioId) ?? agentScenarios[0];
}

const DEFAULT_SCENARIO = "find-restaurant";
const DEFAULT_MAX_STEPS = 5;

export const useAgentsStore = create<AgentsState>((set, get) => ({
  scenarioId: DEFAULT_SCENARIO,
  maxSteps: DEFAULT_MAX_STEPS,
  currentStep: 0,
  enableReflection: true,
  toolReliability: "good",
  enableStopCondition: true,
  executedSteps: [],
  isDone: false,
  isStuck: false,
  selectedPreset: null,

  setScenario: (scenarioId) =>
    set({
      scenarioId,
      currentStep: 0,
      executedSteps: [],
      isDone: false,
      isStuck: false,
      selectedPreset: null,
    }),

  setMaxSteps: (n) =>
    set({
      maxSteps: Math.max(1, Math.min(10, n)),
      isStuck: false,
      selectedPreset: null,
    }),

  setReflection: (enableReflection) =>
    set({ enableReflection, selectedPreset: null }),

  setReliability: (toolReliability) =>
    set({ toolReliability, selectedPreset: null }),

  setStopCondition: (enableStopCondition) =>
    set({ enableStopCondition, selectedPreset: null }),

  runNextStep: () => {
    const state = get();
    if (state.isDone || state.isStuck) return;

    const scenario = getScenario(state.scenarioId);
    const steps = scenario.steps;
    const stepIndex = state.currentStep % steps.length;
    const step = steps[stepIndex];

    const shouldError =
      state.toolReliability === "poor" && state.executedSteps.length % 3 === 0;

    const executedStep: ExecutedStep = {
      id: step.id,
      action: step.action,
      actionRu: step.actionRu,
      toolName: step.toolName,
      toolArgs: step.toolArgs,
      observation: shouldError ? step.errorObservation : step.observation,
      observationRu: shouldError ? step.errorObservationRu : step.observationRu,
      reflection: step.reflection,
      reflectionRu: step.reflectionRu,
      isComplete: step.isComplete,
      isError: shouldError,
      stepNumber: state.executedSteps.length + 1,
    };

    const newExecutedSteps = [...state.executedSteps, executedStep];
    const nextStepIndex = state.currentStep + 1;
    const reachedMax = newExecutedSteps.length >= state.maxSteps;

    const lastStepIsComplete = executedStep.isComplete;
    const done =
      state.enableStopCondition && lastStepIsComplete && !shouldError;
    const stuck = !done && reachedMax;

    set({
      executedSteps: newExecutedSteps,
      currentStep: done ? nextStepIndex : nextStepIndex,
      isDone: done,
      isStuck: stuck,
    });
  },

  reset: () =>
    set({
      currentStep: 0,
      executedSteps: [],
      isDone: false,
      isStuck: false,
    }),

  applyPreset: (presetId) => {
    const preset = agentsPresets.find((p) => p.id === presetId);
    if (preset) {
      set({
        ...preset.settings,
        currentStep: 0,
        executedSteps: [],
        isDone: false,
        isStuck: false,
        selectedPreset: presetId,
      });
    }
  },
}));
