"use client";

import { phrases } from "@/lib/simulation/embeddings";
import { useEmbeddingsStore } from "@/store/embeddings-store";
import { SemanticMap } from "@/components/shared/SemanticMap";
import { PhraseList } from "./PhraseList";
import { DistanceInspector } from "./DistanceInspector";
import { EmbeddingsControls } from "./EmbeddingsControls";

export function EmbeddingsScene() {
  const selectedPhraseIds = useEmbeddingsStore((s) => s.selectedPhraseIds);
  const togglePhrase = useEmbeddingsStore((s) => s.togglePhrase);

  return (
    <div className="space-y-6">
      <SemanticMap
        phrases={phrases}
        highlightedIds={selectedPhraseIds}
        onPhraseClick={togglePhrase}
        showLabels
      />

      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 min-w-0">
          <PhraseList />
        </div>
        <div className="space-y-4">
          <DistanceInspector />
          <EmbeddingsControls />
        </div>
      </div>
    </div>
  );
}
