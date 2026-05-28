import { create } from "zustand";
import {
  type MCPServer,
  type MCPTool,
  type QueryExample,
  queryExamples,
  getMCPServer,
  getQueryExample,
  selectMCPTool,
  generateMCPArgs,
  executeMCPTool,
  getDiscoverySteps,
} from "@/lib/simulation/mcp";

export type DiscoveryStep = "idle" | "listening" | "discovered" | "tool_selected" | "executed";

export type MCPState = {
  selectedServerId: string;
  selectedQuery: string;
  discoveryStep: DiscoveryStep;
  toolResult: { success: boolean; output: string; error?: string } | null;
  showDiscovery: boolean;
  useVagueDescriptions: boolean;
  simulateError: boolean;
  selectedPreset: string | null;

  selectedServer: MCPServer;
  selectedQueryExample: QueryExample;
  discoverySteps: ReturnType<typeof getDiscoverySteps>;
  selectedTool: { tool: MCPTool; score: number } | null;
  generatedArgs: Record<string, string>;

  setServer: (serverId: string) => void;
  setQuery: (queryId: string) => void;
  runDiscovery: () => void;
  callTool: () => void;
  reset: () => void;
  setShowDiscovery: (v: boolean) => void;
  setUseVagueDescriptions: (v: boolean) => void;
  setSimulateError: (v: boolean) => void;
  applyPreset: (presetId: string) => void;
};

const defaultServerId = "github";
const defaultQuery = "github-search";

function makeBaseState(
  serverId: string,
  queryId: string,
  step: DiscoveryStep,
  vague: boolean,
  simError: boolean,
  result: { success: boolean; output: string; error?: string } | null,
) {
  const server = getMCPServer(serverId)!;
  const queryExample = getQueryExample(queryId)!;
  const discoverySteps = getDiscoverySteps(server);

  let selectedTool: { tool: MCPTool; score: number } | null = null;
  let generatedArgs: Record<string, string> = {};

  if (step === "tool_selected" || step === "executed") {
    const r = selectMCPTool(queryExample.query, server, vague);
    selectedTool = { tool: r.tool, score: Math.round(r.score * 10) / 10 };
    generatedArgs = generateMCPArgs(r.tool, queryExample.query);
  }

  return {
    selectedServerId: serverId,
    selectedQuery: queryId,
    discoveryStep: step,
    toolResult: result,
    selectedServer: server,
    selectedQueryExample: queryExample,
    discoverySteps,
    selectedTool,
    generatedArgs,
  };
}

export const useMCPStore = create<MCPState>((set, get) =>
  ({
    ...makeBaseState(defaultServerId, defaultQuery, "idle", false, false, null),
    showDiscovery: false,
    useVagueDescriptions: false,
    simulateError: false,
    selectedPreset: "good-discovery",

    setServer: (serverId) => {
      const s = get();
      const q = queryExamples.find((q) => q.serverId === serverId)?.id ?? s.selectedQuery;
      set({
        ...makeBaseState(serverId, q, "idle", s.useVagueDescriptions, s.simulateError, null),
        showDiscovery: s.showDiscovery,
        useVagueDescriptions: s.useVagueDescriptions,
        simulateError: s.simulateError,
        selectedPreset: null,
      });
    },

    setQuery: (queryId) => {
      const s = get();
      set({
        ...makeBaseState(s.selectedServerId, queryId, s.discoveryStep, s.useVagueDescriptions, s.simulateError, s.toolResult),
        showDiscovery: s.showDiscovery,
        useVagueDescriptions: s.useVagueDescriptions,
        simulateError: s.simulateError,
        selectedPreset: null,
      });
    },

    runDiscovery: () => {
      const s = get();
      set({
        ...makeBaseState(s.selectedServerId, s.selectedQuery, "tool_selected", s.useVagueDescriptions, s.simulateError, null),
        showDiscovery: true,
        useVagueDescriptions: s.useVagueDescriptions,
        simulateError: s.simulateError,
        selectedPreset: null,
      });
    },

    callTool: () => {
      const s = get();
      if (!s.selectedTool) return;
      const result = executeMCPTool(s.selectedTool.tool.name, s.selectedServerId, s.generatedArgs, s.simulateError);
      set({
        ...makeBaseState(s.selectedServerId, s.selectedQuery, "executed", s.useVagueDescriptions, s.simulateError, result),
        showDiscovery: s.showDiscovery,
        useVagueDescriptions: s.useVagueDescriptions,
        simulateError: s.simulateError,
        selectedPreset: null,
      });
    },

    reset: () => {
      set({
        ...makeBaseState(defaultServerId, defaultQuery, "idle", false, false, null),
        showDiscovery: false,
        useVagueDescriptions: false,
        simulateError: false,
        selectedPreset: null,
      });
    },

    setShowDiscovery: (showDiscovery) => set({ showDiscovery }),
    setUseVagueDescriptions: (v) => {
      const s = get();
      set({
        ...makeBaseState(s.selectedServerId, s.selectedQuery, s.discoveryStep, v, s.simulateError, s.toolResult),
        showDiscovery: s.showDiscovery,
        useVagueDescriptions: v,
        simulateError: s.simulateError,
        selectedPreset: null,
      });
    },
    setSimulateError: (v) => {
      const s = get();
      set({
        ...makeBaseState(s.selectedServerId, s.selectedQuery, s.discoveryStep, s.useVagueDescriptions, v, s.toolResult),
        showDiscovery: s.showDiscovery,
        useVagueDescriptions: s.useVagueDescriptions,
        simulateError: v,
        selectedPreset: null,
      });
    },

    applyPreset: (presetId) => {
      const github = getMCPServer("github")!;
      const database = getMCPServer("database")!;

      switch (presetId) {
        case "good-discovery":
          set({
            ...makeBaseState("github", "github-search", "executed", false, false, null),
            toolResult: executeMCPTool("search_repos", "github", { query: "TypeScript AI repositories" }, false),
            showDiscovery: true,
            useVagueDescriptions: false,
            simulateError: false,
            selectedPreset: presetId,
            selectedTool: { tool: github.tools[0], score: 5.2 },
            generatedArgs: { query: "TypeScript AI repositories" },
          });
          break;
        case "bad-descriptions":
          set({
            ...makeBaseState("github", "github-search", "tool_selected", true, false, null),
            toolResult: null,
            showDiscovery: true,
            useVagueDescriptions: true,
            simulateError: false,
            selectedPreset: presetId,
            selectedTool: { tool: github.tools[1], score: 2.1 },
            generatedArgs: {},
          });
          break;
        case "tool-error": {
          const result = executeMCPTool("query", "database", { sql: "SELECT COUNT(*) FROM users" }, true);
          set({
            ...makeBaseState("database", "database-query", "executed", false, true, result),
            showDiscovery: true,
            useVagueDescriptions: false,
            simulateError: true,
            selectedPreset: presetId,
            selectedTool: { tool: database.tools[0], score: 5.8 },
            generatedArgs: { sql: "SELECT COUNT(*) as active_users FROM users WHERE last_active > NOW() - INTERVAL '30 days'" },
          });
          break;
        }
        case "unreachable":
          set({
            ...makeBaseState("github", "github-search", "idle", false, true, null),
            showDiscovery: false,
            useVagueDescriptions: false,
            simulateError: true,
            selectedPreset: presetId,
            selectedTool: null,
            generatedArgs: {},
          });
          break;
      }
    },
  } satisfies MCPState as MCPState)
);
