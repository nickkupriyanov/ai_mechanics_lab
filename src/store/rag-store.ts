import { create } from "zustand";
import { ragPresets } from "@/lib/simulation/rag-data";

export type RagSettings = {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  contextLimit: number;
  noiseLevel: number;
  userQuery: string;
  selectedPreset: string | null;
};

type RagActions = {
  setChunkSize: (size: number) => void;
  setTopK: (k: number) => void;
  setContextLimit: (limit: number) => void;
  setNoiseLevel: (level: number) => void;
  setUserQuery: (query: string) => void;
  applyPreset: (presetId: string) => void;
};

export const useRagStore = create<RagSettings & RagActions>((set) => ({
  chunkSize: 400,
  chunkOverlap: 50,
  topK: 4,
  contextLimit: 2000,
  noiseLevel: 0,
  userQuery: "Как правильно выбрать размер чанка для моих документов?",
  selectedPreset: "good-rag",

  setChunkSize: (chunkSize) =>
    set({ chunkSize: Math.max(50, Math.min(1000, chunkSize)), selectedPreset: null }),

  setTopK: (topK) =>
    set({ topK: Math.max(1, Math.min(10, topK)), selectedPreset: null }),

  setContextLimit: (contextLimit) =>
    set({ contextLimit: Math.max(200, Math.min(4000, contextLimit)), selectedPreset: null }),

  setNoiseLevel: (noiseLevel) =>
    set({ noiseLevel: Math.max(0, Math.min(1, noiseLevel)), selectedPreset: null }),

  setUserQuery: (userQuery) => set({ userQuery, selectedPreset: null }),

  applyPreset: (presetId) => {
    const preset = ragPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ ...preset.settings, selectedPreset: presetId });
    }
  },
}));
