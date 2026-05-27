"use client";

import { useTranslations } from "next-intl";
import { phrases, topicClusters } from "@/lib/simulation/embeddings";
import { useEmbeddingsStore } from "@/store/embeddings-store";

export function PhraseList() {
  const t = useTranslations("Embeddings");
  const selectedPhraseIds = useEmbeddingsStore((s) => s.selectedPhraseIds);
  const togglePhrase = useEmbeddingsStore((s) => s.togglePhrase);

  const grouped = topicClusters.map((cluster) => ({
    cluster,
    phrases: phrases.filter((p) => p.topic === cluster.id),
  }));

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("phrases", { count: phrases.length })}
        </span>
      </div>
      <div className="max-h-[440px] overflow-y-auto p-3">
        {grouped.map(({ cluster, phrases: groupPhrases }) => (
          <div key={cluster.id} className="mb-3 last:mb-0">
            <div className="mb-1.5 flex items-center gap-1.5 px-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: cluster.color }}
              />
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
                {t(`topic_${cluster.id}`)}
              </span>
            </div>
            <div className="space-y-0.5">
              {groupPhrases.map((phrase) => {
                const isSelected = selectedPhraseIds.includes(phrase.id);
                const index = selectedPhraseIds.indexOf(phrase.id);
                return (
                  <button
                    key={phrase.id}
                    onClick={() => togglePhrase(phrase.id)}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-[12px] transition-colors ${
                      isSelected
                        ? "bg-accent/10 text-primary font-medium"
                        : "text-secondary hover:bg-surface-hover hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected && (
                        <span className="shrink-0 font-mono text-[9px] text-accent">
                          {index === 0 ? "A" : "B"}
                        </span>
                      )}
                      <span className="truncate">{phrase.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
