import { useState, useEffect } from "react";
import ModalWrapper from "@/components/elements/modalwrapper";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function InstallPrompt() {
  const t = useTranslations("InstallPrompt");
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const pwainstall = getCookie("pwainstall");
    if (pwainstall !== "hidden") {
      if (typeof window !== "undefined") {
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (
          !window.matchMedia("(display-mode: standalone)").matches &&
          isIOS &&
          window.location.href.indexOf("shortcut") === -1
        ) {
          setShowInstallPrompt(true);
        }
      }
    }
  }, []);

  const closeInstallPrompt = () => {
    setShowInstallPrompt(false);
    setCookie("pwainstall", "hidden", 7);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div
      id="pwainstall"
      style={{ display: showInstallPrompt ? "block" : "none" }}
    >
      <div className="flex-container">
        <div className="flex-item" id="pwaclose" onClick={closeInstallPrompt}>
          ×
        </div>
        <div className="flex-item">
          <img src="/img/maskable_icon.png" alt="VeganCheck Icon" />
        </div>
        <div className="flex-item">
          <span className="heading">VeganCheck.me</span>
          <span className="subheading">{t("subheading")}</span>
        </div>
        <div className="flex-item">
          <ModalWrapper
            id="modal2"
            buttonType="span"
            buttonClass="button"
            buttonText={t("get")}
          >
            <span class="center">
              <Image
                src="../img/pwainstall_img.svg"
                alt="PWAInstall"
                class="heading_img"
                width={48}
                height={48}
              />
              <h1>{t("install")}</h1>
            </span>
            <p
              dangerouslySetInnerHTML={{
                __html: t("howtoinstall", {
                  share:
                    '<img src="../img/pwa_share.svg" width="16" height="16" alt="Share" />',
                }),
              }}
            />
          </ModalWrapper>
        </div>
      </div>
    </div>
  );
}

function getCookie(name) {
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(name + "="));
  if (!cookie) return undefined;
  return cookie.split("=")[1];
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
