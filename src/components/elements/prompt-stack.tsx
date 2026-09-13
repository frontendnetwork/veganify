"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppDialog as Dialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";

/**
 * The install and Shortcuts prompts as one stacked deck: the front card is
 * fully visible and interactive, the back card sits behind it, slightly
 * smaller, peeking out at the bottom. Dismissing the front card promotes
 * the back one; tapping the peek swaps the two.
 */

type CardKey = "install" | "shortcut";

const INSTALL_COOKIE = "pwainstall";
const SHORTCUT_STORAGE_KEY = "shortcut-dismissed";

interface ExtendedWindow extends Window {
  MSStream?: unknown;
}

const getCookie = (name: string): string | undefined => {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return cookie?.split("=")[1];
};

const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const otherCard = (key: CardKey): CardKey =>
  key === "install" ? "shortcut" : "install";

const resolveFrontKey = ({
  both,
  front,
  installVisible,
  shortcutVisible,
}: {
  both: boolean;
  front: CardKey;
  installVisible: boolean;
  shortcutVisible: boolean;
}): CardKey | null => {
  if (both) {
    return front;
  }
  if (installVisible) {
    return "install";
  }
  if (shortcutVisible) {
    return "shortcut";
  }
  return null;
};

function CardBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-elev-3">
      {children}
    </div>
  );
}

const DismissButton = ({
  label,
  onDismiss,
}: {
  label: string;
  onDismiss: () => void;
}) => (
  <button
    aria-label={label}
    className="fluid-hover -m-1 flex size-9 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
    onClick={onDismiss}
    type="button"
  >
    <X aria-hidden="true" className="size-4" />
  </button>
);

export default function PromptStack() {
  const tInstall = useTranslations("InstallPrompt");
  const tShortcut = useTranslations("ShortcutPrompt");
  const tStack = useTranslations("PromptStack");
  const [eligible, setEligible] = useState(false);
  const [installHidden, setInstallHidden] = useState(true);
  const [shortcutHidden, setShortcutHidden] = useState(true);
  const [front, setFront] = useState<CardKey>("install");
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const cardRefs = useRef<Partial<Record<CardKey, HTMLDivElement | null>>>({});

  useEffect(() => {
    const windowWithMSStream = window as ExtendedWindow;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !windowWithMSStream.MSStream;
    const isNotStandalone = !window.matchMedia("(display-mode: standalone)")
      .matches;
    const isNotShortcut = !window.location.href.includes("shortcut");
    if (!(isIOS && isNotStandalone && isNotShortcut)) {
      return;
    }
    setEligible(true);
    setInstallHidden(getCookie(INSTALL_COOKIE) === "hidden");
    setShortcutHidden(localStorage.getItem(SHORTCUT_STORAGE_KEY) === "true");
  }, []);

  const dismissInstall = useCallback(() => {
    setInstallHidden(true);
    setCookie(INSTALL_COOKIE, "hidden", 7);
  }, []);

  const dismissShortcut = useCallback(() => {
    setShortcutHidden(true);
    localStorage.setItem(SHORTCUT_STORAGE_KEY, "true");
  }, []);

  const openInstructions = useCallback(() => setInstructionsOpen(true), []);

  const swapToFront = useCallback((key: CardKey) => {
    setFront(key);
    // The swap button lived on the card that just moved to the back and is
    // now inert; move focus to the newly promoted card.
    requestAnimationFrame(() => cardRefs.current[key]?.focus());
  }, []);

  const installVisible = eligible && !installHidden;
  const shortcutVisible = eligible && !shortcutHidden;
  const bothVisible = installVisible && shortcutVisible;
  const frontKey = resolveFrontKey({
    both: bothVisible,
    front,
    installVisible,
    shortcutVisible,
  });
  const backKey: CardKey | null =
    bothVisible && frontKey ? otherCard(frontKey) : null;

  const setFrontCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (frontKey) {
        cardRefs.current[frontKey] = node;
      }
    },
    [frontKey]
  );
  const promoteBack = useCallback(() => {
    if (backKey) {
      swapToFront(backKey);
    }
  }, [backKey, swapToFront]);

  if (!frontKey) {
    return null;
  }

  const cards: Record<CardKey, { ariaLabel: string; body: ReactNode }> = {
    install: {
      ariaLabel: tInstall("install"),
      body: (
        <>
          <Image
            alt=""
            className="size-10 rounded-lg"
            height={40}
            src="/img/maskable_icon.png"
            width={40}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink text-sm">Veganify</p>
            <p className="text-muted text-xs">{tInstall("subheading")}</p>
          </div>
          <Button onClick={openInstructions} size="sm">
            {tInstall("get")}
          </Button>
          <DismissButton
            label={tInstall("dismiss")}
            onDismiss={dismissInstall}
          />
        </>
      ),
    },
    shortcut: {
      ariaLabel: tShortcut("Shortcuts"),
      body: (
        <>
          <Image
            alt=""
            className="size-10 rounded-lg"
            height={40}
            src="/img/shortcuts.png"
            width={40}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink text-sm">
              {tShortcut("Shortcuts")}
            </p>
            <p className="text-muted text-xs">{tShortcut("openinapp")}</p>
          </div>
          <Button asChild={true} size="sm">
            <a
              href="https://shareshortcuts.com/download/2224-vegancheck.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              {tShortcut("open")}
            </a>
          </Button>
          <DismissButton
            label={tInstall("dismiss")}
            onDismiss={dismissShortcut}
          />
        </>
      ),
    },
  };

  const frontCard = cards[frontKey];
  const backCard = backKey ? cards[backKey] : null;

  return (
    <div
      className={`mb-4 grid [grid-template-areas:'stack'] ${backCard ? "pb-3.5" : ""}`}
    >
      <div
        aria-label={frontCard.ariaLabel}
        className="relative z-10 mx-auto w-full max-w-md rounded-xl [grid-area:stack] focus:outline-none"
        key={frontKey}
        ref={setFrontCardRef}
        role="group"
        tabIndex={-1}
      >
        <CardBody>{frontCard.body}</CardBody>
      </div>
      {backCard && backKey ? (
        <div className="relative mx-auto w-full max-w-md [grid-area:stack]">
          {/* Slightly smaller and pushed down, so only the bottom sliver
              peeks out below the front card. Inert while covered: its
              controls are unreachable behind the front card. */}
          <div className="origin-top translate-y-3.5 scale-[0.96]" inert={true}>
            <CardBody>{backCard.body}</CardBody>
          </div>
          {/* The peek sliver is the tap target that promotes this card.
              It starts below the front card and reaches into the gap
              under the deck, so the hit area is comfortably tall. */}
          <button
            aria-label={`${tStack("show")}: ${backCard.ariaLabel}`}
            className="absolute inset-x-0 bottom-[-26px] z-20 h-7 cursor-pointer"
            onClick={promoteBack}
            type="button"
          />
        </div>
      ) : null}
      <Dialog
        onOpenChange={setInstructionsOpen}
        open={instructionsOpen}
        title={tInstall("install")}
      >
        <p>
          {tInstall.rich("howtoinstall", {
            share: () => (
              <strong className="font-semibold text-ink">Share</strong>
            ),
          })}
        </p>
      </Dialog>
    </div>
  );
}
