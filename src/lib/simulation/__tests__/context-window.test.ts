import { describe, it, expect } from "vitest";
import { buildContext } from "@/lib/simulation/context-window";

describe("buildContext", () => {
  it("includes system prompt and user query", () => {
    const ctx = buildContext(1000, 0, 0, false);
    const hasSystem = ctx.fittingBlocks.some((b) => b.id === "system");
    const hasQuery = ctx.fittingBlocks.some((b) => b.id === "query");
    expect(hasSystem).toBe(true);
    expect(hasQuery).toBe(true);
  });

  it("excludes blocks when context is too small", () => {
    const ctx = buildContext(50, 5, 5, false);
    expect(ctx.excludedBlocks.length).toBeGreaterThan(0);
  });

  it("includes all blocks with large context", () => {
    const ctx = buildContext(8000, 15, 5, false);
    expect(ctx.excludedBlocks.length).toBe(0);
  });

  it("summarization reduces history tokens", () => {
    const noSum = buildContext(2000, 8, 0, false);
    const withSum = buildContext(2000, 8, 0, true);

    // With summarization, more blocks should fit
    expect(withSum.tokensUsed).toBeLessThan(noSum.tokensUsed);
  });

  it("detects essential block exclusion", () => {
    // userQuery is essential, push it out with tiny context
    const ctx = buildContext(20, 0, 0, false);
    expect(ctx.hasEssentialExcluded).toBe(true);
  });

  it("user query is always last when fitting", () => {
    const ctx = buildContext(4000, 5, 0, false);
    const lastFitting = ctx.fittingBlocks[ctx.fittingBlocks.length - 1];
    expect(lastFitting.id).toBe("query");
  });

  it("hasEssentialExcluded is false when everything fits", () => {
    const ctx = buildContext(4000, 3, 0, false);
    expect(ctx.hasEssentialExcluded).toBe(false);
  });

  it("noise blocks are excluded with tight context", () => {
    const ctx = buildContext(300, 5, 5, false);
    const noiseExcluded = ctx.excludedBlocks.some((b) => b.type === "noise");
    expect(noiseExcluded).toBe(true);
  });
});
