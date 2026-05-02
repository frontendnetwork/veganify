"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import Container from "@/components/elements/container";
import SupportOption from "@/components/elements/contents/donate";
import ModalWrapper from "@/components/elements/modalwrapper";
import { Link } from "@/i18n/navigation";
import { setLocaleCookie } from "@/lib/locale-cookie";

const languages = [
  { code: "en", name: "english" },
  { code: "de", name: "german" },
  { code: "es", name: "spanish" },
  { code: "fr", name: "french" },
  { code: "pl", name: "polish" },
  { code: "cz", name: "czech" },
  { code: "pt-br", name: "portuguese-br" },
] as const;

export default function More() {
  const t = useTranslations("More");
  const currentLocale = useLocale();

  function handleLanguageChange(locale: string) {
    setLocaleCookie(locale);
  }

  return (
    <Container backButton={false} logo={false}>
      <div className="Grid links">
        <ModalWrapper
          buttonClass="Grid-cell description"
          buttonText={t("buyusacoffee")}
          buttonType="div"
          id="donate"
        >
          <SupportOption />
        </ModalWrapper>
        <div className="Grid-cell icons">
          <span
            className="unknown icon-right-open"
            data-target="donationmodal"
            data-toggle="modal"
          />
        </div>
      </div>

      <div className="Grid links">
        <ModalWrapper
          buttonClass="Grid-cell description"
          buttonText={t("followus")}
          buttonType="div"
          id="follow"
        >
          <span className="center">
            <Image
              alt="Follow us"
              className="heading_img"
              height={48}
              src="/img/follow_img.svg"
              width={48}
            />
            <h1>{t("followus")}</h1>
          </span>
          <a
            className="menu twitter"
            href="https://veganism.social/@vegancheck"
            rel="me"
          >
            <span className="label">Mastodon</span>
            <div className="social-icon">
              <span className="icon-mastodon" />
            </div>
          </a>
          <a className="menu last" href="https://instagram.com/veganify.app">
            <span className="label">Instagram</span>
            <div className="social-icon">
              <span className="icon-instagram" />
            </div>
          </a>
        </ModalWrapper>
        <div className="Grid-cell icons">
          <span
            className="unknown icon-right-open"
            data-target="donationmodal"
            data-toggle="modal"
          />
        </div>
      </div>

      <Link className="Grid links" href="/tos" prefetch={true}>
        <div className="Grid-cell description">{t("tos")}</div>
        <div className="Grid-cell icons">
          <span className="unknown icon-right-open" />
        </div>
      </Link>

      <Link className="Grid links" href="privacy-policy" prefetch={true}>
        <div className="Grid-cell description">{t("privacypolicy")}</div>
        <div className="Grid-cell icons">
          <span className="unknown icon-right-open" />
        </div>
      </Link>

      <a className="Grid links" href="https://frontendnet.work/veganify-api">
        <div className="Grid-cell description">{t("apidocumentation")}</div>
        <div className="Grid-cell icons">
          <span className="unknown icon-right-open" />
        </div>
      </a>

      <Link className="Grid links" href="impressum" prefetch={true}>
        <div className="Grid-cell description">{t("imprint")}</div>
        <div className="Grid-cell icons">
          <span className="unknown icon-right-open" />
        </div>
      </Link>

      <div className="Grid links">
        <ModalWrapper
          buttonClass="Grid-cell description"
          buttonText={t("language")}
          buttonType="div"
          id="language"
        >
          <span className="center">
            <Image
              alt="Language"
              className="heading_img"
              height={48}
              src="/img/language_img.svg"
              width={48}
            />
            <h1>{t("language")}</h1>
          </span>
          {languages.map(({ code, name }) => (
            <Link
              className="nolink"
              href={"/more"}
              key={code}
              locale={
                code as "en" | "de" | "es" | "fr" | "pl" | "cz" | undefined
              }
              onClick={() => handleLanguageChange(code)}
            >
              <div
                className={currentLocale === code ? "option active" : "option"}
              >
                <input
                  checked={currentLocale === code}
                  className="form-check-input"
                  name="flexRadioDefault"
                  readOnly
                  type="radio"
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
          />
        </div>
      </div>
    </Container>
  );
}
