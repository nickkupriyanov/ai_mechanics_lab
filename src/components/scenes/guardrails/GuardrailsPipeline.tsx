"use client";

import { useTranslations } from "next-intl";
import type { GuardResult } from "@/lib/simulation/guardrails";

type GuardrailsPipelineProps = {
  inputResult: GuardResult | null;
  outputResult: GuardResult | null;
  inputGuardEnabled: boolean;
  outputGuardEnabled: boolean;
};

function NodeBlock({
  label,
  subLabel,
  status,
}: {
  label: string;
  subLabel?: string;
  status: "neutral" | "pass" | "block" | "flag" | "disabled";
}) {
  const colorClasses = {
    neutral:
      "bg-surface-hover border-border",
    pass: "bg-success/10 border-success/30",
    block: "bg-danger/10 border-danger/30",
    flag: "bg-warning/10 border-warning/30",
    disabled: "bg-surface-hover border-border opacity-40",
  };

  const textColor = {
    neutral: "text-secondary",
    pass: "text-success",
    block: "text-danger",
    flag: "text-warning",
    disabled: "text-muted",
  };

  const indicator = {
    neutral: "",
    pass: "✓",
    block: "✗",
    flag: "⚠",
    disabled: "—",
  };

  return (
    <div
      className={`flex flex-col items-center rounded-lg border px-2.5 py-2 min-w-[85px] shrink-0 transition-colors ${colorClasses[status]}`}
    >
      <div className="flex items-center gap-1">
        {indicator[status] && (
          <span className={`text-[11px] font-bold ${textColor[status]}`}>
            {indicator[status]}
          </span>
        )}
        <span
          className={`text-[10px] font-mono font-medium uppercase tracking-wider ${textColor[status]}`}
        >
          {label}
        </span>
      </div>
      {subLabel && (
        <span className="mt-0.5 text-[10px] text-muted text-center leading-tight">
          {subLabel}
        </span>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      className="mx-1 h-3 w-4 shrink-0 text-accent/40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

function CrossLine() {
  return (
    <div className="flex items-center gap-0 shrink-0">
      <span className="text-[10px] font-bold text-danger mx-0.5">⛌</span>
    </div>
  );
}

export function GuardrailsPipeline({
  inputResult,
  outputResult,
  inputGuardEnabled,
  outputGuardEnabled,
}: GuardrailsPipelineProps) {
  const t = useTranslations("Guardrails.pipeline");

  const inputStatus: "neutral" | "pass" | "block" | "flag" | "disabled" =
    !inputGuardEnabled
      ? "disabled"
      : inputResult && !inputResult.passed
        ? "block"
        : inputResult && inputResult.flaggedCategories.length > 0 && inputResult.passed
          ? "flag"
          : inputResult
            ? "pass"
            : "neutral";

  const outputStatus: "neutral" | "pass" | "block" | "flag" | "disabled" =
    !outputGuardEnabled
      ? "disabled"
      : outputResult && !outputResult.passed
        ? "block"
        : outputResult && outputResult.sanitized
          ? "flag"
          : outputResult
            ? "pass"
            : "neutral";

  const inputSubLabel = !inputGuardEnabled
    ? t("disabled")
    : inputResult && !inputResult.passed
      ? t("blocked")
      : inputResult && inputResult.flaggedCategories.length > 0 && inputResult.passed
        ? t("warning")
        : inputResult
          ? t("pass")
          : "";

  const outputSubLabel = !outputGuardEnabled
    ? t("disabled")
    : outputResult && !outputResult.passed
      ? t("flagged")
      : outputResult && outputResult.sanitized
        ? t("sanitized")
        : outputResult
          ? t("pass")
          : "";

  const inputBlocked = !inputGuardEnabled ? false : inputResult?.passed === false;

  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-3">
      <div className="flex items-center justify-center gap-0 overflow-x-auto">
        <NodeBlock label={t("userInput")} status="neutral" />

        <Arrow />

        <NodeBlock
          label={t("inputGuard")}
          subLabel={inputSubLabel}
          status={inputStatus}
        />

        {inputBlocked ? (
          <>
            <CrossLine />
          </>
        ) : (
          <>
            <Arrow />

            <NodeBlock label={t("model")} status="neutral" />

            <Arrow />

            <NodeBlock
              label={t("outputGuard")}
              subLabel={outputSubLabel}
              status={outputStatus}
            />

            <Arrow />
            <NodeBlock label={t("response")} status="neutral" />
          </>
        )}
      </div>
    </div>
  );
}
