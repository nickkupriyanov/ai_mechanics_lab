"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";

type SceneShellProps = {
  title?: string;
  simplified?: boolean;
  children: ReactNode;
};

export function SceneShell({ title, simplified, children }: SceneShellProps) {
  const t = useTranslations("Shared");

  return (
    <div className="p-6">
      <div className="rounded-lg border border-border bg-surface-elevated">
        {title && (
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-display font-semibold tracking-wide text-primary uppercase">
              {title}
            </h2>
            {simplified && (
              <span className="rounded border border-border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
                {t("simulated")}
              </span>
            )}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
