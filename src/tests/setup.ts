import { mock } from "bun:test";

import "@testing-library/jest-dom";

global.console = {
  ...console,
  debug: mock(),
  error: mock(),
  info: mock(),
  log: mock(),
  warn: mock(),
};

mock.module("next/navigation", () => ({
  usePathname() {
    return "";
  },
  useRouter() {
    return {
      back: mock(),
      prefetch: mock(),
      push: mock(),
      replace: mock(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

mock.module("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));
