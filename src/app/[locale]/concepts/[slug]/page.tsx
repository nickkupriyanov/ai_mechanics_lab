import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getConcept, getAvailableConcepts, getRelatedConcepts } from "@/lib/concepts";
import { ExplanationPanel, ExplanationSection } from "@/components/shared/ExplanationPanel";
import { ConceptSceneClient } from "@/components/shared/ConceptSceneClient";
import Link from "next/link";
import type { ConceptSlug, Concept } from "@/types/concept";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const available = getAvailableConcepts();
  const locales = ["ru", "en"];
  return locales.flatMap((locale) =>
    available.map((c) => ({ slug: c.slug, locale })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const concept = getConcept(slug);
  if (!concept || concept.status !== "available") return { title: "Not Found" };

  const meta = await getTranslations({ locale, namespace: "ConceptsMeta" });
  const title = meta(`${slug}.title`);
  const description = meta(`${slug}.shortDescription`);

  return {
    title,
    description,
    openGraph: {
      title: `${title} — AI Mechanics Lab`,
      description,
    },
    alternates: {
      languages: {
        ru: `/ru/concepts/${slug}`,
        en: `/en/concepts/${slug}`,
      },
    },
  };
}

export default async function ConceptPage({ params }: Props) {
  const { slug, locale } = await params;
  const concept = getConcept(slug);

  if (!concept || concept.status !== "available") notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Concepts" });
  const meta = await getTranslations({ locale, namespace: "ConceptsMeta" });
  const related = getRelatedConcepts(concept.slug as ConceptSlug);

  const hasExplanation = ["rag", "embeddings", "vector-search", "context-window", "tool-calling", "mcp", "agents", "memory", "prompt-injection", "evaluation", "guardrails"].includes(slug);

  const translatedTitle = meta(`${slug}.title`);
  const translatedDescription = meta(`${slug}.shortDescription`);

  return (
    <div className="bp-grid min-h-full">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Concept header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: concept.color }}
            />
            <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-muted">
              {concept.level}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
            {translatedTitle}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-secondary">
            {translatedDescription}
          </p>
        </div>

        {/* Scene */}
        <ConceptSceneClient
          slug={concept.slug as ConceptSlug}
          title={concept.title}
        />

        {/* Explanation */}
        <ExplanationBlock
          slug={slug}
          hasExplanation={hasExplanation}
          t={t}
          conceptTitle={concept.title}
        />

        {/* Previous / Next navigation */}
        <ConceptNav
          currentSlug={concept.slug as ConceptSlug}
          concepts={getAvailableConcepts()}
          locale={locale}
          t={t}
        />

        {/* Related concepts */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-muted">
              {t("relatedConcepts")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/${locale}/concepts/${rc.slug}`}
                  className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-sm text-secondary transition-colors hover:border-border-hover hover:text-primary"
                >
                  {rc.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConceptNav({
  currentSlug,
  concepts,
  locale,
  t,
}: {
  currentSlug: ConceptSlug;
  concepts: Concept[];
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const sorted = concepts
    .filter((c) => c.status === "available")
    .sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((c) => c.slug === currentSlug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/${locale}/concepts/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div>
            <span className="text-[10px] font-mono text-muted">{t("previous")}</span>
            <p className="font-medium">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      <div className="text-center">
        <span className="text-[10px] font-mono text-muted">
          {currentIndex + 1} / {sorted.length}
        </span>
      </div>
      {next ? (
        <Link
          href={`/${locale}/concepts/${next.slug}`}
          className="group flex items-center gap-2 text-right text-sm text-muted hover:text-primary"
        >
          <div>
            <span className="text-[10px] font-mono text-muted">{t("next")}</span>
            <p className="font-medium">{next.title}</p>
          </div>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

function ExplanationBlock({
  slug,
  hasExplanation,
  t,
  conceptTitle,
}: {
  slug: string;
  hasExplanation: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  conceptTitle: string;
}) {
  const conceptT = hasExplanation
    ? t[slug as keyof typeof t]
    : null;

  return (
    <div className="mt-8 rounded-lg border border-border bg-surface-elevated p-6">
      <ExplanationPanel>
        <ExplanationSection title={t("whatIsHappening")}>
          {conceptT ? (
            <>
              <ol className="list-decimal space-y-1.5 pl-4">
                {conceptT.whatIsHappening_steps?.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <p className="mt-3">{conceptT.whatIsHappening_summary}</p>
            </>
          ) : (
            <p>{t("placeholder.whatIsHappening", { title: conceptTitle })}</p>
          )}
        </ExplanationSection>

        <ExplanationSection title={t("howItBreaks")}>
          {conceptT ? (
            <ul className="list-disc space-y-1.5 pl-4">
              {conceptT.howItBreaks?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{t("placeholder.howItBreaks")}</p>
          )}
        </ExplanationSection>

        <ExplanationSection title={t("realWorldUsage")}>
          {conceptT ? (
            <p>{conceptT.realWorldUsage}</p>
          ) : (
            <p>{t("placeholder.realWorldUsage", { title: conceptTitle })}</p>
          )}
        </ExplanationSection>
      </ExplanationPanel>
    </div>
  );
}
