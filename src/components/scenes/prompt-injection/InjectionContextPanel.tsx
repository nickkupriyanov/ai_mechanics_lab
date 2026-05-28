"use client";

import { useTranslations, useLocale } from "next-intl";
import { documents, queries, systemPrompt } from "@/lib/simulation/prompt-injection";

type InjectionContextPanelProps = {
  selectedQueryId: string;
  poisonedDocActive: boolean;
  enableSanitization: boolean;
  injectionDetected: boolean;
};

export function InjectionContextPanel({
  selectedQueryId,
  poisonedDocActive,
  enableSanitization,
  injectionDetected,
}: InjectionContextPanelProps) {
  const t = useTranslations("PromptInjection.context");
  const tShared = useTranslations("Shared");
  const locale = useLocale();
  const isRu = locale === "ru";

  const query = queries.find((q) => q.id === selectedQueryId);
  const queryText = isRu ? query?.queryRu ?? "" : query?.query ?? "";
  const sysPrompt = isRu ? systemPrompt.ru : systemPrompt.en;

  const retrievedDocs = poisonedDocActive
    ? documents.filter((d) => d.isPoisoned)
    : documents.filter((d) => !d.isPoisoned).slice(0, 2);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Injection status */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-secondary">
            {t("injectionDetected")}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium uppercase ${
              injectionDetected
                ? "bg-danger/15 text-danger"
                : "bg-success/15 text-success"
            }`}
          >
            {injectionDetected ? t("yes") : t("no")}
          </span>
          {enableSanitization && poisonedDocActive && (
            <span className="rounded bg-success/15 px-2 py-0.5 text-[10px] font-mono font-medium uppercase text-success">
              {t("sanitizedActive")}
            </span>
          )}
        </div>

        {/* Prompt preview */}
        <div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
            {tShared("promptPreview")}
          </span>
          <div className="mt-2 max-h-[400px] overflow-y-auto rounded-md border border-border bg-surface-elevated p-3">
            <pre className="whitespace-pre-wrap break-words text-[10px] leading-relaxed text-secondary font-mono">
              <span className="text-muted">{tShared("systemLabel")}</span>
              {"\n"}
              <span className="text-success/80">{sysPrompt}</span>
              {"\n\n"}
              <span className="text-muted">{tShared("userLabel")}</span>
              {"\n"}
              <span className="text-accent">{queryText}</span>
              {"\n\n"}
              <span className="text-muted">{t("retrievedLabel")}</span>
              {"\n"}
              {retrievedDocs.map((doc) => {
                const content = isRu ? doc.contentRu : doc.content;
                const injected = isRu ? doc.injectedContentRu : doc.injectedContent;
                return (
                  <span key={doc.id}>
                    <span className="text-muted/60">--- {isRu ? doc.titleRu : doc.title} ---</span>
                    {"\n"}
                    <span className={doc.isPoisoned && !enableSanitization ? "text-danger/80" : ""}>
                      {content}
                    </span>
                    {doc.isPoisoned && !enableSanitization && injected && (
                      <>
                        {"\n"}
                        <span className="text-danger font-medium break-all">{injected}</span>
                      </>
                    )}
                    {doc.isPoisoned && enableSanitization && injected && (
                      <>
                        {"\n"}
                        <span className="text-success/60 break-all line-through">
                          {injected}
                        </span>
                        <span className="text-success/60"> {t("sanitizedOut")}</span>
                      </>
                    )}
                    {"\n\n"}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Active safety measures */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
          <SafetyBadge
            label={t("hierarchy")}
            active={injectionDetected ? false : poisonedDocActive}
          />
          <SafetyBadge
            label={t("sanitization")}
            active={enableSanitization}
          />
        </div>
      </div>
    </div>
  );
}

function SafetyBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider ${
        active
          ? "bg-accent/15 text-accent"
          : "bg-surface-hover text-muted opacity-50"
      }`}
    >
      {label}: {active ? "ON" : "OFF"}
    </span>
  );
}
