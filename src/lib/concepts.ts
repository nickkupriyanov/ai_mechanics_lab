import type { Concept, ConceptSlug } from "@/types/concept";

export const concepts: Concept[] = [
  {
    slug: "rag",
    title: "RAG",
    shortDescription:
      "Retrieval-Augmented Generation lets AI answer using external documents by searching for relevant chunks and inserting them into the model's context.",
    level: "knowledge",
    status: "available",
    color: "#f59e0b",
    relatedConcepts: ["embeddings", "vector-search", "context-window"],
  },
  {
    slug: "embeddings",
    title: "Embeddings",
    shortDescription:
      "Embeddings represent text as points in semantic space. Words with similar meaning end up close together, even if they use different words.",
    level: "basics",
    status: "available",
    color: "#a78bfa",
    relatedConcepts: ["rag", "vector-search"],
  },
  {
    slug: "vector-search",
    title: "Vector Search",
    shortDescription:
      "Vector search finds nearest neighbors in embedding space. It retrieves similar items, not guaranteed correct answers.",
    level: "basics",
    status: "available",
    color: "#3b82f6",
    relatedConcepts: ["rag", "embeddings"],
  },
  {
    slug: "context-window",
    title: "Context Window",
    shortDescription:
      "The model only sees what fits into the current context. When it overflows, important instructions and data get pushed out.",
    level: "knowledge",
    status: "available",
    color: "#22c55e",
    relatedConcepts: ["rag", "tool-calling"],
  },
  {
    slug: "tool-calling",
    title: "Tool Calling",
    shortDescription:
      "The model selects predefined tools and generates structured arguments. The application executes the tool — the model does not act on its own.",
    level: "agentic",
    status: "available",
    color: "#ef4444",
    relatedConcepts: ["context-window"],
  },
  {
    slug: "agents",
    title: "Agents",
    shortDescription:
      "Agents run in a loop: goal, plan, tool call, observation, reflection, next step. Without proper constraints, they can loop forever.",
    level: "agentic",
    status: "planned",
    color: "#ec4899",
    relatedConcepts: ["tool-calling", "memory"],
  },
  {
    slug: "mcp",
    title: "MCP",
    shortDescription:
      "Model Context Protocol is a standard bridge between AI clients and external tools. It standardizes how AI discovers and uses capabilities.",
    level: "agentic",
    status: "planned",
    color: "#14b8a6",
    relatedConcepts: ["tool-calling", "agents"],
  },
  {
    slug: "memory",
    title: "Memory",
    shortDescription:
      "Memory is stored information retrieved later into the context. It is not the same as the model permanently knowing something.",
    level: "agentic",
    status: "planned",
    color: "#8b5cf6",
    relatedConcepts: ["context-window", "agents"],
  },
];

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getAvailableConcepts(): Concept[] {
  return concepts.filter((c) => c.status === "available");
}

export function getPlannedConcepts(): Concept[] {
  return concepts.filter((c) => c.status === "planned");
}

export function getRelatedConcepts(slug: ConceptSlug): Concept[] {
  const concept = getConcept(slug);
  if (!concept) return [];
  return concept.relatedConcepts
    .map((s) => getConcept(s))
    .filter((c): c is Concept => c !== undefined);
}

export function getConceptBySlugSafe(slug: string): ConceptSlug | null {
  const valid = concepts.find(
    (c): c is Concept & { status: "available" } =>
      c.status === "available" && c.slug === slug
  );
  return valid ? (valid.slug as ConceptSlug) : null;
}
