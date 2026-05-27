import { estimateTokens } from "./token-counter";

export type Chunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  text: string;
  tokens: number;
  index: number;
};

export function chunkDocument(
  docId: string,
  docTitle: string,
  content: string,
  chunkSize: number,
  overlap: number,
): Chunk[] {
  const sentences = content.match(/[^.!?\n]+[.!?\n]+[\s)]*/g) || [content];
  const chunks: Chunk[] = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const candidate = currentChunk + sentence;

    if (estimateTokens(candidate) > chunkSize && currentChunk.length > 0) {
      chunks.push(buildChunk(docId, docTitle, currentChunk, chunkIndex));
      chunkIndex++;

      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.max(1, Math.floor(overlap / 4)));
      currentChunk = overlapWords.join(" ") + " " + sentence;
    } else {
      currentChunk = candidate;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(buildChunk(docId, docTitle, currentChunk, chunkIndex));
  }

  return chunks;
}

function buildChunk(
  docId: string,
  docTitle: string,
  text: string,
  index: number,
): Chunk {
  const trimmed = text.trim();
  return {
    id: `${docId}-chunk-${index}`,
    documentId: docId,
    documentTitle: docTitle,
    text: trimmed,
    tokens: estimateTokens(trimmed),
    index,
  };
}
