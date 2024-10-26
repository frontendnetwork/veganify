import "@/styles/style.scss";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";

import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Is it vegan? – Veganify",
  description:
    "Are you unsure whether a product is vegan or not? With Veganify you can scan the bar code of an item while shopping and check whether it is vegan or not and that without a lot of other unnecessary information! Try it out now!",
  openGraph: {
    title: "Veganify",
    type: "website",
    url: "https://veganify.app",
    images: [{ url: "https://veganify.app/img/og_image.png" }],
    siteName: "Veganify",
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "https://veganify.app/img/og_image.png", alt: "Veganify" }],
  },
  appleWebApp: {
    capable: true,
    title: "Veganify",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "../favicon.ico",
    apple: "../img/icon.png",
  },
  applicationName: "Veganify",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7f8fa6" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout(
  props: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div id="modal-root"></div>
          <Nav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
