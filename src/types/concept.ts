export type ConceptSlug =
  | "rag"
  | "embeddings"
  | "vector-search"
  | "context-window"
  | "tool-calling"
  | "agents"
  | "mcp"
  | "memory";

export type FutureConceptSlug = never;

export type ConceptLevel = "basics" | "knowledge" | "agentic" | "reliability";

export type ConceptStatus = "available" | "planned";

export type BaseConcept = {
  slug: string;
  title: string;
  shortDescription: string;
  level: ConceptLevel;
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
