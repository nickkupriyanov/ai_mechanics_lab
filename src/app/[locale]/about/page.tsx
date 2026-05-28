import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAvailableConcepts } from "@/lib/concepts";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description: "AI Mechanics Lab — interactive visual playground for understanding how AI systems work.",
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");
  const concepts = getAvailableConcepts();

  return (
    <div className="bp-grid min-h-full">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
          {t("title")}
        </h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-secondary">
          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("whatIsHeading")}
            </h2>
            <p>{t("whatIsText1")}</p>
            <p className="mt-3">{t("whatIsText2")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("whyHeading")}
            </h2>
            <p>{t("whyText1")}</p>
            <p className="mt-3">{t("whyText2")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("conceptsHeading")}
            </h2>
            <p className="mb-4">{t("conceptsText")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {concepts.map((c) => (
                <Link
                  key={c.slug}
                  href={`/concepts/${c.slug}`}
                  className="flex items-center gap-2.5 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm transition-colors hover:border-border-hover hover:text-primary"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.title}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("whySimulationsHeading")}
            </h2>
            <p>{t("whySimulationsText")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("whoHeading")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                <p className="text-[11px] font-mono text-accent">Frontend / Fullstack Devs</p>
                <p className="mt-1 text-[13px]">{t("audienceDevs")}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                <p className="text-[11px] font-mono text-accent">Beginner AI Engineers</p>
                <p className="mt-1 text-[13px]">{t("audienceEngineers")}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                <p className="text-[11px] font-mono text-accent">Product Managers</p>
                <p className="mt-1 text-[13px]">{t("audiencePMs")}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                <p className="text-[11px] font-mono text-accent">Technical Founders</p>
                <p className="mt-1 text-[13px]">{t("audienceFounders")}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[11px] font-mono font-medium uppercase tracking-widest text-accent">
              {t("coreIdeaHeading")}
            </h2>
            <blockquote className="border-l-2 border-accent/30 pl-4 text-base text-primary">
              {t("coreIdea")}
            </blockquote>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
