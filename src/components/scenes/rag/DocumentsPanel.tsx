"use client";

import { useTranslations } from "next-intl";
import { mockDocuments } from "@/lib/simulation/rag-data";

export function DocumentsPanel() {
  const t = useTranslations("Rag.documents");
  const td = useTranslations("RagData.documents");

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
          {t("title", { count: mockDocuments.length })}
        </span>
      </div>
      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-md border border-border bg-surface-elevated p-3"
            >
              <h4 className="mb-1.5 text-[13px] font-medium text-primary">
                {td(`${doc.id}.title`)}
              </h4>
              <p className="text-[11px] leading-relaxed text-muted line-clamp-3">
                {(td(`${doc.id}.content`) || doc.content).slice(0, 200)}…
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted">
                  {t("tokens", { n: Math.ceil(doc.content.length / 4) })}
                </span>
                <span className="text-[10px] font-mono text-muted">
                  {t("chars", { n: doc.content.length })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
