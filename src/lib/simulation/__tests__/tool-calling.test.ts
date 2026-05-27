import { describe, it, expect } from "vitest";
import { selectTool, generateArgs, executeTool, tools } from "@/lib/simulation/tool-calling";

describe("selectTool", () => {
  it("selects correct tool for weather query", () => {
    const { tool } = selectTool("What's the weather in San Francisco?", tools);
    expect(tool.id).toBe("get_weather");
  });

  it("selects correct tool for document search", () => {
    const { tool } = selectTool(
      "Find documentation about vector databases",
      tools,
    );
    expect(tool.id).toBe("search_docs");
  });

  it("selects correct tool for email query", () => {
    const { tool } = selectTool(
      "Send an email to team about deployment",
      tools,
    );
    expect(tool.id).toBe("send_email");
  });

  it("selects correct tool for database query", () => {
    const { tool } = selectTool("How many active users do we have?", tools);
    expect(tool.id).toBe("query_db");
  });

  it("selects correct tool for ticket creation", () => {
    const { tool } = selectTool(
      "Create a ticket for the login bug",
      tools,
    );
    expect(tool.id).toBe("create_ticket");
  });

  it("returns a score for every tool", () => {
    const { tool, score } = selectTool("Find documents about AI", tools);
    expect(score).toBeDefined();
    expect(tool).toBeDefined();
  });
});

describe("generateArgs", () => {
  it("extracts city from weather query", () => {
    const weatherTool = tools.find((t) => t.id === "get_weather")!;
    const args = generateArgs(
      weatherTool,
      "What's the weather in San Francisco?",
    );
    expect(args.city).toContain("San");
  });

  it("extracts email address from email query", () => {
    const emailTool = tools.find((t) => t.id === "send_email")!;
    const args = generateArgs(
      emailTool,
      "Send email to team@company.com subject 'Hello' body 'test'",
    );
    expect(args.to).toBe("team@company.com");
  });

  it("generates SQL for database query about users", () => {
    const dbTool = tools.find((t) => t.id === "query_db")!;
    const args = generateArgs(dbTool, "How many active users?");
    expect(args.sql).toContain("SELECT");
    expect(args.sql).toContain("users");
  });

  it("includes priority for high-priority ticket", () => {
    const ticketTool = tools.find((t) => t.id === "create_ticket")!;
    const args = generateArgs(
      ticketTool,
      "Create a high priority ticket for the login bug",
    );
    expect(args.priority).toBe("high");
  });
});

describe("executeTool", () => {
  it("returns success result for valid tool", () => {
    const result = executeTool("get_weather", { city: "London", units: "celsius" }, false);
    expect(result.success).toBe(true);
    expect(result.output).toContain("London");
  });

  it("returns error when simulateError is true", () => {
    const result = executeTool("get_weather", { city: "London" }, true);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.length).toBeGreaterThan(0);
  });

  it("ticket creation returns ticket_id", () => {
    const result = executeTool(
      "create_ticket",
      { title: "Bug", description: "Something broke", priority: "high" },
      false,
    );
    expect(result.success).toBe(true);
    expect(result.output).toContain("TICKET");
  });

  it("search_docs returns results array in output", () => {
    const result = executeTool(
      "search_docs",
      { query: "vector databases" },
      false,
    );
    expect(result.success).toBe(true);
    expect(result.output).toContain("results");
  });
});
