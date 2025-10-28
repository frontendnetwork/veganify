import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es", "fr", "pl", "cz", "pt-br"],
  defaultLocale: "en",
});
