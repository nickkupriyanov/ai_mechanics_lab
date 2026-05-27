"use client";

import { useTranslations } from "next-intl";
import { useContextWindowStore } from "@/store/context-window-store";
import { contextPresets, type ContextPreset } from "@/lib/simulation/context-window";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

const presetKeyMap: Record<string, string> = {
  "good-context": "goodContext",
  "context-overflow": "contextOverflow",
  "lost-instructions": "lostInstructions",
  "history-flood": "historyFlood",
  "summarization-helps": "summarizationHelps",
};

export function ContextControls() {
  const t = useTranslations("ContextWindow.controls");
  const tp = useTranslations("ContextWindow.presets");
  const ts = useTranslations("Shared");

  const {
    contextSize,
    historyCount,
    noiseCount,
    enableSummarization,
    selectedPreset,
    setContextSize,
    setHistoryCount,
    setNoiseCount,
    setEnableSummarization,
    applyPreset,
  } = useContextWindowStore();

  const presetItems = contextPresets.map((p: ContextPreset) => {
    const key = presetKeyMap[p.id] ?? p.id;
    const titleKey = `${key}` as Parameters<typeof tp>[0];
    const descKey = `${key}Desc` as Parameters<typeof tp>[0];
    return {
      id: p.id,
      title: tp(titleKey),
      description: tp(descKey),
    };
  });

  const getContextSizeHint = () => {
    if (contextSize < 2000) return t("contextSizeHintTight");
    if (contextSize > 6000) return t("contextSizeHintLarge");
    return t("contextSizeHintStandard");
  };

  const getHistoryHint = () => {
    if (historyCount > 8) return t("historyCountHintHigh");
    if (historyCount > 3) return t("historyCountHintModerate");
    return t("historyCountHintLow");
  };

  const getNoiseHint = () => {
    if (noiseCount > 2) return t("noiseBlocksHintHigh");
    if (noiseCount > 0) return t("noiseBlocksHintSome");
    return t("noiseBlocksHintClean");
  };

  return (
    <div className="space-y-4">
      <ControlPanel title={ts("settings")}>
        <ControlRow
          label={t("contextSize", { size: contextSize })}
          hint={getContextSizeHint()}
        >
          <input
            type="range"
            min={500}
            max={8000}
            step={500}
            value={contextSize}
            onChange={(e) => setContextSize(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("historyCount", { count: historyCount })}
          hint={getHistoryHint()}
        >
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={historyCount}
            onChange={(e) => setHistoryCount(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("noiseBlocks", { count: noiseCount })}
          hint={getNoiseHint()}
        >
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={noiseCount}
            onChange={(e) => setNoiseCount(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </ControlRow>

        <ControlRow
          label={t("summarization")}
          hint={
            enableSummarization
              ? t("summarizationHintOn")
              : t("summarizationHintOff")
          }
        >
          <button
            onClick={() => setEnableSummarization(!enableSummarization)}
            className={`w-full rounded-md border px-3 py-2 text-left text-[12px] transition-colors ${
              enableSummarization
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-surface text-secondary hover:border-border-hover"
            }`}
          >
            {enableSummarization ? t("summarizationOn") : t("summarizationOff")}
          </button>
        </ControlRow>
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
