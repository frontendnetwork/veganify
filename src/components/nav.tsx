import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl';

export default function Nav() {
  const t = useTranslations('Nav');
  const router = useRouter();
  useEffect(() => {
    const localStorageValue = localStorage.getItem("oled");
    if (
      localStorageValue === "true" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "oled");
      const themeColorMeta = document.querySelector(
        'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'
      );
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#000");
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta
          name="description"
          content={t('description')} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <meta property="og:title" content="Ist es Vegan? - Vegan Check" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vegancheck.me" />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://vegancheck.me/img/icon-512x512.png"
        />
        <meta name="twitter:image:alt" content="VeganCheck.me" />

        <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico" />
        <link rel="apple-touch-icon" href="../img/icon.png" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#7f8fa6"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#141414"
        />

        <link rel="manifest" href="/manifest.json" />

        <meta name="application-name" content="VeganCheck" />
        <meta name="apple-mobile-web-app-title" content="VeganCheck" />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_14_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_14_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_11__iPhone_XR_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="../img/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
        />
      </Head>
      <nav className="nav">
        <div className="flex-container">
          <div
            className={
              router.pathname == "/" ? "flex-item active" : "flex-item"
            }
          >
            <Link href="/">
              <span className="icon icon-vegancheck"></span>
              <span className="menu-item">{t('home')}</span>
            </Link>
          </div>
          <div
            className={
              router.pathname == "/ingredients"
                ? "flex-item active"
                : "flex-item"
            }
          >
            <Link href="/ingredients">
              <span className="icon icon-ingredients"></span>
              <span className="menu-item">{t('ingredientcheck')}</span>
            </Link>
          </div>
          <div
            className={
              ["/more", "/tos", "/privacy-policy", "/impressum"].includes(
                router.pathname
              )
                ? "flex-item active"
                : "flex-item"
            }
          >
            <Link href="/more">
              <span className="icon icon-ellipsis"></span>
              <span className="menu-item">{t('more')}</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`..//locales/${locale}.json`)).default
    }
  };
}