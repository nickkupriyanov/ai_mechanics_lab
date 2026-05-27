import { describe, it, expect } from "vitest";
import {
  euclideanDistance,
  cosineSimilarity,
  keywordSimilarity,
  distanceToSimilarity,
  phrases,
} from "@/lib/simulation/embeddings";

describe("euclideanDistance", () => {
  it("returns 0 for same point", () => {
    const p = phrases[0];
    expect(euclideanDistance(p, p)).toBe(0);
  });

  it("returns positive distance for different points", () => {
    const a = phrases[0];
    const b = phrases[10];
    expect(euclideanDistance(a, b)).toBeGreaterThan(0);
  });

  it("phrases in same cluster are closer than different clusters", () => {
    const ai1 = phrases[0]; // neural network
    const ai2 = phrases[3]; // language model
    const travel = phrases[12]; // book a flight

    const sameCluster = euclideanDistance(ai1, ai2);
    const diffCluster = euclideanDistance(ai1, travel);

    expect(sameCluster).toBeLessThan(diffCluster);
  });
});

describe("cosineSimilarity", () => {
  it("returns 1 for same point", () => {
    const p = phrases[0];
    expect(cosineSimilarity(p, p)).toBeCloseTo(1, 4);
  });

  it("returns value between 0 and 1 for coordinates in [0,1]", () => {
    const a = phrases[0];
    const b = phrases[10];
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThanOrEqual(0);
    expect(sim).toBeLessThanOrEqual(1);
  });

  it("higher for same-cluster phrases", () => {
    const ai1 = phrases[0];
    const ai2 = phrases[3];
    const travel = phrases[12];

    const sameCluster = cosineSimilarity(ai1, ai2);
    const diffCluster = cosineSimilarity(ai1, travel);
    expect(sameCluster).toBeGreaterThan(diffCluster);
  });
});

describe("keywordSimilarity", () => {
  it("returns 1 for identical phrases", () => {
    const p = phrases[0];
    expect(keywordSimilarity(p, p)).toBe(1);
  });

  it("returns 0 for completely different phrases", () => {
    const a = phrases[0]; // neural network
    const b = phrases[24]; // chocolate cake
    const sim = keywordSimilarity(a, b);
    expect(sim).toBeLessThan(0.1);
  });

  it("semantically close phrases may have low keyword similarity", () => {
    const ai1 = phrases[0]; // neural network
    const ai2 = phrases[3]; // language model
    // Same cluster but different words
    const keySim = keywordSimilarity(ai1, ai2);
    const semSim = distanceToSimilarity(euclideanDistance(ai1, ai2), Math.sqrt(2));
    // Keyword similarity should be much lower than semantic
    expect(keySim).toBeLessThan(semSim);
  });
});

describe("distanceToSimilarity", () => {
  it("returns 1 for distance 0", () => {
    expect(distanceToSimilarity(0, Math.sqrt(2))).toBe(1);
  });

  it("returns 0 for distance >= maxDistance", () => {
    expect(distanceToSimilarity(Math.sqrt(2), Math.sqrt(2))).toBe(0);
    expect(distanceToSimilarity(2, Math.sqrt(2))).toBe(0);
  });
});
