import { create } from "zustand";
import { phrases } from "@/lib/simulation/embeddings";

type VectorSearchState = {
  queryId: string;
  topK: number;
  threshold: number;
  setQueryId: (id: string) => void;
  setTopK: (k: number) => void;
  setThreshold: (t: number) => void;
};

export const useVectorSearchStore = create<VectorSearchState>((set) => ({
  queryId: phrases[0].id,
  topK: 5,
  threshold: 0.3,

  setQueryId: (queryId) => set({ queryId }),
  setTopK: (topK) => set({ topK: Math.max(1, Math.min(10, topK)) }),
  setThreshold: (threshold) => set({ threshold: Math.max(0, Math.min(1, threshold)) }),
}));
