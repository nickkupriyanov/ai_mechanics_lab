import { create } from "zustand";
import { allMemories, memoryPresets } from "@/lib/simulation/memory";

type MemoryState = {
  activeSnippetIds: string[];
  selectedQueryId: string;
  contextLimit: number;
  selectedPreset: string | null;

  toggleSnippet: (id: string) => void;
  deleteSnippet: (id: string) => void;
  setQuery: (id: string) => void;
  setContextLimit: (limit: number) => void;
  applyPreset: (presetId: string) => void;
  resetMemories: () => void;
};

export const useMemoryStore = create<MemoryState>((set) => ({
  activeSnippetIds: allMemories.map((m) => m.id),
  selectedQueryId: "q-stack",
  contextLimit: 200,
  selectedPreset: "normal-memory",

  toggleSnippet: (id) =>
    set((s) => {
      const isActive = s.activeSnippetIds.includes(id);
      return {
        activeSnippetIds: isActive
          ? s.activeSnippetIds.filter((i) => i !== id)
          : [...s.activeSnippetIds, id],
        selectedPreset: null,
      };
    }),

  deleteSnippet: (id) =>
    set((s) => ({
      activeSnippetIds: s.activeSnippetIds.filter((i) => i !== id),
      selectedPreset: null,
    })),

  setQuery: (selectedQueryId) =>
    set({ selectedQueryId, selectedPreset: null }),

  setContextLimit: (contextLimit) =>
    set({
      contextLimit: Math.max(10, Math.min(600, contextLimit)),
      selectedPreset: null,
    }),

  applyPreset: (presetId) => {
    const preset = memoryPresets.find((p) => p.id === presetId);
    if (preset) {
      set({
        activeSnippetIds: [...preset.settings.activeSnippetIds],
        selectedQueryId: preset.settings.selectedQueryId,
        contextLimit: preset.settings.contextLimit,
        selectedPreset: presetId,
      });
    }
  },

  resetMemories: () =>
    set({
      activeSnippetIds: allMemories.map((m) => m.id),
      selectedPreset: null,
    }),
}));
