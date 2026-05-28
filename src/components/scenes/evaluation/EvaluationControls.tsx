"use client";

import { useTranslations } from "next-intl";
import { useEvaluationStore } from "@/store/evaluation-store";
import { scenarios } from "@/lib/simulation/evaluation";
import type { Strictness, EvaluationScenario } from "@/lib/simulation/evaluation";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";
import { PresetSelector } from "@/components/shared/PresetSelector";

const strictnessOptions: { value: Strictness; labelKey: string }[] = [
  { value: "lenient", labelKey: "lenient" },
  { value: "standard", labelKey: "standard" },
  { value: "strict", labelKey: "strict" },
];

const presetIds = ["all-passing", "strict-fail", "regression", "lenient-pass"];

export function EvaluationControls() {
  const t = useTranslations("Evaluation.controls");
  const tp = useTranslations("Evaluation.presets");
  const tShared = useTranslations("Shared");

  const {
    selectedScenarioId,
    strictness,
    showRegressions,
    selectedPreset,
    baselineScores,
    setScenario,
    setStrictness,
    toggleRegressions,
    resetBaseline,
    applyPreset,
  } = useEvaluationStore();

  const presetItems = presetIds.map((id) => ({
    id,
    title: tp(`${id}.title`),
    description: tp(`${id}.description`),
  }));

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <ControlPanel title={t("scenario")}>
        <div className="space-y-1">
          {scenarios.map((sc: EvaluationScenario) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                selectedScenarioId === sc.id
                  ? "border-accent/40 bg-accent/10 text-primary font-medium"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block">{sc.name}</span>
              <span className="mt-0.5 block text-[10px] text-muted">
                {sc.description}
              </span>
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Strictness */}
      <ControlPanel title={t("strictness")}>
        <ControlRow
          label={t("strictness")}
          hint={t(`strictnessHint.${strictness}`)}
        >
          <div className="flex gap-1.5">
            {strictnessOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStrictness(opt.value)}
                className={`flex-1 rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
                  strictness === opt.value
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border bg-surface text-muted hover:border-border-hover"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </ControlRow>
      </ControlPanel>

      {/* Regression toggle */}
      <ControlPanel title={t("regressions")}>
        <ControlRow
          label={t("showRegressions")}
          hint={
            showRegressions
              ? t("showRegressionsOn")
              : t("showRegressionsOff")
          }
        >
          <button
            onClick={() => toggleRegressions(!showRegressions)}
            className={`w-full rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
              showRegressions
                ? "border-warning/30 bg-warning/10 text-warning"
                : "border-border bg-surface text-muted hover:border-border-hover"
            }`}
          >
            {showRegressions ? t("on") : t("off")}
          </button>
        </ControlRow>

        <ControlRow
          label={t("resetBaseline")}
          hint={
            Object.keys(baselineScores).length > 0
              ? t("baselineActive")
              : t("baselineInactive")
          }
        >
          <button
            onClick={resetBaseline}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[11px] font-medium text-secondary transition-colors hover:border-border-hover"
          >
            {t("resetBaselineBtn")}
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
