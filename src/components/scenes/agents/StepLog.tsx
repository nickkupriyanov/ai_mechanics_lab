"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAgentsStore, type ExecutedStep } from "@/store/agents-store";

function StepCard({
  step,
  isCurrent,
  enableReflection,
  locale,
}: {
  step: ExecutedStep;
  isCurrent: boolean;
  enableReflection: boolean;
  locale: string;
}) {
  const t = useTranslations("Agents.log");

  const action = locale === "ru" ? step.actionRu : step.action;
  const observation = locale === "ru" ? step.observationRu : step.observation;
  const reflection = locale === "ru" ? step.reflectionRu : step.reflection;

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isCurrent
          ? step.isError
            ? "border-red-500/30 bg-red-500/[0.06]"
            : "border-accent/30 bg-accent/[0.05]"
          : "border-border bg-surface"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
            isCurrent
              ? step.isError
                ? "bg-red-500/20 text-red-400"
                : "bg-accent/20 text-accent"
              : "bg-surface-hover text-muted"
          }`}
        >
          {t("stepLabel", { n: step.stepNumber })}
        </span>
        {step.isError && (
          <span className="shrink-0 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-400">
            {locale === "ru" ? "ОШИБКА" : "ERROR"}
          </span>
        )}
        {step.isComplete && !step.isError && (
          <span className="shrink-0 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-green-400">
            {locale === "ru" ? "ГОТОВО" : "DONE"}
          </span>
        )}
      </div>

      <div className="space-y-2 text-[12px] leading-relaxed">
        <div>
          <span className="font-medium text-accent">{t("action")}</span>
          <span className="text-primary"> {action}</span>
        </div>

        <div>
          <span className="font-medium text-blue-400">{t("tool")}</span>
          <span className="font-mono text-[11px] text-secondary">
            {" "}
            {step.toolName}
            (
            {Object.entries(step.toolArgs)
              .map(([k, v]) => `${k}: "${v}"`)
              .join(", ")}
            )
          </span>
        </div>

        <div>
          <span className={`font-medium ${step.isError ? "text-red-400" : "text-blue-400"}`}>
            {t("observation")}
          </span>
          <span className={step.isError ? "text-red-300/80" : "text-primary"}>
            {" "}
            {observation}
          </span>
        </div>

        {enableReflection && (
          <div>
            <span className="font-medium text-green-400">{t("reflection")}</span>
            <span className="text-primary"> {reflection}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function StepLog() {
  const t = useTranslations("Agents.log");
  const locale = useLocale();

  const executedSteps = useAgentsStore((s) => s.executedSteps);
  const isDone = useAgentsStore((s) => s.isDone);
  const isStuck = useAgentsStore((s) => s.isStuck);
  const enableReflection = useAgentsStore((s) => s.enableReflection);

  if (executedSteps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-[13px] text-muted">
          {locale === "ru"
            ? "Нажмите «Выполнить шаг», чтобы запустить агента"
            : "Click \"Run next step\" to start the agent"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("stepLog")}
        </span>
        {isDone && (
          <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-green-400">
            {locale === "ru" ? "ЗАВЕРШЕНО" : "COMPLETE"}
          </span>
        )}
        {isStuck && (
          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-400">
            {locale === "ru" ? "ЗАЦИКЛИЛСЯ" : "STUCK"}
          </span>
        )}
      </div>

      <div className="max-h-[400px] space-y-2.5 overflow-y-auto pr-1">
        {executedSteps.map((step, i) => (
          <StepCard
            key={`${step.id}-${i}`}
            step={step}
            isCurrent={i === executedSteps.length - 1}
            enableReflection={enableReflection}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
