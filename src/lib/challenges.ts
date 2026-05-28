import type { Challenge } from "@/components/shared/BreakItChallenges";
import type { ConceptSlug } from "@/types/concept";

const challengePresets: Record<string, Record<string, string | undefined>> = {
  "context-window": {
    c1: "lost-instructions",
    c2: "history-flood",
    c3: "context-overflow",
    c4: "summarization-helps",
  },
  "tool-calling": {
    c1: "bad-description",
    c2: "tool-error",
    c3: "need-approval",
    c4: "similar-tools",
  },
  embeddings: {
    c1: undefined,
    c2: undefined,
    c3: undefined,
  },
  "vector-search": {
    c1: undefined,
    c2: undefined,
    c3: undefined,
  },
  rag: {
    c1: "topk-low",
    c2: "context-overflow",
    c3: "too-much-noise",
    c4: "bad-chunking",
  },
  agents: {
    c1: "infinite-loop",
    c2: "wrong-tool",
    c3: undefined,
  },
  memory: {
    c1: "stale-memory",
    c2: "overflow-memory",
    c3: "deleted-memory",
  },
  mcp: {
    c1: "unreachable",
    c2: "tool-error",
    c3: "bad-descriptions",
  },
  "prompt-injection": {
    c1: "injected",
    c2: "hidden",
    c3: "tool-poison",
  },
  evaluation: {
    c1: "strict-fail",
    c2: "regression",
    c3: "all-passing",
  },
  guardrails: {
    c1: "no-input",
    c2: "no-output",
    c3: "locked",
  },
};

export function getChallenges(
  slug: ConceptSlug,
  tChallenge: (key: string) => string,
): Challenge[] {
  const slugKey = slug as string;
  const prefix = `challenges.${slugKey}`;
  const fourKeyConcepts = ["context-window", "rag", "tool-calling"] as string[];
  const keys = ["c1", "c2", "c3"];
  if (fourKeyConcepts.includes(slugKey)) {
    keys.push("c4");
  }

  return keys
    .map((key) => ({
      id: `${slugKey}-${key}`,
      text: tChallenge(`${prefix}.${key}`),
      presetId: challengePresets[slugKey]?.[key] ?? undefined,
    }))
    .filter((c) => c.text && !c.text.startsWith("BreakIt.challenges"));
}
