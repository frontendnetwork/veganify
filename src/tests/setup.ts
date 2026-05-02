import { mock } from "bun:test";

import "@testing-library/jest-dom";

global.console = {
  ...console,
  log: mock(),
  debug: mock(),
  info: mock(),
  warn: mock(),
  error: mock(),
};

mock.module("next/navigation", () => ({
  useRouter() {
    return {
      push: mock(),
      replace: mock(),
      prefetch: mock(),
      back: mock(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "";
  },
}));

mock.module("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));
