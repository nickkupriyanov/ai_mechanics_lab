"use client";

import { useTranslations } from "next-intl";
import type { ScenePreset } from "@/types/scenes";

type PresetSelectorProps = {
  presets: ScenePreset[];
  activePresetId?: string;
  onSelect: (id: string) => void;
};

export function PresetSelector({ presets, activePresetId, onSelect }: PresetSelectorProps) {
  const t = useTranslations("Shared");

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
        {t("presets")}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              activePresetId === preset.id
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-surface text-secondary hover:border-border-hover hover:text-primary"
            }`}
            title={preset.description}
          >
            {preset.title}
          </button>
        ))}
      </div>
    </div>
  );
}
