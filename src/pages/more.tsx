import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Nav from "@/components/nav";
import Container from "@/components/elements/container";
import ModalWrapper from "@/components/elements/modalwrapper";
import SupportOption from "@/components/elements/contents/donate";
import OLEDMode from "@/components/elements/contents/oledmode";

export default function More() {
  const router = useRouter();
  const t = useTranslations("More");

  function handleLanguageChange(locale: string) {
    setCookie(null, "NEXT_LOCALE", locale, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    router.push("/more", undefined, { locale });
  }

  return (
    <>
      <div id="modal-root"></div>
      <Nav />
      <Container logo={false} backbutton={false}>
        <div className="Grid links">
          <ModalWrapper
            id="donate"
            buttonType="div"
            buttonClass="Grid-cell description"
            buttonText={t("buyusacoffee")}
          >
            <SupportOption />
          </ModalWrapper>
          <div className="Grid-cell icons">
            <span
              className="unknown icon-right-open"
              data-target="donationmodal"
              data-toggle="modal"
            ></span>
          </div>
        </div>
        <div className="Grid links">
          <ModalWrapper
            id="follow"
            buttonType="div"
            buttonClass="Grid-cell description"
            buttonText={t("followus")}
          >
            <span className="center">
              <Image
                src="/img/follow_img.svg"
                className="heading_img"
                alt="Follow us"
                width={48}
                height={48}
              />
              <h1>{t("followus")}</h1>
            </span>
            <a
              href="https://veganism.social/@vegancheck"
              rel="me"
              className="menu twitter"
            >
              <span className="label">Mastodon</span>
              <div className="social-icon">
                <span className="icon-mastodon"></span>
              </div>
            </a>
            <a href="https://instagram.com/vegancheck.me" className="menu">
              <span className="label">Instagram</span>
              <div className="social-icon">
                <span className="icon-instagram"></span>
              </div>
            </a>
            <a
              href="https://facebook.com/vegancheck.me"
              className="menu facebook"
            >
              <span className="label">Facebook</span>
              <div className="social-icon">
                <span className="icon-facebook"></span>
              </div>
            </a>
          </ModalWrapper>
          <div className="Grid-cell icons">
            <span
              className="unknown icon-right-open"
              data-target="donationmodal"
              data-toggle="modal"
            ></span>
          </div>
        </div>
        <Link href="/tos" className="Grid links">
          <div className="Grid-cell description">{t("tos")}</div>
          <div className="Grid-cell icons">
            <span className="unknown icon-right-open"></span>
          </div>
        </Link>
        <Link href="privacy-policy" className="Grid links">
          <div className="Grid-cell description">{t("privacypolicy")}</div>
          <div className="Grid-cell icons">
            <span className="unknown icon-right-open"></span>
          </div>
        </Link>
        <a href="https://jokenetwork.de/vegancheck-api" className="Grid links">
          <div className="Grid-cell description">{t("apidocumentation")}</div>
          <div className="Grid-cell icons">
            <span className="unknown icon-right-open"></span>
          </div>
        </a>
        <Link href="impressum" className="Grid links">
          <div className="Grid-cell description">{t("imprint")}</div>
          <div className="Grid-cell icons">
            <span className="unknown icon-right-open"></span>
          </div>
        </Link>
        <div className="Grid links">
          <ModalWrapper
            id="follow"
            buttonType="div"
            buttonClass="Grid-cell description"
            buttonText={t("language")}
          >
            <span className="center">
              <Image
                src="/img/language_img.svg"
                className="heading_img"
                alt="Language"
                width={48}
                height={48}
              />
              <h1>{t("language")}</h1>
            </span>
            <Link
              className="nolink"
              href="/more"
              locale="en"
              onClick={() => handleLanguageChange("en")}
            >
              <div
                className={router.locale === "en" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "en"}
                />
                <span className="price">{t("english")}</span>
              </div>
            </Link>
            <Link
              className="nolink"
              href="/more"
              locale="de"
              onClick={() => handleLanguageChange("de")}
            >
              <div
                className={router.locale === "de" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "de"}
                />
                <span className="price">{t("german")}</span>
              </div>
            </Link>
            <Link
              className="nolink"
              href="/more"
              locale="es"
              onClick={() => handleLanguageChange("es")}
            >
              <div
                className={router.locale === "es" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "es"}
                />
                <span className="price">{t("spanish")}</span>
              </div>
            </Link>
            <Link
              className="nolink"
              href="/more"
              locale="fr"
              onClick={() => handleLanguageChange("fr")}
            >
              <div
                className={router.locale === "fr" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "fr"}
                />
                <span className="price">{t("french")}</span>
              </div>
            </Link>
            <Link
              className="nolink"
              href="/more"
              locale="pl"
              onClick={() => handleLanguageChange("pl")}
            >
              <div
                className={router.locale === "pl" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "pl"}
                />
                <span className="price">{t("polish")}</span>
              </div>
            </Link>
            <Link
              className="nolink"
              href="/more"
              locale="cz"
              onClick={() => handleLanguageChange("cz")}
            >
              <div
                className={router.locale === "cz" ? "option active" : "option"}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  checked={router.locale === "cz"}
                />
                <span className="price">{t("czech")}</span>
              </div>
            </Link>
            <span className="info" id="cookieinfo">
              {t("thissetsacookie")}
            </span>
          </ModalWrapper>
          <div className="Grid-cell icons">
            <span
              className="unknown icon-right-open"
              data-target="donationmodal"
              data-toggle="modal"
            ></span>
          </div>
        </div>
        <OLEDMode />
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
