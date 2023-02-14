import "@/styles/style.scss";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <NextIntlProvider messages={pageProps.messages}>
      <Script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts='{ "detailed": true }' />
      <Component {...pageProps} />
    </NextIntlProvider>
    </>
  );
}
