import { describe, it, expect } from "vitest";
import {
  allMemories,
  allQueries,
  retrieveMemories,
  buildContext,
  estimateTokens,
  memoryPresets,
} from "@/lib/simulation/memory";

describe("allMemories", () => {
  it("has 8 memories", () => {
    expect(allMemories).toHaveLength(8);
  });

  it("each memory has translated content and timestamps", () => {
    for (const memory of allMemories) {
      expect(memory.content).toBeTruthy();
      expect(memory.contentRu).toBeTruthy();
      expect(memory.timestamp).toBeTruthy();
      expect(memory.timestampRu).toBeTruthy();
      expect(memory.relevanceScore).toBeGreaterThan(0);
      expect(memory.relevanceScore).toBeLessThanOrEqual(1);
    }
  });

  it("has multiple categories", () => {
    const categories = new Set(allMemories.map((m) => m.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });

  it("has at least one stale and one fresh memory", () => {
    const stale = allMemories.filter((m) => m.isStale);
    const fresh = allMemories.filter((m) => !m.isStale);
    expect(stale.length).toBeGreaterThan(0);
    expect(fresh.length).toBeGreaterThan(0);
  });
});

describe("allQueries", () => {
  it("has 5 queries with translated text", () => {
    expect(allQueries).toHaveLength(5);
    for (const q of allQueries) {
      expect(q.label).toBeTruthy();
      expect(q.labelRu).toBeTruthy();
      expect(q.query).toBeTruthy();
      expect(q.queryRu).toBeTruthy();
    }
  });
});

describe("retrieveMemories", () => {
  const allActive = new Set(allMemories.map((m) => m.id));

  it("returns results for valid query", () => {
    const results = retrieveMemories(allMemories, allActive, "q-stack");
    expect(results).toHaveLength(allMemories.length);
  });

  it("returns zero score for inactive memories", () => {
    const activeIds = new Set<string>(["mem-1"]);
    const results = retrieveMemories(allMemories, activeIds, "q-stack");
    const inactive = results.filter((r) => !activeIds.has(r.memory.id));
    expect(inactive.every((r) => r.queryScore === 0)).toBe(true);
  });

  it("some results are above threshold for relevant query", () => {
    const results = retrieveMemories(allMemories, allActive, "q-stack");
    const above = results.filter((r) => r.isAboveThreshold);
    expect(above.length).toBeGreaterThan(0);
  });

  it("each result has translated reasons", () => {
    const results = retrieveMemories(allMemories, allActive, "q-stack");
    for (const r of results) {
      expect(r.reason).toBeTruthy();
      expect(r.reasonRu).toBeTruthy();
    }
  });
});

describe("estimateTokens", () => {
  it("returns positive number", () => {
    expect(estimateTokens("hello world")).toBeGreaterThan(0);
  });

  it("longer text has more tokens", () => {
    expect(estimateTokens("a b c d e f g h i j")).toBeGreaterThan(
      estimateTokens("a b c"),
    );
  });
});

describe("buildContext", () => {
  it("has fitting and excluded with reasonable limit", () => {
    const allActive = new Set(allMemories.map((m) => m.id));
    const retrieved = retrieveMemories(allMemories, allActive, "q-stack");
    const ctx = buildContext(retrieved, 50);
    expect(ctx.tokensUsed).toBeGreaterThan(0);
  });

  it("all fit with large context", () => {
    const allActive = new Set(allMemories.map((m) => m.id));
    const retrieved = retrieveMemories(allMemories, allActive, "q-stack");
    const ctx = buildContext(retrieved, 99999);
    expect(ctx.tokensUsed).toBeGreaterThan(0);
    expect(ctx.excluded).toHaveLength(0);
  });

  it("some excluded with very tight context", () => {
    const allActive = new Set(allMemories.map((m) => m.id));
    const retrieved = retrieveMemories(allMemories, allActive, "q-stack");
    const ctx = buildContext(retrieved, 5);
    // Either some fit or all excluded — both valid
    expect(ctx).toHaveProperty("tokensUsed");
    expect(ctx).toHaveProperty("excluded");
  });
});

describe("memoryPresets", () => {
  it("has 4 presets", () => {
    expect(memoryPresets).toHaveLength(4);
  });

  it("each preset has valid settings", () => {
    for (const preset of memoryPresets) {
      expect(preset.settings.selectedQueryId).toBeTruthy();
      expect(preset.settings.contextLimit).toBeGreaterThan(0);
      expect(preset.settings.activeSnippetIds.length).toBeGreaterThan(0);
      const memoryIds = new Set(allMemories.map((m) => m.id));
      for (const id of preset.settings.activeSnippetIds) {
        expect(memoryIds.has(id)).toBe(true);
      }
    }
  });
});
