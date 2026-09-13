import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  locales: ["en", "de", "es", "fr", "pl", "cz", "pt-br"],
});
