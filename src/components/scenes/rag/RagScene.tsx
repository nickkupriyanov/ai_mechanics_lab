"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRagStore } from "@/store/rag-store";
import { mockDocuments, generateAnswer } from "@/lib/simulation/rag-data";
import { chunkDocument } from "@/lib/simulation/chunking";
import { retrieveTopK, type ScoredChunk } from "@/lib/simulation/retrieval";
import { estimateTokens } from "@/lib/simulation/token-counter";
import { RagPipeline } from "./RagPipeline";
import { DocumentsPanel } from "./DocumentsPanel";
import { ChunkingVisualizer } from "./ChunkingVisualizer";
import { RetrievalPanel } from "./RetrievalPanel";
import { ContextPanel } from "./ContextPanel";
import { AnswerPanel } from "./AnswerPanel";
import { RagControls } from "./RagControls";

function getAnswerKey(
  query: string,
  fittingChunks: ScoredChunk[],
  excludedChunks: ScoredChunk[],
): string {
  if (fittingChunks.length === 0) return "noContext";

  const relevantCount = fittingChunks.filter((c) => c.isRelevant).length;
  const avgScore =
    fittingChunks.reduce((sum, c) => sum + c.score, 0) / fittingChunks.length;
  const hasNoise = fittingChunks.some((c) => !c.isRelevant && c.score > 0.3);
  const hasOverflow = excludedChunks.length > 0;

  if (relevantCount === 0 || avgScore < 0.2) return "noRelevant";
  if (hasNoise && relevantCount <= 1) return "partialNoisy";
  if (hasOverflow && relevantCount < 2) return "overflow";

  const q = query.toLowerCase();
  if (q.includes("chunk size") || q.includes("размер чанка") || q.includes("размером чанка")) return "chooseChunkSize";
  if (q.includes("rag") || q.includes("внедрения rag") || q.includes("практики rag")) return "ragBestPractices";
  if (q.includes("vector") || q.includes("векторн")) return "vectorSearch";
  if (q.includes("context window") || q.includes("overflow") || q.includes("контекстн") || q.includes("переполнени")) return "contextOverflow";
  if (q.includes("tool") || q.includes("define") || q.includes("инструмент") || q.includes("параметр")) return "toolCalling";
  if (q.includes("embedding") || q.includes("эмбеддинг") || q.includes("модел")) return "embeddingChoice";

  return "default";
}

export function RagScene() {
  const t = useTranslations("Shared");
  const tRag = useTranslations("Rag");
  const tAnswers = useTranslations("RagData.answers");
  const tdRag = useTranslations("RagData.documents");
  const { chunkSize, chunkOverlap, topK, contextLimit, noiseLevel, userQuery } =
    useRagStore();

  const simulation = useMemo(() => {
    const allChunks = mockDocuments.flatMap((doc) => {
      const translatedContent = tdRag(`${doc.id}.content`) || doc.content;
      const translatedTitle = tdRag(`${doc.id}.title`) || doc.title;
      return chunkDocument(doc.id, translatedTitle, translatedContent, chunkSize, chunkOverlap);
    });

    const retrieved = retrieveTopK(userQuery, allChunks, topK, noiseLevel);

    let tokensUsed = 0;
    const fittingChunks: typeof retrieved = [];
    const excludedChunks: typeof retrieved = [];

    for (const chunk of retrieved) {
      if (tokensUsed + chunk.tokens <= contextLimit) {
        fittingChunks.push(chunk);
        tokensUsed += chunk.tokens;
      } else {
        excludedChunks.push(chunk);
      }
    }

    const answerKey = getAnswerKey(userQuery, fittingChunks, excludedChunks);
    const answer = tAnswers(answerKey) || generateAnswer(userQuery, fittingChunks, excludedChunks);

    const systemPrompt = tRag("systemPrompt");
    const contextText = fittingChunks.map((c) => c.text).join("\n\n");
    const promptTokens = estimateTokens(systemPrompt) + estimateTokens(userQuery) + tokensUsed;

    return {
      allChunks,
      retrieved,
      fittingChunks,
      excludedChunks,
      tokensUsed,
      answer,
      promptTokens,
      systemPrompt,
      contextText,
    };
  }, [chunkSize, chunkOverlap, topK, contextLimit, noiseLevel, userQuery, tRag, tAnswers, tdRag]);

  const quality = simulation.fittingChunks.length === 0 ||
    simulation.fittingChunks.filter(c => c.isRelevant).length === 0 ? "low" : "good";

  return (
    <div className="space-y-6">
      {/* Pipeline */}
      <RagPipeline
        docCount={mockDocuments.length}
        chunkCount={simulation.allChunks.length}
        retrievalCount={simulation.retrieved.length}
        fittingCount={simulation.fittingChunks.length}
        excludedCount={simulation.excludedChunks.length}
        hasAnswer={simulation.answer.length > 0}
      />

      {/* Main content: left panels + right controls */}
      <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
        {/* Left: simulation panels */}
        <div className="space-y-4 min-w-0">
          <DocumentsPanel />
          <ChunkingVisualizer
            chunks={simulation.allChunks}
            chunkSize={chunkSize}
          />
          <RetrievalPanel
            retrieved={simulation.retrieved}
            topK={topK}
          />
          <ContextPanel
            fittingChunks={simulation.fittingChunks}
            excludedChunks={simulation.excludedChunks}
            tokensUsed={simulation.tokensUsed}
            contextLimit={contextLimit}
          />
          <AnswerPanel answer={simulation.answer} query={userQuery} quality={quality} />
        </div>

        {/* Right: controls */}
        <div className="space-y-4">
          <RagControls />

          {/* Prompt preview */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                {t("promptPreview")}
              </span>
              <span className="text-[10px] font-mono text-muted">
                {t("estimatedTokens", { tokens: simulation.promptTokens })}
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-4">
              <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-secondary font-mono">
                <span className="text-muted">{t("systemLabel")}</span>
                {"\n"}{simulation.systemPrompt}
                {"\n\n"}<span className="text-muted">{t("contextLabel", { count: simulation.fittingChunks.length })}</span>
                {simulation.fittingChunks.length > 0 ? (
                  <>
                    {"\n"}{simulation.contextText.slice(0, 600)}
                    {simulation.contextText.length > 600 && (
                      <span className="text-muted">{"\n"}{t("truncated")}</span>
                    )}
                  </>
                ) : (
                  <span className="text-muted">{"\n"}{t("noContext")}</span>
                )}
                {"\n\n"}<span className="text-muted">{t("userLabel")}</span>
                {"\n"}{userQuery}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
