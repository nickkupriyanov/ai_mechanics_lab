"use client";

import { useTranslations, useLocale } from "next-intl";
import type { AttackType } from "@/lib/simulation/prompt-injection";
import { getModelResponse } from "@/lib/simulation/prompt-injection";

type InjectionResultPanelProps = {
  queryId: string;
  attackType: AttackType;
  enableHierarchy: boolean;
  enableSanitization: boolean;
  poisonedDocActive: boolean;
};

export function InjectionResultPanel({
  queryId,
  attackType,
  enableHierarchy,
  enableSanitization,
  poisonedDocActive,
}: InjectionResultPanelProps) {
  const t = useTranslations("PromptInjection.result");
  const locale = useLocale();
  const isRu = locale === "ru";

  const safetyActive = enableHierarchy || enableSanitization;

  const withProtection = getModelResponse({
    queryId,
    isEnglish: !isRu,
    enableHierarchy: true,
    enableSanitization: true,
    poisonedDocActive,
    attackType,
  });

  const withoutProtection = getModelResponse({
    queryId,
    isEnglish: !isRu,
    enableHierarchy: false,
    enableSanitization: false,
    poisonedDocActive,
    attackType,
  });

  const isCompromised = poisonedDocActive && !safetyActive;
  const current = getModelResponse({
    queryId,
    isEnglish: !isRu,
    enableHierarchy,
    enableSanitization,
    poisonedDocActive,
    attackType,
  });

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
        {isCompromised && (
          <span className="rounded bg-danger/15 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-danger">
            {t("compromised")}
          </span>
        )}
        {!isCompromised && safetyActive && poisonedDocActive && (
          <span className="rounded bg-success/15 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-success">
            {t("protected")}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Current response */}
        <div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("currentResponse")}
          </span>
          <div
            className={`mt-2 rounded-md border p-3 ${
              isCompromised
                ? "border-danger/30 bg-danger/[0.03]"
                : "border-accent/20 bg-accent/[0.02]"
            }`}
          >
            <p
              className={`text-[12px] leading-relaxed whitespace-pre-wrap ${
                isCompromised ? "text-danger/90" : "text-secondary"
              }`}
            >
              {current.response}
            </p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="border-t border-border pt-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("comparison")}
          </span>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {/* With protection */}
            <div>
              <span className="inline-block rounded bg-success/15 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-success mb-2">
                {t("withProtection")}
              </span>
              <div className="rounded-md border border-success/20 bg-success/[0.02] p-3">
                <p className="text-[11px] leading-relaxed text-secondary whitespace-pre-wrap">
                  {withProtection.response}
                </p>
              </div>
            </div>

            {/* Without protection */}
            <div>
              <span className="inline-block rounded bg-danger/15 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-danger mb-2">
                {t("withoutProtection")}
              </span>
              <div className="rounded-md border border-danger/20 bg-danger/[0.02] p-3">
                <p className="text-[11px] leading-relaxed text-danger/80 whitespace-pre-wrap">
                  {withoutProtection.response}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
