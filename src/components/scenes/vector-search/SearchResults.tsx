"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { phrases, euclideanDistance, distanceToSimilarity } from "@/lib/simulation/embeddings";
import { useVectorSearchStore } from "@/store/vector-search-store";

const MAX_DIST = Math.sqrt(2);

export function SearchResults() {
  const t = useTranslations("VectorSearch");
  const tEmb = useTranslations("Embeddings");
  const tShared = useTranslations("Shared");
  const queryId = useVectorSearchStore((s) => s.queryId);
  const topK = useVectorSearchStore((s) => s.topK);
  const threshold = useVectorSearchStore((s) => s.threshold);

  const query = useMemo(() => phrases.find((p) => p.id === queryId) ?? phrases[0], [queryId]);

  const results = useMemo(() => {
    const others = phrases.filter((p) => p.id !== query.id);
    return others
      .map((p) => {
        const dist = euclideanDistance(query, p);
        const sim = distanceToSimilarity(dist, MAX_DIST);
        return { phrase: p, distance: dist, similarity: sim };
      })
      .sort((a, b) => b.similarity - a.similarity);
  }, [query]);

  const filtered = results.filter((r) => r.similarity >= threshold);
  const topResults = filtered.slice(0, topK);
  const excludedByThreshold = results.filter((r) => r.similarity < threshold && r.similarity > 0.15);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("searchResults", { count: topResults.length })}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {t("topK", { k: topK })}, {t("threshold", { t: (threshold * 100).toFixed(0) })}
        </span>
      </div>
      <div className="max-h-[440px] overflow-y-auto p-4">
        {/* Query display */}
        <div className="mb-3 rounded-md border border-accent/30 bg-accent/5 p-2.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-accent">{tShared("queryLabel")}</span>
          <p className="mt-0.5 text-[13px] font-medium text-primary">{query.text}</p>
          <p className="text-[10px] text-muted">{tEmb(`topic_${query.topic}`)}</p>
        </div>

        {topResults.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-muted">
            {t("noResults")}
          </div>
        ) : (
          <>
            <h4 className="mb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-success/80">
              {t("retrieved", { count: topResults.length })}
            </h4>
            <div className="space-y-1.5">
              {topResults.map((r, i) => {
                const isRelevant = r.phrase.topic === query.topic;
                const isBorderline = r.similarity < threshold + 0.1;
                return (
                  <div
                    key={r.phrase.id}
                    className={`rounded-md border p-2.5 ${
                      isBorderline && !isRelevant
                        ? "border-warning/20 bg-warning/[0.03]"
                        : "border-border bg-surface-elevated"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 font-mono text-[10px] text-muted">#{i + 1}</span>
                        <span className="text-[12px] font-medium text-primary truncate">
                          {r.phrase.text}
                        </span>
                      </div>
                      <span
                        className="shrink-0 ml-2 font-mono text-[11px] tabular-nums"
                        style={{
                          color:
                            r.similarity > 0.7
                              ? "var(--color-success)"
                              : r.similarity > 0.4
                                ? "var(--color-warning)"
                                : "var(--color-danger)",
                        }}
                      >
                        {(r.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-surface-hover">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.similarity * 100}%`,
                          backgroundColor: r.similarity > 0.7
                            ? "var(--color-success)"
                            : r.similarity > 0.4
                              ? "var(--color-warning)"
                              : "var(--color-danger)",
                        }}
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-muted">{tEmb(`topic_${r.phrase.topic}`)}</span>
                      {!isRelevant && r.similarity > threshold && (
                        <span className="rounded border border-warning/30 px-1 py-0.5 text-[9px] font-mono text-warning">
                          {t("diffTopic")}
                        </span>
                      )}
                      {isRelevant && (
                        <span className="rounded border border-success/30 px-1 py-0.5 text-[9px] font-mono text-success">
                          {t("sameTopic")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Below threshold */}
        {excludedByThreshold.length > 0 && excludedByThreshold[0].similarity > 0.1 && (
          <div className="mt-4">
            <h4 className="mb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-danger/80">
              {t("belowThreshold", { count: excludedByThreshold.length })}
            </h4>
            <div className="space-y-1">
              {excludedByThreshold.slice(0, 3).map((r) => (
                <div
                  key={r.phrase.id}
                  className="rounded-md border border-danger/10 bg-danger/[0.02] p-2 opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted truncate">{r.phrase.text}</span>
                    <span className="shrink-0 ml-2 font-mono text-[10px] text-danger/70 tabular-nums">
                      {(r.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {excludedByThreshold.length > 3 && (
                <p className="text-[10px] text-muted pl-2">
                  {t("more", { count: excludedByThreshold.length - 3 })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
