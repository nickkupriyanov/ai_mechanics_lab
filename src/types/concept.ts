export type ConceptSlug =
  | "rag"
  | "embeddings"
  | "vector-search"
  | "context-window"
  | "tool-calling"
  | "agents"
  | "mcp"
  | "memory"
  | "prompt-injection"
  | "evaluation";

export type FutureConceptSlug = never;

export type ConceptLevel = "basics" | "knowledge" | "agentic" | "reliability";

export type ConceptGroup = "basics" | "knowledge" | "agentic" | "reliability";

export type ConceptStatus = "available" | "planned";

export type BaseConcept = {
  slug: string;
  title: string;
  shortDescription: string;
  level: ConceptLevel;
  group: ConceptGroup;
  order: number;
  status: ConceptStatus;
  color: string;
};

export type AvailableConcept = BaseConcept & {
  slug: ConceptSlug;
  status: "available";
  relatedConcepts: ConceptSlug[];
};

export type PlannedConcept = BaseConcept & {
  slug: FutureConceptSlug;
  status: "planned";
  relatedConcepts: (ConceptSlug | FutureConceptSlug)[];
};

export type Concept = AvailableConcept | PlannedConcept;
