import { GetStaticPropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Nav() {
  const t = useTranslations("Nav");
  const router = useRouter();
  useEffect(() => {
    const localStorageValue = localStorage.getItem("oled");
    if (
      localStorageValue === "true" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "oled");
      const themeColorMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#000");
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <meta property="og:title" content={t("title")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veganify.app" />

        <meta
          name="twitter:image:src"
          content="https://veganify.app/img/og_image.png"
        />
        <meta property="twitter:image:alt" content="Veganify" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image"
          content="https://veganify.app/img/og_image.png"
        />
        <meta property="og:image:alt" content="Veganify" />
        <meta property="og:site_name" content="Veganify" />
        <meta property="og:type" content="object" />

        <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico" />
        <link rel="apple-touch-icon" href="../img/icon.png" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-starturl" content="/" />

        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#7f8fa6" key="pcl" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141414" key="pcd" />

        <meta name="application-name" content="Veganify" />
        <meta name="apple-mobile-web-app-title" content="Veganify" />
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
              <span className="menu-item">{t("home")}</span>
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
              <span className="menu-item">{t("ingredientcheck")}</span>
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
              <span className="menu-item">{t("more")}</span>
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
      messages: (await import(`..//locales/${locale}.json`)).default,
    },
  };
}
