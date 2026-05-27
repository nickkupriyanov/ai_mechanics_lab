import { create } from "zustand";

type EmbeddingsState = {
  selectedPhraseIds: string[];
  viewMode: "semantic" | "keyword";
  togglePhrase: (id: string) => void;
  setViewMode: (mode: "semantic" | "keyword") => void;
  clearSelection: () => void;
};

export const useEmbeddingsStore = create<EmbeddingsState>((set) => ({
  selectedPhraseIds: [],
  viewMode: "semantic",

  togglePhrase: (id) =>
    set((state) => {
      const already = state.selectedPhraseIds.includes(id);
      if (already) {
        return { selectedPhraseIds: state.selectedPhraseIds.filter((i) => i !== id) };
      }
      if (state.selectedPhraseIds.length >= 2) {
        return { selectedPhraseIds: [state.selectedPhraseIds[1], id] };
      }
      return { selectedPhraseIds: [...state.selectedPhraseIds, id] };
    }),

  setViewMode: (viewMode) => set({ viewMode }),
  clearSelection: () => set({ selectedPhraseIds: [] }),
}));
