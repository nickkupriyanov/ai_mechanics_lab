"use client";

import { useMemo } from "react";
import { phrases, euclideanDistance, distanceToSimilarity } from "@/lib/simulation/embeddings";
import { useVectorSearchStore } from "@/store/vector-search-store";
import { SemanticMap } from "@/components/shared/SemanticMap";
import { SearchResults } from "./SearchResults";
import { SimilarityControls } from "./SimilarityControls";

const MAX_DIST = Math.sqrt(2);

export function VectorSearchScene() {
  const queryId = useVectorSearchStore((s) => s.queryId);
  const topK = useVectorSearchStore((s) => s.topK);
  const threshold = useVectorSearchStore((s) => s.threshold);
  const setQueryId = useVectorSearchStore((s) => s.setQueryId);

  const query = useMemo(
    () => phrases.find((p) => p.id === queryId) ?? phrases[0],
    [queryId],
  );

  const neighborIds = useMemo(() => {
    const others = phrases.filter((p) => p.id !== query.id);
    return others
      .map((p) => ({
        id: p.id,
        similarity: distanceToSimilarity(euclideanDistance(query, p), MAX_DIST),
      }))
      .filter((r) => r.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map((r) => r.id);
  }, [query, topK, threshold]);

  return (
    <div className="space-y-6">
      <SemanticMap
        phrases={phrases}
        queryId={queryId}
        neighborIds={neighborIds}
        onPhraseClick={setQueryId}
        showLabels
      />

      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 min-w-0">
          <SearchResults />
        </div>
        <div className="space-y-4">
          <SimilarityControls />
        </div>
      </div>
    </div>
  );
}
