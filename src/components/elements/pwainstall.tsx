"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { AppDialog as Dialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";

const InstallPrompt = () => {
  const t = useTranslations("InstallPrompt");
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const openInstructions = useCallback(() => setInstructionsOpen(true), []);

  useEffect(() => {
    const pwainstall = getCookie("pwainstall");
    if (pwainstall !== "hidden" && typeof window !== "undefined") {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
      const isNotStandalone = !window.matchMedia("(display-mode: standalone)")
        .matches;
      const isNotShortcut = window.location.href.indexOf("shortcut") === -1;

      if (isIOS && isNotStandalone && isNotShortcut) {
        setShowInstallPrompt(true);
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
    <div className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-elev-3">
        <img
          alt=""
          className="size-10 rounded-lg"
          decoding="async"
          height={40}
          src="/img/maskable_icon.png"
          width={40}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink text-sm">Veganify</p>
          <p className="truncate text-muted text-xs">{t("subheading")}</p>
        </div>
        <Button onClick={openInstructions} size="sm">
          {t("get")}
        </Button>
        <button
          aria-label={t("dismiss")}
          className="fluid-hover -m-1 flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
          onClick={closeInstallPrompt}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      {renderInstructions()}
    </div>
  );

  function renderInstructions() {
    return (
      <Dialog
        onOpenChange={setInstructionsOpen}
        open={instructionsOpen}
        title={t("install")}
      >
        <p>
          {t.rich("howtoinstall", {
            share: () => (
              <strong className="font-semibold text-ink">Share</strong>
            ),
          })}
        </p>
      </Dialog>
    );
  }
};

function getCookie(name: string): string | undefined {
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : undefined;
}

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

export default InstallPrompt;
