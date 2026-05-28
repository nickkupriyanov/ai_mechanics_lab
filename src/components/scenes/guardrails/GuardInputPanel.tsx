"use client";

import { useTranslations } from "next-intl";
import type { GuardScenario, GuardResult, Strictness, ContentCategory } from "@/lib/simulation/guardrails";
import {
  getSeverityForStrictness,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/simulation/guardrails";

type GuardInputPanelProps = {
  scenario: GuardScenario;
  inputResult: GuardResult | null;
  inputGuardEnabled: boolean;
  strictness: Strictness;
  enabledCategories: ContentCategory[];
};

export function GuardInputPanel({
  scenario,
  inputResult,
  inputGuardEnabled,
  strictness,
  enabledCategories,
}: GuardInputPanelProps) {
  const t = useTranslations("Guardrails.input");

  const relevantCategories = scenario.expectedGuard === "input" || scenario.expectedGuard === "both"
    ? scenario.categories
    : [];

  return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <div className="border-b border-border px-4 py-2.5">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* User input display */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-accent">
            {t("userInputLabel")}
          </span>
          <div className="rounded-md border border-border bg-surface px-3 py-2.5">
            <p className="text-sm text-primary leading-relaxed">{scenario.input}</p>
          </div>
        </div>

        {/* Input guard scan report */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
            {t("scanReport")}
          </span>

          {/* Status banner */}
          {!inputGuardEnabled ? (
            <div className="rounded-md border border-border bg-surface-hover px-3 py-2">
              <span className="text-[11px] font-medium text-muted">{t("inputGuardDisabled")}</span>
              <p className="mt-0.5 text-[11px] text-muted">{t("inputGuardDisabledDesc")}</p>
            </div>
          ) : relevantCategories.length === 0 ? (
            <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-success">✓</span>
                <span className="text-[11px] font-medium text-success">{t("clean")}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-success/80">{t("cleanDesc")}</p>
            </div>
          ) : inputResult && !inputResult.passed ? (
            <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-danger">✗</span>
                <span className="text-[11px] font-medium text-danger">{t("blocked")}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-danger/80">{t("blockedDesc")}</p>
            </div>
          ) : inputResult && inputResult.flaggedCategories.length > 0 && inputResult.passed ? (
            <div className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-warning">⚠</span>
                <span className="text-[11px] font-medium text-warning">{t("warning")}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-warning/80">{t("warningDesc")}</p>
            </div>
          ) : inputResult ? (
            <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-success">✓</span>
                <span className="text-[11px] font-medium text-success">{t("passed")}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-success/80">{t("passedDesc")}</p>
            </div>
          ) : null}

          {/* Category scan table */}
          {inputGuardEnabled && relevantCategories.length > 0 && (
            <div className="rounded-md border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {relevantCategories.map((cat) => {
                  const enabled = enabledCategories.includes(cat);
                  const severity = getSeverityForStrictness(strictness, cat);
                  const flagged = enabled;
                  const severityColor = {
                    critical: "text-danger",
                    high: "text-warning",
                    medium: "text-muted",
                    low: "text-muted",
                  };

                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between px-3 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: getCategoryColor(cat) }}
                        />
                        <span className="text-[11px] text-secondary">
                          {getCategoryLabel(cat)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono uppercase ${severityColor[severity]}`}>
                          {severity}
                        </span>
                        {flagged ? (
                          <span className="text-[10px] font-bold text-danger">FLAG</span>
                        ) : (
                          <span className="text-[10px] text-muted">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
