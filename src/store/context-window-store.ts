import { create } from "zustand";
import { contextPresets } from "@/lib/simulation/context-window";

type ContextWindowState = {
  contextSize: number;
  historyCount: number;
  noiseCount: number;
  enableSummarization: boolean;
  selectedPreset: string | null;

  setContextSize: (size: number) => void;
  setHistoryCount: (count: number) => void;
  setNoiseCount: (count: number) => void;
  setEnableSummarization: (enabled: boolean) => void;
  applyPreset: (presetId: string) => void;
};

export const useContextWindowStore = create<ContextWindowState>((set) => ({
  contextSize: 4000,
  historyCount: 3,
  noiseCount: 0,
  enableSummarization: false,
  selectedPreset: "good-context",

  setContextSize: (contextSize) =>
    set({ contextSize: Math.max(500, Math.min(8000, contextSize)), selectedPreset: null }),

  setHistoryCount: (historyCount) =>
    set({ historyCount: Math.max(0, Math.min(15, historyCount)), selectedPreset: null }),

  setNoiseCount: (noiseCount) =>
    set({ noiseCount: Math.max(0, Math.min(5, noiseCount)), selectedPreset: null }),

  setEnableSummarization: (enableSummarization) =>
    set({ enableSummarization, selectedPreset: null }),

  applyPreset: (presetId) => {
    const preset = contextPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ ...preset.settings, selectedPreset: presetId });
    }
  },
}));
