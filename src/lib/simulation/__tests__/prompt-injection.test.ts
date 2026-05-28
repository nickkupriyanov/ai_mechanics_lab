import { describe, it, expect } from "vitest";
import {
  documents,
  queries,
  systemPrompt,
  getModelResponse,
  isInjectionDetected,
  injectionPresets,
} from "@/lib/simulation/prompt-injection";

describe("documents", () => {
  it("has 5 documents", () => {
    expect(documents).toHaveLength(5);
  });

  it("has at least one poisoned and one clean document", () => {
    const poisoned = documents.filter((d) => d.isPoisoned);
    const clean = documents.filter((d) => !d.isPoisoned);
    expect(poisoned.length).toBeGreaterThan(0);
    expect(clean.length).toBeGreaterThan(0);
  });

  it("poisoned documents have injectionType", () => {
    const poisoned = documents.filter((d) => d.isPoisoned);
    for (const doc of poisoned) {
      expect(doc.injectionType).toBeDefined();
    }
  });
});

describe("queries", () => {
  it("has at least 3 queries", () => {
    expect(queries.length).toBeGreaterThanOrEqual(3);
  });

  it("each query has translated labels and query text", () => {
    for (const q of queries) {
      expect(q.label).toBeTruthy();
      expect(q.labelRu).toBeTruthy();
      expect(q.query).toBeTruthy();
      expect(q.queryRu).toBeTruthy();
    }
  });
});

describe("systemPrompt", () => {
  it("has EN and RU versions", () => {
    expect(systemPrompt.en).toBeTruthy();
    expect(systemPrompt.ru).toBeTruthy();
  });
});

describe("getModelResponse", () => {
  it("returns response object with different content for different params", () => {
    const a = getModelResponse({
      queryId: "q-support",
      isEnglish: true,
      enableHierarchy: false,
      enableSanitization: false,
      poisonedDocActive: false,
      attackType: "ignore-instructions",
    });
    expect(a).toHaveProperty("response");
    expect(a.response).toBeTruthy();
  });

  it("safe response differs from injected response", () => {
    const safe = getModelResponse({
      queryId: "q-support",
      isEnglish: true,
      enableHierarchy: false,
      enableSanitization: false,
      poisonedDocActive: false,
      attackType: "ignore-instructions",
    });
    const injected = getModelResponse({
      queryId: "q-support",
      isEnglish: true,
      enableHierarchy: false,
      enableSanitization: false,
      poisonedDocActive: true,
      attackType: "ignore-instructions",
    });
    expect(safe.response).not.toBe(injected.response);
  });
});

describe("isInjectionDetected", () => {
  it("detects injection with poisoned doc and no safety", () => {
    expect(
      isInjectionDetected({
        poisonedDocActive: true,
        enableHierarchy: false,
        enableSanitization: false,
      }),
    ).toBe(true);
  });

  it("does not detect injection when no poisoned doc", () => {
    expect(
      isInjectionDetected({
        poisonedDocActive: false,
        enableHierarchy: false,
        enableSanitization: false,
      }),
    ).toBe(false);
  });

  it("does not detect injection with hierarchy active", () => {
    expect(
      isInjectionDetected({
        poisonedDocActive: true,
        enableHierarchy: true,
        enableSanitization: false,
      }),
    ).toBe(false);
  });
});

describe("injectionPresets", () => {
  it("has 4 presets", () => {
    expect(injectionPresets).toHaveLength(4);
  });

  it("'safe' preset has no poisoned doc", () => {
    const preset = injectionPresets.find((p) => p.id === "safe");
    expect(preset).toBeDefined();
    expect(preset!.settings.poisonedDocActive).toBe(false);
  });

  it("'injected' preset has poisoned doc active", () => {
    const preset = injectionPresets.find((p) => p.id === "injected");
    expect(preset).toBeDefined();
    expect(preset!.settings.poisonedDocActive).toBe(true);
  });

  it("'hidden' preset has poisoned doc active", () => {
    const preset = injectionPresets.find((p) => p.id === "hidden");
    expect(preset).toBeDefined();
    expect(preset!.settings.poisonedDocActive).toBe(true);
  });
});
