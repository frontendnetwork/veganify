"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

interface ExtendedWindow extends Window {
  MSStream?: unknown;
}

const DISMISS_STORAGE_KEY = "shortcut-dismissed";

const isIOSDevice = (window: ExtendedWindow): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const shouldShowShortcut = (window: ExtendedWindow): boolean =>
  !window.matchMedia("(display-mode: standalone)").matches &&
  isIOSDevice(window) &&
  !window.location.href.includes("shortcut") &&
  localStorage.getItem(DISMISS_STORAGE_KEY) !== "true";

const Shortcut = () => {
  const t = useTranslations("ShortcutPrompt");
  const tDialog = useTranslations("Dialog");
  const [showShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithMSStream = window as ExtendedWindow;

      if (shouldShowShortcut(windowWithMSStream)) {
        setShowShortcut(true);
      }
    }
  }, []);

  const dismissShortcut = useCallback(() => {
    setShowShortcut(false);
    localStorage.setItem(DISMISS_STORAGE_KEY, "true");
  }, []);

  if (!showShortcut) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-20 flex justify-center px-4 md:bottom-6">
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-elev-3">
        <Image
          alt=""
          className="size-8"
          height={32}
          src="/img/shortcuts.png"
          width={32}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink text-sm">{t("Shortcuts")}</p>
          <p className="truncate text-muted text-xs">{t("openinapp")}</p>
        </div>
        <a
          className="fluid-hover inline-flex h-9 shrink-0 items-center rounded-md bg-accent px-3.5 font-medium text-accent-foreground text-sm hover:bg-accent-hover"
          href="https://shareshortcuts.com/download/2224-vegancheck.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("open")}
        </a>
        <button
          aria-label={tDialog("close")}
          className="fluid-hover -m-1 flex size-9 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
          onClick={dismissShortcut}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Shortcut;
