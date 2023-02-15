import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Nav from "@/components/nav";
import Container from "@/components/elements/container";
import ModalWrapper from "@/components/elements/modalwrapper";
import SupportOption from "@/components/elements/contents/donate";
import OLEDMode from "@/components/elements/contents/oledmode";

export default function more() {
  const router = useRouter();
  const t = useTranslations("More");
  return (
    <>
      <div id="modal-root"></div>
      <Nav />
      <Container logo="false" backbutton="false">
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
              <img
                src="/img/follow_img.svg"
                className="heading_img"
                alt="Follow us"
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
