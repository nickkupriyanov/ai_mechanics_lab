import { describe, it, expect } from "vitest";
import { retrieveTopK } from "@/lib/simulation/retrieval";
import type { Chunk } from "@/lib/simulation/chunking";

const mockChunks: Chunk[] = [
  { id: "c1", documentId: "d1", documentTitle: "RAG Guide", text: "RAG combines retrieval with generation for better answers.", tokens: 10, index: 0 },
  { id: "c2", documentId: "d1", documentTitle: "RAG Guide", text: "Chunk size is critical for retrieval quality.", tokens: 10, index: 1 },
  { id: "c3", documentId: "d2", documentTitle: "Weather API", text: "Get weather data for any city in the world.", tokens: 10, index: 0 },
  { id: "c4", documentId: "d3", documentTitle: "Database Guide", text: "PostgreSQL connection pooling best practices.", tokens: 10, index: 0 },
  { id: "c5", documentId: "d1", documentTitle: "RAG Guide", text: "Vector search finds similar embeddings quickly.", tokens: 10, index: 2 },
];

describe("retrieveTopK", () => {
  it("returns at most topK chunks", () => {
    const result = retrieveTopK("chunk size retrieval", mockChunks, 2, 0);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("returns chunks sorted by relevance score (descending)", () => {
    const result = retrieveTopK("chunk size retrieval quality", mockChunks, 5, 0);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].score).toBeLessThanOrEqual(result[i - 1].score);
    }
  });

  it("returns relevant chunks for matching query", () => {
    const result = retrieveTopK("postgresql connection pool", mockChunks, 3, 0);
    expect(result[0].documentId).toBe("d3");
    expect(result[0].score).toBeGreaterThan(0);
  });

  it("marks chunks with keyword match as relevant", () => {
    const result = retrieveTopK("chunk size is critical", mockChunks, 5, 0);
    const relevant = result.filter((r) => r.isRelevant);
    expect(relevant.length).toBeGreaterThan(0);
  });

  it("noise adds random variation to scores", () => {
    const noNoise = retrieveTopK("test query", mockChunks, 5, 0);
    const withNoise = retrieveTopK("test query", mockChunks, 5, 0.5);

    // With noise, scores should differ from no-noise version
    const allSame = noNoise.every(
      (chunk, i) => chunk.score === withNoise[i].score,
    );
    expect(allSame).toBe(false);
  });

  it("handles empty chunks array", () => {
    const result = retrieveTopK("anything", [], 5, 0);
    expect(result).toHaveLength(0);
  });

  it("handles topK larger than available chunks", () => {
    const result = retrieveTopK("test", mockChunks, 100, 0);
    expect(result.length).toBe(mockChunks.length);
  });

  it("scores are between 0 and 1", () => {
    const result = retrieveTopK("chunk size retrieval", mockChunks, 5, 0.3);
    for (const chunk of result) {
      expect(chunk.score).toBeGreaterThanOrEqual(0);
      expect(chunk.score).toBeLessThanOrEqual(1);
    }
  });
});
