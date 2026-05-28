"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemoryStore } from "@/store/memory-store";
import { allQueries, memoryPresets } from "@/lib/simulation/memory";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "normal-memory": return tp("normalMemory");
    case "stale-memory": return tp("staleMemory");
    case "overflow-memory": return tp("overflowMemory");
    case "deleted-memory": return tp("deletedMemory");
    default: return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "normal-memory": return tp("normalMemoryDesc");
    case "stale-memory": return tp("staleMemoryDesc");
    case "overflow-memory": return tp("overflowMemoryDesc");
    case "deleted-memory": return tp("deletedMemoryDesc");
    default: return "";
  }
}

export function MemoryControls() {
  const t = useTranslations("Memory.controls");
  const tp = useTranslations("Memory.presets");
  const tShared = useTranslations("Shared");
  const locale = useLocale();

  const {
    selectedQueryId,
    contextLimit,
    selectedPreset,
    setQuery,
    setContextLimit,
    applyPreset,
    resetMemories,
  } = useMemoryStore();

  const presetItems = memoryPresets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  return (
    <div className="space-y-4">
      <ControlPanel title={t("query")}>
        <div className="space-y-1 max-h-[220px] overflow-y-auto">
          {allQueries.map((q) => (
            <button
              key={q.id}
              onClick={() => setQuery(q.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                selectedQueryId === q.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block line-clamp-2">{locale === "ru" ? q.labelRu : q.label}</span>
            </button>
          ))}
        </div>
      </ControlPanel>

      <ControlPanel title={t("contextLimit")}>
        <ControlRow
          label={t("contextLimitLabel", { limit: contextLimit })}
          hint={contextLimit < 50 ? t("contextLimitHintSmall") : t("contextLimitHintGood")}
        >
          <input
            type="range"
            min={10}
            max={600}
            step={10}
            value={contextLimit}
            onChange={(e) => setContextLimit(Number(e.target.value))}
            className="bp-slider w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>{t("tokenCount", { tokens: contextLimit })}</span>
          </div>
        </ControlRow>
      </ControlPanel>

      <ControlPanel title={tShared("presets")}>
        <PresetSelector
          presets={presetItems}
          activePresetId={selectedPreset ?? undefined}
          onSelect={applyPreset}
        />
      </ControlPanel>

      <button
        onClick={resetMemories}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[12px] font-medium text-secondary transition-colors hover:border-border-hover hover:text-primary"
      >
        {t("resetMemories")}
      </button>
    </div>
  );
}
