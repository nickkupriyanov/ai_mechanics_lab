"use client";
import { useTranslations } from "next-intl";
import { getAvailableConcepts, getPlannedConcepts } from "@/lib/concepts";
import type { Concept } from "@/types/concept";

export type TranslatedConcept = Concept & {
  translatedTitle: string;
  translatedDescription: string;
};

export function useConceptMeta(): {
  available: TranslatedConcept[];
  planned: TranslatedConcept[];
  getBySlug: (slug: string) => TranslatedConcept | undefined;
} {
  const t = useTranslations("ConceptsMeta");
  const available = getAvailableConcepts();
  const planned = getPlannedConcepts();

  const translate = (c: Concept): TranslatedConcept => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = t.raw(c.slug) as any;
    return {
      ...c,
      translatedTitle: meta?.title ?? c.title,
      translatedDescription: meta?.shortDescription ?? c.shortDescription,
    };
  };

  return {
    available: available.map(translate),
    planned: planned.map(translate),
    getBySlug: (slug: string) => {
      const concept = [...available, ...planned].find(c => c.slug === slug);
      return concept ? translate(concept) : undefined;
    },
  };
}
