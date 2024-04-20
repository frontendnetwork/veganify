import "@/styles/style.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <NextIntlClientProvider
        locale={router.locale}
        timeZone="Europe/Vienna"
        messages={pageProps.messages}
      >
        <Component {...pageProps} />
      </NextIntlClientProvider>
    </>
  );
}
