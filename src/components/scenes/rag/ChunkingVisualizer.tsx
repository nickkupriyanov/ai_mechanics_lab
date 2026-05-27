"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Chunk } from "@/lib/simulation/chunking";

type ChunkingVisualizerProps = {
  chunks: Chunk[];
  chunkSize: number;
};

const docColors: Record<string, string> = {
  "doc-vec-db": "#3b82f6",
  "doc-embedding": "#a78bfa",
  "doc-rag": "#f59e0b",
  "doc-context": "#22c55e",
  "doc-tool-calling": "#ef4444",
};

export function ChunkingVisualizer({ chunks, chunkSize }: ChunkingVisualizerProps) {
  const t = useTranslations("Rag.chunks");

  if (chunks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("title", { count: 0 })}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 py-8 text-sm text-muted">
          {t("noChunks")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: chunks.length })}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("chunkSize", { size: chunkSize })}
        </span>
      </div>
      <div className="max-h-[360px] overflow-y-auto p-4">
        <div className="space-y-2">
          {chunks.map((chunk) => {
            const color = docColors[chunk.documentId] || "#63636e";
            const tooSmall = chunkSize < 200 && chunk.tokens < 50;
            const tooLarge = chunkSize > 700 && chunk.tokens > 500;

            return (
              <motion.div
                key={chunk.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-md border border-border bg-surface-elevated p-3"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[12px] font-medium text-primary truncate">
                    {chunk.documentTitle}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-muted">
                    #{chunk.index}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-muted">
                    {chunk.tokens}t
                  </span>
                  {tooSmall && (
                    <span className="shrink-0 rounded border border-danger/30 px-1 py-0.5 text-[9px] font-mono text-danger">
                      {t("tooSmall")}
                    </span>
                  )}
                  {tooLarge && (
                    <span className="shrink-0 rounded border border-warning/30 px-1 py-0.5 text-[9px] font-mono text-warning">
                      {t("tooLarge")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-secondary line-clamp-3">
                  {chunk.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
