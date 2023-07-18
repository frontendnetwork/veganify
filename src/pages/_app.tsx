import "@/styles/style.scss";
import { init } from "@socialgouv/matomo-next";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    init({ url: "https://analytics.vegancheck.me", siteId: "1" });
  }, []);
  return (
    <>
      <NextIntlProvider messages={pageProps.messages}>
        <Component {...pageProps} />
      </NextIntlProvider>
    </>
  );
}
