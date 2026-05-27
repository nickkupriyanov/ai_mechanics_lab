import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "always",
});

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
