import type { Chunk } from "./chunking";

export type ScoredChunk = Chunk & {
  score: number;
  isRelevant: boolean;
};

function keywordMatch(query: string, chunkText: string): number {
  const queryLower = query.toLowerCase();
  const textLower = chunkText.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 3);

  if (queryWords.length === 0) return 0;

  let matches = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) matches++;
  }

  return matches / queryWords.length;
}

export function retrieveTopK(
  query: string,
  chunks: Chunk[],
  topK: number,
  noiseLevel: number,
): ScoredChunk[] {
  return chunks
    .map((chunk) => {
      const baseScore = keywordMatch(query, chunk.text);
      const noise =
        noiseLevel > 0
          ? Math.abs(Math.sin(chunk.id.charCodeAt(0) * 7.3 + chunk.index * 2.1)) *
            noiseLevel
          : 0;
      const score = Math.max(0, Math.min(1, baseScore * (1 - noiseLevel) + noise));
      return {
        ...chunk,
        score,
        isRelevant: baseScore > 0.2,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
