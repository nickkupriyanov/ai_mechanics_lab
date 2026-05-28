"use client";

import { useTranslations } from "next-intl";

type InjectionPipelineProps = {
  injectionDetected: boolean;
};

export function InjectionPipeline({ injectionDetected }: InjectionPipelineProps) {
  const t = useTranslations("PromptInjection.pipeline");

  const stages = [
    { label: t("systemPrompt"), active: true },
    { label: t("userQuery"), active: true },
    { label: t("retrieval"), active: true },
    {
      label: t("detection"),
      active: true,
      danger: injectionDetected,
      value: injectionDetected ? t("detected") : t("clean"),
    },
    { label: t("context"), active: true },
    { label: t("response"), active: true },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-3">
      <div className="flex items-center justify-center gap-0 overflow-x-auto">
        {stages.map((stage, i, arr) => (
          <div key={stage.label} className="flex items-center shrink-0">
            <div
              className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[90px] transition-colors ${
                stage.danger
                  ? "bg-danger/10 border border-danger/30"
                  : stage.active
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-surface-hover border border-border opacity-50"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-medium uppercase tracking-wider ${
                  stage.danger ? "text-danger" : "text-accent"
                }`}
              >
                {stage.label}
              </span>
              {stage.value && (
                <span
                  className={`mt-0.5 text-[10px] font-medium truncate max-w-[90px] ${
                    stage.danger ? "text-danger" : "text-primary"
                  }`}
                >
                  {stage.value}
                </span>
              )}
            </div>
            {i < arr.length - 1 && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
