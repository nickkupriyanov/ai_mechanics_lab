"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAgentsStore } from "@/store/agents-store";
import { agentScenarios, agentsPresets } from "@/lib/simulation/agents";
import { ControlPanel, ControlRow } from "@/components/shared/ControlPanel";

export function AgentsControls() {
  const t = useTranslations("Agents.controls");
  const locale = useLocale();

  const {
    scenarioId,
    maxSteps,
    enableReflection,
    toolReliability,
    enableStopCondition,
    isDone,
    isStuck,
    setScenario,
    setMaxSteps,
    setReflection,
    setReliability,
    setStopCondition,
    runNextStep,
    reset,
    applyPreset,
    selectedPreset,
  } = useAgentsStore();

  return (
    <div className="space-y-4">
      {/* Run / Reset buttons */}
      <div className="flex gap-2">
        <button
          onClick={runNextStep}
          disabled={isDone || isStuck}
          className="flex-1 rounded-md border border-accent/30 bg-accent/10 px-4 py-2.5 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-hover disabled:text-muted"
        >
          {t("runNextStep")}
        </button>
        <button
          onClick={reset}
          className="rounded-md border border-border bg-surface px-3 py-2.5 text-[12px] font-medium text-secondary transition-colors hover:border-border-hover hover:text-primary"
        >
          {t("reset")}
        </button>
      </div>

      {/* Scenario selector */}
      <ControlPanel title={t("scenario")}>
        <div className="flex flex-col gap-1.5">
          {agentScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`rounded-md border px-3 py-2 text-left text-[11px] leading-snug transition-colors ${
                scenarioId === s.id
                  ? "border-accent/40 bg-accent/10 text-primary"
                  : "border-border bg-surface text-secondary hover:border-border-hover"
              }`}
            >
              <span className="block text-[12px] font-medium text-primary">
                {locale === "ru" ? s.goalRu : s.goal}
              </span>
              <span className="mt-0.5 block text-[10px] text-muted">
                {s.steps.length} {locale === "ru" ? "шагов" : "steps"} &middot;{" "}
                {s.steps.find((st) => st.isComplete)
                  ? locale === "ru"
                    ? "есть завершающий шаг"
                    : "has completion step"
                  : locale === "ru"
                    ? "нет завершающего шага"
                    : "no completion step"}
              </span>
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Settings */}
      <ControlPanel title={t("settings")}>
        <div className="space-y-3">
          <ControlRow
            label={t("maxStepsLabel", { n: maxSteps })}
            hint={t(
              maxSteps >= 8
                ? "maxStepsHintHigh"
                : maxSteps <= 2
                  ? "maxStepsHintLow"
                  : "maxStepsHintGood",
            )}
          >
            <input
              type="range"
              min={1}
              max={10}
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </ControlRow>

          <ToggleSetting
            label={t("reflection")}
            active={enableReflection}
            onChange={setReflection}
            activeLabel={t("on")}
            inactiveLabel={t("off")}
            hint={enableReflection ? t("reflectionHintOn") : t("reflectionHintOff")}
          />

          <ToggleSetting
            label={t("toolReliability")}
            active={toolReliability === "good"}
            onChange={(v) => setReliability(v ? "good" : "poor")}
            activeLabel={t("good")}
            inactiveLabel={t("poor")}
            hint={
              toolReliability === "good" ? t("reliabilityHintGood") : t("reliabilityHintPoor")
            }
          />

          <ToggleSetting
            label={t("stopCondition")}
            active={enableStopCondition}
            onChange={setStopCondition}
            activeLabel={t("on")}
            inactiveLabel={t("off")}
            hint={
              enableStopCondition
                ? t("stopConditionHintOn")
                : t("stopConditionHintOff")
            }
          />
        </div>
      </ControlPanel>

      {/* Presets */}
      <ControlPanel title={t("presetsTitle")}>
        <div className="flex flex-col gap-1.5">
          {agentsPresets.map((p) => {
            const isActive = selectedPreset === p.id;
            const title = locale === "ru" ? p.titleRu : p.title;
            const desc = locale === "ru" ? p.descriptionRu : p.description;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "border-accent/40 bg-accent/10"
                    : "border-border bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[12px] font-medium ${
                      isActive ? "text-accent" : "text-secondary"
                    }`}
                  >
                    {title}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-accent">
                      {locale === "ru" ? "АКТИВЕН" : "ACTIVE"}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      </ControlPanel>

      {/* Status */}
      <div className="rounded-lg border border-border bg-surface-elevated p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-muted">{t("status")}</span>
          <span
            className={`font-mono font-medium ${
              isDone
                ? "text-green-400"
                : isStuck
                  ? "text-red-400"
                  : "text-accent"
            }`}
          >
            {isDone
              ? locale === "ru"
                ? "Завершено"
                : "Done"
              : isStuck
                ? locale === "ru"
                  ? "Зациклился"
                  : "Stuck"
                : locale === "ru"
                  ? "Выполняется"
                  : "Running"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  active,
  onChange,
  activeLabel,
  inactiveLabel,
  hint,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
  hint: string;
}) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onChange(!active)}
        className={`w-full rounded-md border px-3 py-1.5 text-left transition-colors ${
          active
            ? "border-accent/20 bg-accent/[0.04]"
            : "border-border bg-surface hover:border-border-hover"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium ${active ? "text-accent" : "text-secondary"}`}>
            {label}
          </span>
          <span className={`shrink-0 text-[10px] font-mono ${active ? "text-accent" : "text-muted"}`}>
            {active ? activeLabel : inactiveLabel}
          </span>
        </div>
      </button>
      <p className="text-[10px] leading-relaxed text-muted">{hint}</p>
    </div>
  );
}
