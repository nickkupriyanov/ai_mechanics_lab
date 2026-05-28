import { create } from "zustand";
import type { AttackType } from "@/lib/simulation/prompt-injection";
import { injectionPresets } from "@/lib/simulation/prompt-injection";

type PromptInjectionState = {
  selectedAttackType: AttackType;
  selectedQueryId: string;
  enableHierarchy: boolean;
  enableSanitization: boolean;
  selectedPreset: string | null;
  poisonedDocActive: boolean;
  showInjectedContent: boolean;

  setAttackType: (t: AttackType) => void;
  setQuery: (id: string) => void;
  toggleHierarchy: (v: boolean) => void;
  toggleSanitization: (v: boolean) => void;
  togglePoisonedDoc: (v: boolean) => void;
  toggleShowInjected: (v: boolean) => void;
  applyPreset: (presetId: string) => void;
};

export const usePromptInjectionStore = create<PromptInjectionState>((set) => ({
  selectedAttackType: "ignore-instructions",
  selectedQueryId: "q-support",
  enableHierarchy: true,
  enableSanitization: true,
  selectedPreset: "safe",
  poisonedDocActive: false,
  showInjectedContent: false,

  setAttackType: (selectedAttackType) =>
    set({ selectedAttackType, selectedPreset: null }),
  setQuery: (selectedQueryId) =>
    set({ selectedQueryId, selectedPreset: null }),
  toggleHierarchy: (enableHierarchy) =>
    set({ enableHierarchy, selectedPreset: null }),
  toggleSanitization: (enableSanitization) =>
    set({ enableSanitization, selectedPreset: null }),
  togglePoisonedDoc: (poisonedDocActive) =>
    set({ poisonedDocActive, selectedPreset: null }),
  toggleShowInjected: (showInjectedContent) =>
    set({ showInjectedContent, selectedPreset: null }),

  applyPreset: (presetId) => {
    const preset = injectionPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ ...preset.settings, selectedPreset: presetId });
    }
  },
}));
