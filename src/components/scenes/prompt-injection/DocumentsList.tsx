"use client";

import { useTranslations, useLocale } from "next-intl";
import { documents } from "@/lib/simulation/prompt-injection";
import type { InjectionDocument } from "@/lib/simulation/prompt-injection";

type DocumentsListProps = {
  showInjected: boolean;
  poisonedDocActive: boolean;
  enableSanitization: boolean;
};

export function DocumentsList({
  showInjected,
  poisonedDocActive,
  enableSanitization,
}: DocumentsListProps) {
  const t = useTranslations("PromptInjection.documents");
  const locale = useLocale();
  const isRu = locale === "ru";

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: documents.length })}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {documents.filter((d) => d.isPoisoned).length} {t("poisoned")}
        </span>
      </div>
      <div className="max-h-[520px] space-y-2 overflow-y-auto p-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            isRu={isRu}
            showInjected={showInjected}
            isActive={
              doc.isPoisoned ? poisonedDocActive : true
            }
            isSanitized={doc.isPoisoned && poisonedDocActive && enableSanitization}
          />
        ))}
      </div>
    </div>
  );
}

function DocumentCard({
  doc,
  isRu,
  showInjected,
  isActive,
  isSanitized,
}: {
  doc: InjectionDocument;
  isRu: boolean;
  showInjected: boolean;
  isActive: boolean;
  isSanitized: boolean;
}) {
  const t = useTranslations("PromptInjection.documents");
  const title = isRu ? doc.titleRu : doc.title;
  const content = isRu ? doc.contentRu : doc.content;
  const injectedContent = isRu ? doc.injectedContentRu : doc.injectedContent;

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 transition-colors overflow-hidden ${
        doc.isPoisoned
          ? isActive
            ? "border-danger/40 bg-danger/[0.04] border-l-2 border-l-danger/60"
            : "border-danger/20 bg-danger/[0.02] border-l-2 border-l-danger/40 opacity-60"
          : "border-accent/20 bg-accent/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-medium text-primary">{title}</span>
            {doc.isPoisoned && (
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider ${
                  isActive
                    ? "bg-danger/15 text-danger"
                    : "bg-danger/10 text-danger/60"
                }`}
              >
                {t("poisonedBadge")}
              </span>
            )}
            {isSanitized && (
              <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider text-success">
                {t("sanitized")}
              </span>
            )}
          </div>

          <p className="text-[12px] leading-relaxed text-secondary line-clamp-3">
            {content}
          </p>

          {doc.isPoisoned && showInjected && isActive && (
            <div className="mt-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2">
              <span className="text-[9px] font-mono font-medium uppercase tracking-wider text-danger">
                {t("hiddenInjection")}
              </span>
              <p className="mt-1 text-[11px] leading-relaxed text-danger/90 font-mono whitespace-pre-wrap break-all">
                {injectedContent}
              </p>
            </div>
          )}
        </div>

        {!isActive && doc.isPoisoned && (
          <span className="shrink-0 text-[10px] font-mono text-muted">
            {t("inactive")}
          </span>
        )}
      </div>
    </div>
  );
}
