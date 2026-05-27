import { describe, it, expect } from "vitest";
import { estimateTokens } from "@/lib/simulation/token-counter";

describe("estimateTokens", () => {
  it("estimates ~1 token per 4 characters", () => {
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("abcdefgh")).toBe(2);
    expect(estimateTokens("")).toBe(0);
  });

  it("rounds up for partial tokens", () => {
    expect(estimateTokens("abcde")).toBe(2);
    expect(estimateTokens("a")).toBe(1);
  });

  it("handles long text", () => {
    const text = "Hello world! ".repeat(100);
    const expected = Math.ceil(text.length / 4);
    expect(estimateTokens(text)).toBe(expected);
  });
});
