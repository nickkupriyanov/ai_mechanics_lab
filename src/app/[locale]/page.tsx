"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { useConceptMeta } from "@/lib/useConceptMeta";
import type { TranslatedConcept } from "@/lib/useConceptMeta";

function ConceptCard({ concept, index, locale }: { concept: TranslatedConcept; index: number; locale: string }) {
  const t = useTranslations("Home");
  const isAvailable = concept.status === "available";
  const href = isAvailable ? `/${locale}/concepts/${concept.slug}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        aria-disabled={!isAvailable}
        tabIndex={isAvailable ? 0 : -1}
        className={`group relative block rounded-lg border bg-surface-elevated p-5 transition-colors ${
          isAvailable
            ? "border-border hover:border-border-hover hover:bg-surface-hover"
            : "cursor-not-allowed border-border/40 opacity-50"
        }`}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: concept.color }}
          />
          <h3 className="text-base font-display font-semibold tracking-wide text-primary">
            {concept.translatedTitle}
          </h3>
          {!isAvailable && (
            <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
              {/* Soon — use shared key if available, fallback to concept.specific */}
            </span>
          )}
        </div>

        <p className="text-[13px] leading-relaxed text-secondary">
          {concept.translatedDescription}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
            {concept.level}
          </span>
          {isAvailable && (
            <span className="flex items-center gap-1 text-[13px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              {t("explore")}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const { available, planned } = useConceptMeta();

  return (
    <div className="bp-grid min-h-full">
      {/* Hero */}
      <div className="border-b border-border bg-surface-elevated/60 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              {t("heroLabel")}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              {t("heroTitlePart1")}
              <span className="text-accent">{t("heroTitleAccent")}</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-secondary">
              {t("heroText")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Available concepts */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="mb-1 text-[11px] font-mono font-medium uppercase tracking-widest text-muted">
            {t("scenesHeading")}
          </h2>
          <p className="mb-8 text-sm text-muted">
            {t("scenesSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((concept, i) => (
            <ConceptCard key={concept.slug} concept={concept} index={i} locale={locale} />
          ))}
        </div>

        {/* Planned concepts */}
        {planned.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-1 text-[11px] font-mono font-medium uppercase tracking-widest text-muted">
              {t("comingNextHeading")}
            </h2>
            <p className="mb-8 text-sm text-muted">
              {t("comingNextSubtitle")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {planned.map((concept, i) => (
                <ConceptCard
                  key={concept.slug}
                  concept={concept}
                  index={i + available.length}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted">{t("footerLine")}</p>
            <a
              href="https://deerflow.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-muted/40 transition-colors hover:text-muted/70"
            >
              ✦ Deerflow
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
