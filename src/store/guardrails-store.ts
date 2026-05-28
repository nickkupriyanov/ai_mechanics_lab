import { create } from "zustand";
import type { ContentCategory, Strictness } from "@/lib/simulation/guardrails";
import { guardPresets } from "@/lib/simulation/guardrails";

const allCategories: ContentCategory[] = [
  "hate-speech",
  "pii",
  "off-topic",
  "prompt-injection",
  "harmful-code",
  "sensitive-data",
];

type GuardrailsState = {
  selectedScenarioId: string;
  strictness: Strictness;
  inputGuardEnabled: boolean;
  outputGuardEnabled: boolean;
  enabledCategories: ContentCategory[];
  selectedPreset: string | null;

  setScenario: (id: string) => void;
  setStrictness: (s: Strictness) => void;
  toggleInputGuard: (v: boolean) => void;
  toggleOutputGuard: (v: boolean) => void;
  toggleCategory: (c: ContentCategory) => void;
  enableAllCategories: () => void;
  applyPreset: (presetId: string) => void;
};

export const useGuardrailsStore = create<GuardrailsState>((set, get) => ({
  selectedScenarioId: "all-clear",
  strictness: "standard",
  inputGuardEnabled: true,
  outputGuardEnabled: true,
  enabledCategories: [...allCategories],
  selectedPreset: null,

  setScenario: (selectedScenarioId) =>
    set({ selectedScenarioId, selectedPreset: null }),

  setStrictness: (strictness) => set({ strictness, selectedPreset: null }),

  toggleInputGuard: (inputGuardEnabled) =>
    set({ inputGuardEnabled, selectedPreset: null }),

  toggleOutputGuard: (outputGuardEnabled) =>
    set({ outputGuardEnabled, selectedPreset: null }),

  toggleCategory: (category) => {
    const current = get().enabledCategories;
    const next = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    set({ enabledCategories: next, selectedPreset: null });
  },

  enableAllCategories: () =>
    set({ enabledCategories: [...allCategories], selectedPreset: null }),

  applyPreset: (presetId) => {
    const preset = guardPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ ...preset.settings, selectedPreset: presetId });
    }
  },
}));
