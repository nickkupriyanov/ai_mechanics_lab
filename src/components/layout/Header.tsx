"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header() {
  const t = useTranslations("Layout");
  const locale = useLocale();
  const pathname = usePathname();

  // Strip locale prefix to get the route without it
  const routePath = pathname.replace(/^\/(ru|en)/, "") || "/";

  return (
    <div className="flex items-center gap-3">
      <Link href={`/${locale}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <svg
          className="h-6 w-6 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <line x1="6.5" y1="10" x2="6.5" y2="14" strokeDasharray="1 2" />
          <line x1="17.5" y1="10" x2="17.5" y2="14" strokeDasharray="1 2" />
          <line x1="10" y1="6.5" x2="14" y2="6.5" strokeDasharray="1 2" />
          <line x1="10" y1="17.5" x2="14" y2="17.5" strokeDasharray="1 2" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-display font-semibold tracking-wide text-primary uppercase">
            {t("appName")}
          </span>
          <span className="text-[10px] font-mono text-muted tracking-wider">
            {t("tagline")}
          </span>
        </div>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <Link
          href={`/en${routePath}`}
          className={`rounded px-2 py-1 text-[11px] font-mono font-medium transition-colors ${
            locale === "en"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-primary"
          }`}
        >
          EN
        </Link>
        <Link
          href={`/ru${routePath}`}
          className={`rounded px-2 py-1 text-[11px] font-mono font-medium transition-colors ${
            locale === "ru"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-primary"
          }`}
        >
          RU
        </Link>
      </div>
    </div>
  );
}
