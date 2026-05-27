"use client";

import { useTranslations } from "next-intl";
import { useRagStore } from "@/store/rag-store";
import { ragPresets, queryOptions } from "@/lib/simulation/rag-data";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-rag": return tp("goodRag");
    case "bad-chunking": return tp("badChunking");
    case "topk-low": return tp("topkLow");
    case "too-much-noise": return tp("tooMuchNoise");
    case "context-overflow": return tp("contextOverflow");
    default: return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "good-rag": return tp("goodRagDesc");
    case "bad-chunking": return tp("badChunkingDesc");
    case "topk-low": return tp("topkLowDesc");
    case "too-much-noise": return tp("tooMuchNoiseDesc");
    case "context-overflow": return tp("contextOverflowDesc");
    default: return "";
  }
}

export function RagControls() {
  const t = useTranslations("Rag.controls");
  const tp = useTranslations("Rag.presets");
  const ts = useTranslations("Shared");
  const tq = useTranslations("RagData.queries");

  const {
    chunkSize,
    topK,
    contextLimit,
    noiseLevel,
    userQuery,
    selectedPreset,
    setChunkSize,
    setTopK,
    setContextLimit,
    setNoiseLevel,
    setUserQuery,
    applyPreset,
  } = useRagStore();

  const presetItems = ragPresets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  const noisePct = (noiseLevel * 100).toFixed(0);

  return (
    <div className="space-y-4">
      <ControlPanel title={ts("settings")}>
        <ControlRow
          label={t("chunkSize", { size: chunkSize })}
          hint={
            chunkSize < 200
              ? t("chunkSizeHintSmall")
              : chunkSize > 700
                ? t("chunkSizeHintLarge")
                : t("chunkSizeHintGood")
          }
        >
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("topK", { k: topK })}
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
          label={t("contextLimit", { limit: contextLimit })}
          hint={
            contextLimit < 500
              ? t("contextLimitHintSmall")
              : contextLimit > 3000
                ? t("contextLimitHintLarge")
                : t("contextLimitHintGood")
          }
        >
          <input
            type="range"
            min={200}
            max={4000}
            step={100}
            value={contextLimit}
            onChange={(e) => setContextLimit(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("noiseLevel", { level: noisePct })}
          hint={
            noiseLevel > 0.3
              ? t("noiseLevelHintHigh")
              : noiseLevel > 0
                ? t("noiseLevelHintSome")
                : t("noiseLevelHintClean")
          }
        >
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={noiseLevel * 100}
            onChange={(e) => setNoiseLevel(Number(e.target.value) / 100)}
            className="w-full accent-accent"
          />
        </ControlRow>
      </ControlPanel>

      <ControlPanel title={t("query")}>
        <div className="space-y-2">
          {queryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setUserQuery(tq(`${option.id}.query`))}
              className={`w-full rounded-md border px-3 py-2 text-left text-[12px] leading-relaxed transition-colors ${
                userQuery === tq(`${option.id}.query`)
                  ? "border-accent/40 bg-accent/10 text-primary"
                  : "border-border bg-surface text-secondary hover:border-border-hover hover:text-primary"
              }`}
            >
              {tq(`${option.id}.label`)}
            </button>
          ))}
        </div>
      </ControlPanel>

      <ControlPanel title={ts("presets")}>
        <PresetSelector
          presets={presetItems}
          activePresetId={selectedPreset ?? undefined}
          onSelect={applyPreset}
        />
      </ControlPanel>
    </div>
  );
}
