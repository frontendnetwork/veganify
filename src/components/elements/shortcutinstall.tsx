"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface ExtendedWindow extends Window {
  MSStream?: unknown;
}

const isIOSDevice = (window: ExtendedWindow): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const shouldShowShortcut = (window: ExtendedWindow): boolean => {
  return (
    !window.matchMedia("(display-mode: standalone)").matches &&
    isIOSDevice(window) &&
    !window.location.href.includes("shortcut")
  );
};

const Shortcut = () => {
  const t = useTranslations("ShortcutPrompt");
  const [showShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithMSStream = window as ExtendedWindow;

      if (shouldShowShortcut(windowWithMSStream)) {
        document.getElementById("mainpage")?.classList.remove("top");
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
