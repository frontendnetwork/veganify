"use client";

import { Check, Copy, Mail, MessageSquare, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type ComponentType,
  type SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppDialog as Dialog } from "@/components/ui/app-dialog";
import {
  FacebookIcon,
  MastodonIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  barcode: string;
  productName?: string;
}

interface ShareOption {
  copy?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: string;
  label: string;
  /** Web intents open a new tab; scheme URLs (sms/mailto) navigate. */
  navigate?: boolean;
  url?: string;
}

const ShareButton = ({
  productName = "Product",
  barcode,
}: ShareButtonProps) => {
  const t = useTranslations("Check");
  const [showNativeShare, setShowNativeShare] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator.share === "function") {
      setShowNativeShare(true);
    }
  }, []);

  const text = `${productName} - Checked using Veganify`;
  const url = `https://veganify.app/?ean=${barcode}`;

  const shareOptions = useMemo<ShareOption[]>(
    () => [
      { copy: true, icon: Copy, id: "copy", label: t("copy") },
      {
        icon: MastodonIcon,
        id: "mastodon",
        label: `${t("share")} ${t("on")} Mastodon`,
        url: `https://s2f.kytta.dev/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`,
      },
      {
        icon: XIcon,
        id: "x",
        label: `${t("share")} ${t("on")} X`,
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      },
      {
        icon: WhatsAppIcon,
        id: "whatsapp",
        label: `${t("share")} ${t("on")} WhatsApp`,
        url: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      },
      {
        icon: TelegramIcon,
        id: "telegram",
        label: `${t("share")} ${t("on")} Telegram`,
        url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      },
      {
        icon: FacebookIcon,
        id: "facebook",
        label: `${t("share")} ${t("on")} Facebook`,
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      },
      {
        icon: MessageSquare,
        id: "message",
        label: `${t("share")} ${t("viamessage")}`,
        navigate: true,
        url: `sms:?&body=${encodeURIComponent(`${url} ${text}`)}`,
      },
      {
        icon: Mail,
        id: "email",
        label: `${t("share")} ${t("viaemail")}`,
        navigate: true,
        url: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
      },
    ],
    [t, text, url]
  );

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ text, url });
    } catch (error) {
      // AbortError means the user dismissed the OS share sheet — not a failure.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Native share failed, falling back to share dialog", error);
      setDialogOpen(true);
    }
  }, [text, url]);

  const handleOptionClick = useCallback(
    async (option: ShareOption) => {
      if (option.copy) {
        try {
          await navigator.clipboard.writeText(`${text}: ${url}`);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          console.error("Copy to clipboard failed");
        }
        return;
      }
      if (option.navigate) {
        window.location.href = option.url ?? "";
        return;
      }
      window.open(option.url, "_blank", "noopener,noreferrer");
    },
    [text, url]
  );

  const trigger = (onClick: () => void) => (
    <Button className="w-full" onClick={onClick}>
      <Share2 aria-hidden="true" className="size-4" />
      {t("share")}
    </Button>
  );

  const openDialog = useCallback(() => setDialogOpen(true), []);

  return (
    <div className="mt-4">
      {trigger(showNativeShare ? handleNativeShare : openDialog)}
      <Dialog
        description={productName === "Product" ? undefined : productName}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title={t("share")}
      >
        <ul className="flex flex-col gap-1">
          {shareOptions.map((option) => (
            <ShareOptionRow
              copied={copied && option.copy === true}
              key={option.id}
              onSelect={handleOptionClick}
              option={option}
              t={t}
            />
          ))}
        </ul>
      </Dialog>
    </div>
  );
};

const ShareOptionRow = ({
  option,
  copied,
  onSelect,
  t,
}: {
  option: ShareOption;
  copied: boolean;
  onSelect: (option: ShareOption) => void;
  t: (key: string) => string;
}) => {
  const handleClick = useCallback(() => onSelect(option), [onSelect, option]);
  const Icon = copied ? Check : option.icon;

  return (
    <li>
      <button
        className="fluid-hover flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-ink text-sm hover:bg-surface-2"
        onClick={handleClick}
        type="button"
      >
        <Icon
          aria-hidden="true"
          className={copied ? "size-5 text-success" : "size-5 text-muted"}
        />
        {copied ? t("copied") : option.label}
      </button>
    </li>
  );
};

export default ShareButton;
