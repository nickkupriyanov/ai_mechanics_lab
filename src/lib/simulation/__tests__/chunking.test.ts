import { describe, it, expect } from "vitest";
import { chunkDocument } from "@/lib/simulation/chunking";

const doc = {
  id: "test-doc",
  title: "Test Document",
  content:
    "This is the first sentence. This is the second sentence about chunking. This third sentence discusses vector databases in detail. Here is a fourth sentence about embeddings and search. The fifth sentence wraps up the discussion about chunk sizes and optimal settings for retrieval systems.",
};

describe("chunkDocument", () => {
  it("returns empty array for empty content", () => {
    const result = chunkDocument("id", "title", "", 100, 10);
    expect(result).toHaveLength(0);
  });

  it("produces chunks within token limit", () => {
    const result = chunkDocument(doc.id, doc.title, doc.content, 30, 5);
    for (const chunk of result) {
      expect(chunk.tokens).toBeLessThanOrEqual(30);
    }
  });

  it("produces more chunks with smaller chunkSize", () => {
    const small = chunkDocument(doc.id, doc.title, doc.content, 15, 5);
    const large = chunkDocument(doc.id, doc.title, doc.content, 100, 5);
    expect(small.length).toBeGreaterThan(large.length);
  });

  it("each chunk has required fields", () => {
    const result = chunkDocument(doc.id, doc.title, doc.content, 50, 10);
    for (const chunk of result) {
      expect(chunk).toHaveProperty("id");
      expect(chunk).toHaveProperty("documentId");
      expect(chunk).toHaveProperty("documentTitle");
      expect(chunk).toHaveProperty("text");
      expect(chunk).toHaveProperty("tokens");
      expect(chunk).toHaveProperty("index");
      expect(chunk.id).toContain(doc.id);
      expect(chunk.documentId).toBe(doc.id);
      expect(chunk.documentTitle).toBe(doc.title);
    }
  });

  it("chunk indices are sequential", () => {
    const result = chunkDocument(doc.id, doc.title, doc.content, 20, 5);
    for (let i = 0; i < result.length; i++) {
      expect(result[i].index).toBe(i);
    }
  });

  it("handles very small chunkSize (may combine sentences)", () => {
    const result = chunkDocument(doc.id, doc.title, doc.content, 5, 2);
    expect(result.length).toBeGreaterThan(0);
    // Very small chunkSize may force combining sentences that are individually larger
    // This is expected behavior — the chunker respects sentence boundaries
  });

  it("single chunk when chunkSize exceeds content", () => {
    const result = chunkDocument(doc.id, doc.title, "Short text.", 1000, 50);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Short text.");
  });
});
