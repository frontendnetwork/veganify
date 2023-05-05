import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ExtendedWindow extends Window {
  MSStream?: any;
}

const Shortcut: FC = () => {
  const t = useTranslations("ShortcutPrompt");
  const [showShortcut, setShowShortcut] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithMSStream = window as ExtendedWindow;

      const isIOS: boolean =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !windowWithMSStream.MSStream;

      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        isIOS &&
        window.location.href.indexOf("shortcut") === -1
      ) {
        if (typeof window !== "undefined") {
          document.getElementById("mainpage")?.classList.remove("top");
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
};

export default Shortcut;
