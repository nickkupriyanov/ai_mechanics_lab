"use client";

import { useTranslations } from "next-intl";
import { ConceptNavigation } from "./ConceptNavigation";

export function Sidebar() {
  const t = useTranslations("Layout");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="px-3 pb-3">
        <h2 className="px-2 text-[11px] font-mono font-medium uppercase tracking-widest text-muted">
          {t("concepts")}
        </h2>
      </div>
      <ConceptNavigation />
      <div className="mt-auto border-t border-border px-3 pt-3">
        <a
          href="https://deerflow.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md px-2 py-1.5 text-[10px] font-mono text-muted/40 transition-colors hover:text-muted/70"
        >
          {t("deerflow")}
        </a>
      </div>
    </div>
  );
}
