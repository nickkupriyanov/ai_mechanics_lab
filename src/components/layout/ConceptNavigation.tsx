"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConceptMeta } from "@/lib/useConceptMeta";
import type { TranslatedConcept } from "@/lib/useConceptMeta";

function ConceptLink({ concept, active }: { concept: TranslatedConcept; active: boolean }) {
  const t = useTranslations();
  const isAvailable = concept.status === "available";
  const pathname = usePathname();
  // Extract locale from pathname
  const locale = pathname.split("/")[1] || "ru";
  const href = isAvailable ? `/${locale}/concepts/${concept.slug}` : "#";

  return (
    <Link
      href={href}
      aria-disabled={!isAvailable}
      tabIndex={isAvailable ? 0 : -1}
      className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        !isAvailable
          ? "cursor-not-allowed opacity-40"
          : active
            ? "bg-accent/10 text-accent"
            : "text-secondary hover:bg-surface-hover hover:text-primary"
      }`}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: concept.color }}
      />
      <span className="flex-1 truncate font-medium">{concept.translatedTitle}</span>
      {concept.status === "planned" && (
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
          {t("Shared.soon")}
        </span>
      )}
      {active && isAvailable && (
        <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
}

export function ConceptNavigation() {
  const t = useTranslations("Layout");
  const pathname = usePathname();
  const { available, planned } = useConceptMeta();

  return (
      <nav className="space-y-0.5 px-3" aria-label={t("concepts")}>
      {available.map((concept) => (
        <ConceptLink
          key={concept.slug}
          concept={concept}
          active={pathname.includes(`/concepts/${concept.slug}`)}
        />
      ))}
      {planned.length > 0 && (
        <>
          <div className="px-3 pb-1 pt-4">
            <h3 className="text-[10px] font-mono font-medium uppercase tracking-widest text-muted">
              {t("comingNext")}
            </h3>
          </div>
          {planned.map((concept) => (
            <ConceptLink
              key={concept.slug}
              concept={concept}
              active={false}
            />
          ))}
        </>
      )}
    </nav>
  );
}
