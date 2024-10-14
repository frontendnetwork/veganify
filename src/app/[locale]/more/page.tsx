"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "nookies";

import Container from "@/components/elements/container";
import SupportOption from "@/components/elements/contents/donate";
import OLEDMode from "@/components/elements/contents/oledmode";
import ModalWrapper from "@/components/elements/modalwrapper";
import Nav from "@/components/nav";
import { Link } from "@/i18n/routing";

export default function More() {
  const t = useTranslations("More");
  const currentLocale = useLocale();

  function handleLanguageChange(locale: string) {
    setCookie(null, "NEXT_LOCALE", locale, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
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
            <a href="https://instagram.com/veganify.app" className="menu">
              <span className="label">Instagram</span>
              <div className="social-icon">
                <span className="icon-instagram"></span>
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
        <a href="https://frontendnet.work/veganify-api" className="Grid links">
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
            {[
              { code: "en", name: "english" },
              { code: "de", name: "german" },
              { code: "es", name: "spanish" },
              { code: "fr", name: "french" },
              { code: "pl", name: "polish" },
              { code: "cz", name: "czech" },
            ].map(({ code, name }) => (
              <Link
                key={code}
                className="nolink"
                href={`/more`}
                locale={
                  code as "en" | "de" | "es" | "fr" | "pl" | "cz" | undefined
                }
                onClick={() => handleLanguageChange(code)}
              >
                <div
                  className={
                    currentLocale === code ? "option active" : "option"
                  }
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    checked={currentLocale === code}
                    readOnly
                  />
                  <span className="price">{t(name)}</span>
                </div>
              </Link>
            ))}
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
