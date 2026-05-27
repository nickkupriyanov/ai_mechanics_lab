"use client";

import { useTranslations } from "next-intl";
import { phrases } from "@/lib/simulation/embeddings";
import { useVectorSearchStore } from "@/store/vector-search-store";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";

export function SimilarityControls() {
  const t = useTranslations("VectorSearch");
  const tShared = useTranslations("Shared");
  const queryId = useVectorSearchStore((s) => s.queryId);
  const topK = useVectorSearchStore((s) => s.topK);
  const threshold = useVectorSearchStore((s) => s.threshold);
  const setQueryId = useVectorSearchStore((s) => s.setQueryId);
  const setTopK = useVectorSearchStore((s) => s.setTopK);
  const setThreshold = useVectorSearchStore((s) => s.setThreshold);

  return (
    <div className="space-y-4">
      <ControlPanel title={tShared("queryLabel")}>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {phrases.map((p) => (
            <button
              key={p.id}
              onClick={() => setQueryId(p.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                queryId === p.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: (() => {
                      const found = [
                        { id: "ai", color: "#a78bfa" },
                        { id: "programming", color: "#3b82f6" },
                        { id: "travel", color: "#22c55e" },
                        { id: "cooking", color: "#f59e0b" },
                        { id: "productivity", color: "#ef4444" },
                      ].find((c) => c.id === p.topic);
                      return found?.color ?? "#63636e";
                    })(),
                  }}
                />
                <span className="truncate">{p.text}</span>
              </span>
            </button>
          ))}
        </div>
      </ControlPanel>

      <ControlPanel title={tShared("settings")}>
        <ControlRow
          label={t("topKLabel", { k: topK })}
          hint={
            topK <= 1
              ? t("topKHintLow")
              : topK >= 8
                ? t("topKHintHigh")
                : t("topKHintGood")
          }
        >
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("thresholdLabel", { t: (threshold * 100).toFixed(0) })}
          hint={
            threshold > 0.7
              ? t("thresholdHintHigh")
              : threshold < 0.2
                ? t("thresholdHintLow")
                : t("thresholdHintGood")
          }
        >
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={threshold * 100}
            onChange={(e) => setThreshold(Number(e.target.value) / 100)}
            className="w-full accent-accent"
          />
        </ControlRow>
      </ControlPanel>
    </div>
  );
}
