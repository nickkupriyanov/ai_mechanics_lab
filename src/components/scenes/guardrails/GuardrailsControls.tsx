"use client";

import { useTranslations } from "next-intl";
import { useGuardrailsStore } from "@/store/guardrails-store";
import {
  guardScenarios,
  guardPresets,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/simulation/guardrails";
import type { ContentCategory, Strictness } from "@/lib/simulation/guardrails";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

const allCategories: ContentCategory[] = [
  "hate-speech",
  "pii",
  "off-topic",
  "prompt-injection",
  "harmful-code",
  "sensitive-data",
];

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "open":
      return tp("open");
    case "locked":
      return tp("locked");
    case "no-input":
      return tp("noInput");
    case "no-output":
      return tp("noOutput");
    default:
      return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "open":
      return tp("openDesc");
    case "locked":
      return tp("lockedDesc");
    case "no-input":
      return tp("noInputDesc");
    case "no-output":
      return tp("noOutputDesc");
    default:
      return "";
  }
}

function strictnessLabel(tc: (key: string) => string, s: Strictness): string {
  switch (s) {
    case "permissive":
      return tc("permissive");
    case "standard":
      return tc("standard");
    case "strict":
      return tc("strict");
  }
}

export function GuardrailsControls() {
  const t = useTranslations("Guardrails.controls");
  const tp = useTranslations("Guardrails.presets");
  const tShared = useTranslations("Shared");

  const {
    selectedScenarioId,
    strictness,
    inputGuardEnabled,
    outputGuardEnabled,
    enabledCategories,
    selectedPreset,
    setScenario,
    setStrictness,
    toggleInputGuard,
    toggleOutputGuard,
    toggleCategory,
    enableAllCategories,
    applyPreset,
  } = useGuardrailsStore();

  const presetItems = guardPresets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  const getScenarioLabel = (id: string): string => {
    const scenario = guardScenarios.find((s) => s.id === id);
    if (!scenario) return id;
    const key = `scenarios.${id}` as never;
    const translated = t(key as never);
    return typeof translated === "string" && translated !== `Guardrails.controls.scenarios.${id}`
      ? translated
      : scenario.label;
  };

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <ControlPanel title={t("scenario")}>
        <div className="space-y-1 max-h-[260px] overflow-y-auto">
          {guardScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setScenario(scenario.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                selectedScenarioId === scenario.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block">{getScenarioLabel(scenario.id)}</span>
              <span className="mt-0.5 block text-[10px] text-muted">
                {scenario.expectedGuard === "input"
                  ? t("guardInput")
                  : scenario.expectedGuard === "output"
                    ? t("guardOutput")
                    : t("guardBoth")}
              </span>
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Strictness */}
      <ControlPanel title={t("strictness")}>
        <div className="flex gap-1">
          {(["permissive", "standard", "strict"] as Strictness[]).map((s) => (
            <button
              key={s}
              onClick={() => setStrictness(s)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-center text-[11px] font-medium transition-colors ${
                strictness === s
                  ? "border-accent/40 bg-accent/10 text-primary"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              {strictnessLabel(t, s)}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-muted">
          {strictness === "permissive"
            ? t("strictnessPermissiveHint")
            : strictness === "standard"
              ? t("strictnessStandardHint")
              : t("strictnessStrictHint")}
        </p>
      </ControlPanel>

      {/* Guard toggles */}
      <ControlPanel title={t("guardsTitle")}>
        <ControlRow
          label={t("inputGuard")}
          hint={inputGuardEnabled ? t("inputGuardOn") : t("inputGuardOff")}
        >
          <button
            onClick={() => toggleInputGuard(!inputGuardEnabled)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              inputGuardEnabled
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {inputGuardEnabled ? t("on") : t("off")}
          </button>
        </ControlRow>

        <ControlRow
          label={t("outputGuard")}
          hint={outputGuardEnabled ? t("outputGuardOn") : t("outputGuardOff")}
        >
          <button
            onClick={() => toggleOutputGuard(!outputGuardEnabled)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              outputGuardEnabled
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {outputGuardEnabled ? t("on") : t("off")}
          </button>
        </ControlRow>
      </ControlPanel>

      {/* Category toggles */}
      <ControlPanel title={t("categories")}>
        <div className="space-y-1">
          {allCategories.map((cat) => {
            const isEnabled = enabledCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`w-full flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors ${
                  isEnabled
                    ? "border-border bg-surface text-secondary"
                    : "border-border bg-surface-hover text-muted opacity-50"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getCategoryColor(cat) }}
                />
                <span className="text-[11px] flex-1">{getCategoryLabel(cat)}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isEnabled ? "text-success" : "text-muted"
                  }`}
                >
                  {isEnabled ? t("checked") : t("unchecked")}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={enableAllCategories}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-secondary transition-colors hover:border-border-hover"
        >
          {t("enableAll")}
        </button>
      </ControlPanel>

      {/* Presets */}
      <ControlPanel title={tShared("presets")}>
        <PresetSelector
          presets={presetItems}
          activePresetId={selectedPreset ?? undefined}
          onSelect={applyPreset}
        />
      </ControlPanel>
    </div>
  );
}
