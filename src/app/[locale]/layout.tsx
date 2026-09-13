import "@/app/globals.css";
import { MotionConfig } from "motion/react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { monaSans } from "@/app/fonts";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Veganify",
  },
  applicationName: "Veganify",
  description:
    "Are you unsure whether a product is vegan or not? With Veganify you can scan the bar code of an item while shopping and check whether it is vegan or not and that without a lot of other unnecessary information! Try it out now!",
  icons: {
    apple: "../img/icon.png",
    icon: "../favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    images: [{ url: "https://veganify.app/img/og_image.png" }],
    siteName: "Veganify",
    title: "Veganify",
    type: "website",
    url: "https://veganify.app",
  },
  title: "Is it vegan? – Veganify",
  twitter: {
    card: "summary_large_image",
    images: [{ alt: "Veganify", url: "https://veganify.app/img/og_image.png" }],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: [
    { color: "#f4f8fb", media: "(prefers-color-scheme: light)" },
    { color: "#13171e", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
  width: "device-width",
};

/**
 * Applies the stored OLED preference before first paint, so a true-black
 * theme never flashes through the default dark surface.
 */
const oledPrepaintScript = `try{if(localStorage.getItem("oled")==="true"){document.documentElement.setAttribute("data-theme","oled")}}catch(e){}`;

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <html className={monaSans.variable} lang={locale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: oledPrepaintScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MotionConfig reducedMotion="user">
            <a
              className="sr-only-focusable bg-accent text-accent-foreground focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:shadow-elev-3 focus:transition-none"
              href="#main"
            >
              {t("skiptomain")}
            </a>
            <Nav />
            {children}
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
