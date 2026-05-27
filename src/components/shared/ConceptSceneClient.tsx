"use client";

import { RagScene } from "@/components/scenes/rag/RagScene";
import { EmbeddingsScene } from "@/components/scenes/embeddings/EmbeddingsScene";
import { VectorSearchScene } from "@/components/scenes/vector-search/VectorSearchScene";
import { ContextWindowScene } from "@/components/scenes/context-window/ContextWindowScene";
import { ToolCallingScene } from "@/components/scenes/tool-calling/ToolCallingScene";
import { SceneShell } from "@/components/shared/SceneShell";
import type { ConceptSlug } from "@/types/concept";

type ConceptSceneClientProps = {
  slug: ConceptSlug;
  title: string;
};

export function ConceptSceneClient({ slug, title }: ConceptSceneClientProps) {
  switch (slug) {
    case "rag":
      return <RagScene />;
    case "embeddings":
      return <EmbeddingsScene />;
    case "vector-search":
      return <VectorSearchScene />;
    case "context-window":
      return <ContextWindowScene />;
    case "tool-calling":
      return <ToolCallingScene />;
  }

  return (
    <SceneShell title="Interactive Scene" simplified>
      <div className="bp-grid-dense flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-10 text-center">
        <div className="mb-3 rounded-full border border-border p-3">
          <svg
            className="h-6 w-6 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-secondary">
          Interactive scene coming soon
        </p>
        <p className="mt-1 text-[13px] text-muted">
          Controls, visualizations, and failure modes for {title} are in development.
        </p>
      </div>
    </SceneShell>
  );
}
