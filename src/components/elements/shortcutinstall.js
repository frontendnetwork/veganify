import { useState, useEffect } from "react";
import ModalWrapper from "@/components/elements/modalwrapper";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Shortcut() {
  const t = useTranslations("ShortcutPrompt");
  const [showShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        isIOS &&
        window.location.href.indexOf("shortcut") === -1
      ) {
        if (typeof window !== "undefined") {
          document.getElementById("mainpage").classList.remove("top");
        }
        setShowShortcut(true);
      }
    }
  }, []);

  if (!showShortcut) {
    return null;
  }

  return (
    <div id="shortcut">
      <div className="flex-container">
        <div className="flex-item">
          <Image
            src="/img/shortcuts.png"
            alt="Shortcuts"
            width={32}
            height={32}
          />
        </div>
        <div className="flex-item">
          <span className="heading">{t("Shortcuts")}</span>
          <span className="subheading">{t("openinapp")}</span>
        </div>
        <div className="flex-item">
          <a href="https://shareshortcuts.com/download/2224-vegancheck.html">
            <span className="button">{t("open")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
