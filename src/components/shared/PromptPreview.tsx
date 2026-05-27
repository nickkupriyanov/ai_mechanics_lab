"use client";

import { useTranslations } from "next-intl";

type PromptPreviewProps = {
  title?: string;
  blocks?: { label: string; content: string; tokens: number }[];
  totalTokens?: number;
  contextLimit?: number;
};

export function PromptPreview({
  title,
  blocks,
  totalTokens,
  contextLimit,
}: PromptPreviewProps) {
  const t = useTranslations("Shared");

  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
            {title ?? t("promptPreview")}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 py-10 text-sm text-muted">
          {t("noContent")}
        </div>
      </div>
    );
  }

  const usagePct =
    totalTokens && contextLimit
      ? Math.min(100, Math.round((totalTokens / contextLimit) * 100))
      : null;

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {title}
        </span>
        {totalTokens !== undefined && (
          <span className="font-mono text-[11px] text-muted">
            {totalTokens}
            {contextLimit ? ` / ${contextLimit}` : ""} {t("tokensUnit")}
          </span>
        )}
      </div>

      {usagePct !== null && (
        <div className="border-b border-border px-4 py-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usagePct}%`,
                backgroundColor:
                  usagePct > 90
                    ? "var(--color-danger)"
                    : usagePct > 70
                      ? "var(--color-warning)"
                      : "var(--color-success)",
              }}
            />
          </div>
        </div>
      )}

      <div className="divide-y divide-border p-4">
        {blocks.map((block, i) => (
          <div key={i} className="py-2 first:pt-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
                {block.label}
              </span>
              <span className="text-[10px] font-mono text-muted/50">
                {block.tokens} {t("tokensUnit")}
              </span>
            </div>
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-secondary font-mono">
              {block.content.slice(0, 500)}
              {block.content.length > 500 && (
                <span className="text-muted">…</span>
              )}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
