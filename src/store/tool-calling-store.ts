import { create } from "zustand";
import { userRequests, toolCallingPresets } from "@/lib/simulation/tool-calling";

type ToolCallingState = {
  userQuery: string;
  useBadDescriptions: boolean;
  requireApproval: boolean;
  simulateError: boolean;
  enableSimilarTools: boolean;
  selectedPreset: string | null;
  approved: boolean;

  setUserQuery: (query: string) => void;
  setUseBadDescriptions: (v: boolean) => void;
  setRequireApproval: (v: boolean) => void;
  setSimulateError: (v: boolean) => void;
  setEnableSimilarTools: (v: boolean) => void;
  setApproved: (v: boolean) => void;
  applyPreset: (presetId: string) => void;
};

export const useToolCallingStore = create<ToolCallingState>((set) => ({
  userQuery: userRequests[0].query,
  useBadDescriptions: false,
  requireApproval: false,
  simulateError: false,
  enableSimilarTools: false,
  selectedPreset: "good-tool-call",
  approved: false,

  setUserQuery: (userQuery) => set({ userQuery, selectedPreset: null }),
  setUseBadDescriptions: (v) => set({ useBadDescriptions: v, selectedPreset: null }),
  setRequireApproval: (v) => set({ requireApproval: v, selectedPreset: null }),
  setSimulateError: (v) => set({ simulateError: v, selectedPreset: null }),
  setEnableSimilarTools: (v) => set({ enableSimilarTools: v, selectedPreset: null }),
  setApproved: (approved) => set({ approved }),

  applyPreset: (presetId) => {
    const preset = toolCallingPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ ...preset.settings, selectedPreset: presetId, approved: false });
    }
  },
}));
