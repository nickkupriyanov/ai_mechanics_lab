"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePromptInjectionStore } from "@/store/prompt-injection-store";
import {
  attackTypes,
  queries,
  injectionPresets,
} from "@/lib/simulation/prompt-injection";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

function getPresetTitle(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "safe":
      return tp("safe");
    case "injected":
      return tp("injected");
    case "hidden":
      return tp("hidden");
    case "tool-poison":
      return tp("toolPoison");
    default:
      return id;
  }
}

function getPresetDesc(tp: (key: string) => string, id: string): string {
  switch (id) {
    case "safe":
      return tp("safeDesc");
    case "injected":
      return tp("injectedDesc");
    case "hidden":
      return tp("hiddenDesc");
    case "tool-poison":
      return tp("toolPoisonDesc");
    default:
      return "";
  }
}

function getAttackLabel(locale: string, at: typeof attackTypes[number]): string {
  return locale === "ru" ? at.labelRu : at.label;
}

export function InjectionControls() {
  const t = useTranslations("PromptInjection.controls");
  const tp = useTranslations("PromptInjection.presets");
  const tShared = useTranslations("Shared");
  const locale = useLocale();

  const {
    selectedAttackType,
    selectedQueryId,
    enableHierarchy,
    enableSanitization,
    selectedPreset,
    poisonedDocActive,
    showInjectedContent,
    setAttackType,
    setQuery,
    toggleHierarchy,
    toggleSanitization,
    togglePoisonedDoc,
    toggleShowInjected,
    applyPreset,
  } = usePromptInjectionStore();

  const presetItems = injectionPresets.map((p) => ({
    id: p.id,
    title: getPresetTitle(tp, p.id),
    description: getPresetDesc(tp, p.id),
  }));

  return (
    <div className="space-y-4">
      {/* Attack type selector */}
      <ControlPanel title={t("attackType")}>
        <div className="space-y-1 max-h-[260px] overflow-y-auto">
          {attackTypes.map((at) => {
            const label = getAttackLabel(locale, at);
            return (
              <button
                key={at.id}
                onClick={() => setAttackType(at.id)}
                className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                  selectedAttackType === at.id
                    ? "border-danger/40 bg-danger/10 text-primary font-medium"
                    : "border-border bg-surface text-secondary hover:border-border-hover"
                }`}
              >
                <span className="block">{label}</span>
                <span className="mt-0.5 block text-[10px] text-muted">
                  {locale === "ru" ? at.descriptionRu : at.description}
                </span>
              </button>
            );
          })}
        </div>
      </ControlPanel>

      {/* Query selector */}
      <ControlPanel title={t("userQuery")}>
        <div className="space-y-1 max-h-[220px] overflow-y-auto">
          {queries.map((q) => (
            <button
              key={q.id}
              onClick={() => setQuery(q.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                selectedQueryId === q.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block line-clamp-2">
                {locale === "ru" ? q.labelRu : q.label}
              </span>
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Safety toggles */}
      <ControlPanel title={t("safetyMeasures")}>
        <ControlRow
          label={t("instructionHierarchy")}
          hint={enableHierarchy ? t("hierarchyOn") : t("hierarchyOff")}
        >
          <button
            onClick={() => toggleHierarchy(!enableHierarchy)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              enableHierarchy
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {enableHierarchy ? t("on") : t("off")}
          </button>
        </ControlRow>

        <ControlRow
          label={t("inputSanitization")}
          hint={enableSanitization ? t("sanitizationOn") : t("sanitizationOff")}
        >
          <button
            onClick={() => toggleSanitization(!enableSanitization)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              enableSanitization
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {enableSanitization ? t("on") : t("off")}
          </button>
        </ControlRow>

        <ControlRow
          label={t("poisonedDocActive")}
          hint={poisonedDocActive ? t("poisonedDocOn") : t("poisonedDocOff")}
        >
          <button
            onClick={() => togglePoisonedDoc(!poisonedDocActive)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              poisonedDocActive
                ? "border-danger/30 bg-danger/10 text-danger"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {poisonedDocActive ? t("active") : t("inactive")}
          </button>
        </ControlRow>

        <ControlRow
          label={t("showInjectedContent")}
          hint={
            showInjectedContent
              ? t("showInjectedOn")
              : t("showInjectedOff")
          }
        >
          <button
            onClick={() => toggleShowInjected(!showInjectedContent)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              showInjectedContent
                ? "border-warning/30 bg-warning/10 text-warning"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {showInjectedContent ? t("visible") : t("hidden")}
          </button>
        </ControlRow>
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
