import { describe, it, expect } from "vitest";
import {
  mcpServers,
  queryExamples,
  getMCPServer,
  selectMCPTool,
  executeMCPTool,
} from "@/lib/simulation/mcp";

describe("mcpServers", () => {
  it("has 5 servers", () => {
    expect(mcpServers).toHaveLength(5);
  });

  it("each server has tools and translated descriptions", () => {
    for (const server of mcpServers) {
      expect(server.tools.length).toBeGreaterThan(0);
      expect(server.name).toBeTruthy();
      expect(server.description).toBeTruthy();
      expect(server.descriptionRu).toBeTruthy();
    }
  });

  it("GitHub server has search_repos and create_issue", () => {
    const github = getMCPServer("github");
    expect(github).toBeDefined();
    const toolNames = github!.tools.map((t) => t.name);
    expect(toolNames).toContain("search_repos");
    expect(toolNames).toContain("create_issue");
  });
});

describe("getMCPServer", () => {
  it("returns server for valid id", () => {
    for (const server of mcpServers) {
      expect(getMCPServer(server.id)).toBeDefined();
    }
  });

  it("returns undefined for invalid id", () => {
    expect(getMCPServer("non-existent")).toBeUndefined();
  });
});

describe("queryExamples", () => {
  it("has 6 queries", () => {
    expect(queryExamples).toHaveLength(6);
  });

  it("each query has translated labels and query text", () => {
    for (const q of queryExamples) {
      expect(q.label).toBeTruthy();
      expect(q.labelRu).toBeTruthy();
      expect(q.query).toBeTruthy();
      expect(q.queryRu).toBeTruthy();
    }
  });

  it("each query references an existing server", () => {
    const serverIds = new Set(mcpServers.map((s) => s.id));
    for (const q of queryExamples) {
      expect(serverIds.has(q.serverId)).toBe(true);
    }
  });
});

describe("selectMCPTool", () => {
  it("returns a tool for each server with valid query", () => {
    for (const server of mcpServers) {
      const matchingQuery = queryExamples.find((q) => q.serverId === server.id);
      if (!matchingQuery) continue;
      const result = selectMCPTool(matchingQuery.query, server, false);
      expect(result).toBeDefined();
      expect(result.tool).toBeDefined();
      expect(server.tools).toContain(result.tool);
    }
  });
});

describe("executeMCPTool", () => {
  it("returns success for valid tool execution", () => {
    const server = getMCPServer("github")!;
    const result = executeMCPTool(
      server.tools[0],
      { query: "test" },
      server.id,
      false,
    );
    expect(result.success).toBe(true);
    expect(result.output).toBeTruthy();
  });

  it("returns error when simulateError is true", () => {
    const server = getMCPServer("github")!;
    const result = executeMCPTool(
      server.tools[0],
      { query: "test" },
      server.id,
      true,
    );
    expect(result.success).toBe(false);
  });

  it("works for all servers with their tools", () => {
    for (const server of mcpServers) {
      if (server.tools.length === 0) continue;
      const tool = server.tools[0];
      // Don't test unknown servers, just test valid ones
      const result = executeMCPTool(tool, { query: "test" }, server.id, false);
      expect(result).toHaveProperty("success");
    }
  });
});
