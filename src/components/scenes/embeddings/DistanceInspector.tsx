"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useEmbeddingsStore } from "@/store/embeddings-store";
import {
  phrases,
  euclideanDistance,
  cosineSimilarity,
  keywordSimilarity,
  distanceToSimilarity,
} from "@/lib/simulation/embeddings";

const MAX_DIST = Math.sqrt(2); // normalized space diagonal

export function DistanceInspector() {
  const t = useTranslations("Shared");
  const tEmb = useTranslations("Embeddings");
  const selectedPhraseIds = useEmbeddingsStore((s) => s.selectedPhraseIds);
  const viewMode = useEmbeddingsStore((s) => s.viewMode);

  const phraseMap = useMemo(
    () => new Map(phrases.map((p) => [p.id, p])),
    [],
  );

  const a = selectedPhraseIds[0] ? phraseMap.get(selectedPhraseIds[0]) : null;
  const b = selectedPhraseIds[1] ? phraseMap.get(selectedPhraseIds[1]) : null;

  if (!a || !b) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("distanceInspector")}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 py-10 text-center text-[12px] text-muted">
          {t("chooseTwo")}
        </div>
      </div>
    );
  }

  const distance = euclideanDistance(a, b);
  const cosSim = cosineSimilarity(a, b);
  const keySim = keywordSimilarity(a, b);

  const displaySimilarity =
    viewMode === "semantic"
      ? distanceToSimilarity(distance, MAX_DIST)
      : keySim;

  const areSameCluster = a.topic === b.topic;

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("distanceInspector")}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {viewMode === "semantic" ? tEmb("semanticSimilarity") : tEmb("keywordSimilarity")}
        </span>
      </div>
      <div className="space-y-4 p-4">
        {/* Selected pair */}
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-md border border-accent/30 bg-accent/5 p-2.5">
            <span className="text-[9px] font-mono uppercase text-accent">A</span>
            <p className="mt-0.5 text-[12px] font-medium text-primary">{a.text}</p>
            <p className="text-[10px] text-muted">{tEmb(`topic_${a.topic}`)}</p>
          </div>
          <svg className="h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <div className="flex-1 rounded-md border border-accent/30 bg-accent/5 p-2.5">
            <span className="text-[9px] font-mono uppercase text-accent">B</span>
            <p className="mt-0.5 text-[12px] font-medium text-primary">{b.text}</p>
            <p className="text-[10px] text-muted">{tEmb(`topic_${b.topic}`)}</p>
          </div>
        </div>

        {/* Distance values */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-border bg-surface-elevated px-3 py-2">
            <span className="text-[11px] text-muted">{tEmb("euclideanDistance")}</span>
            <span className="font-mono text-[12px] tabular-nums text-primary">
              {distance.toFixed(3)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-surface-elevated px-3 py-2">
            <span className="text-[11px] text-muted">{tEmb("cosineSimilarity")}</span>
            <span className="font-mono text-[12px] tabular-nums text-primary">
              {cosSim.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Active similarity bar */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
              {viewMode === "semantic" ? tEmb("semanticSimilarity") : tEmb("similarityBarLexical")}
            </span>
            <span
              className="font-mono text-[12px] font-medium tabular-nums"
              style={{
                color:
                  displaySimilarity > 0.6
                    ? "var(--color-success)"
                    : displaySimilarity > 0.3
                      ? "var(--color-warning)"
                      : "var(--color-danger)",
              }}
            >
              {(displaySimilarity * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${displaySimilarity * 100}%`,
                backgroundColor:
                  displaySimilarity > 0.6
                    ? "var(--color-success)"
                    : displaySimilarity > 0.3
                      ? "var(--color-warning)"
                      : "var(--color-danger)",
              }}
            />
          </div>
        </div>

        {/* Interesting observations */}
        <div className="space-y-1.5 rounded-md border border-border bg-surface-elevated p-3">
          <p className="text-[11px] text-secondary">
            {areSameCluster
              ? tEmb("sameCluster", { topic: tEmb(`topic_${a.topic}`) })
              : tEmb("diffCluster", { a: tEmb(`topic_${a.topic}`), b: tEmb(`topic_${b.topic}`) })}
          </p>
          {areSameCluster && viewMode === "keyword" && keySim < 0.2 && (
            <p className="text-[11px] text-warning/80">
              {tEmb("keywordMismatch")}
            </p>
          )}
          {!areSameCluster && viewMode === "semantic" && distanceToSimilarity(distance, MAX_DIST) > 0.3 && (
            <p className="text-[11px] text-info/80">
              {tEmb("spatialProximity")}
            </p>
          )}
          {!areSameCluster && viewMode === "keyword" && keySim > 0.15 && (
            <p className="text-[11px] text-warning/80">
              {tEmb("keywordFalsePositive")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
