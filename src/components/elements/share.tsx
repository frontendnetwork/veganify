import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import ModalWrapper from "@/components/elements/modalwrapper";

interface ShareButtonProps {
  barcode: string;
  productName?: string;
}

const ShareButton = ({
  productName = "Product",
  barcode,
}: ShareButtonProps) => {
  const t = useTranslations("Check");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkShareAvailability = () => {
      if (typeof navigator.share === "function") {
        setShowButton(true);
      }
    };
    checkShareAvailability();
  }, []);

  const text = `${productName} - Checked using Veganify`;
  const url = `https://veganify.app/?ean=${barcode}`;

  const handleShareClick = (shareUrl: string) => {
    window.location.href = shareUrl;
    document.querySelector<HTMLElement>(".btn-dark")?.click();
  };

  interface ShareOption {
    handler?: () => Promise<void>;
    icon: string;
    id: string;
    text: string;
    url: string;
  }

  const shareOptions = useMemo<ShareOption[]>(
    () => [
      {
        handler: async () => {
          await navigator.clipboard.writeText(`${text}: ${url}`);
        },
        icon: "icon-docs",
        id: "copy",
        text: t("copy"),
        url: `${text}: ${url}`,
      },
      {
        icon: "icon-mastodon",
        id: "mastodon",
        text: `${t("share")} ${t("on")} Mastodon`,
        url: `https://s2f.kytta.dev/?text=${encodeURI(text)} https%3A%2F%2Fveganify.app%2F%3Fean%3D${barcode}`,
      },
      {
        icon: "icon-twitter",
        id: "twitter",
        text: `${t("share")} ${t("on")} Twitter`,
        url: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(text)}`,
      },
      {
        icon: "icon-whatsapp",
        id: "whatsapp",
        text: `${t("share")} ${t("on")} WhatsApp`,
        url: `whatsapp://send?text=${encodeURI(text)} ${url}`,
      },
      {
        icon: "icon-telegram",
        id: "telegram",
        text: `${t("share")} ${t("on")} Telegram`,
        url: `https://telegram.me/share/url?url=${url}&text=${encodeURI(text)}`,
      },
      {
        icon: "icon-facebook",
        id: "facebook",
        text: `${t("share")} ${t("on")} Facebook`,
        url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      },
      {
        icon: "icon-chat",
        id: "message",
        text: `${t("share")} via message`,
        url: `sms:&body=${url} ${text}`,
      },
      {
        icon: "icon-mail",
        id: "email",
        text: `${t("share")} via e-mail`,
        url: `mailto:?body="${url}"&subject=${text}`,
      },
    ],
    [t, text, url, barcode]
  );

  const handleNativeShare = useCallback(() => {
    navigator.share({ text, url }).catch(console.error);
  }, [text, url]);

  return showButton ? (
    <span className="button" id="share" onClick={handleNativeShare}>
      {t("share")}
    </span>
  ) : (
    <ModalWrapper
      buttonClass="button"
      buttonText={t("share")}
      buttonType="span"
      id="share"
    >
      <span className="center">
        <Image
          alt="Share"
          className="heading_img"
          height={48}
          src="../img/pwainstall_img.svg"
          width={48}
        />
        <h1>{t("share")}</h1>
      </span>
      {shareOptions.map((option) => {
        const { id, icon, text: optionText, url: optionUrl, handler } = option;
        const handleOptionClick = () => {
          if (!handler) {
            handleShareClick(optionUrl);
            return;
          }
          handler()
            .then(() => handleShareClick(optionUrl))
            .catch(console.error);
        };

        return (
          <div
            className="share-btn"
            id={id}
            key={id}
            onClick={handleOptionClick}
          >
            <span className="share-text">{optionText}</span>
            <span className={`share-icon ${icon}`} />
          </div>
        );
      })}
    </ModalWrapper>
  );
};

export default ShareButton;
