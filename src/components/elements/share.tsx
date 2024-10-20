import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

import ModalWrapper from "@/components/elements/modalwrapper";

interface ShareButtonProps {
  productName?: string;
  barcode: string;
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

  const shareOptions = [
    {
      id: "copy",
      text: t("copy"),
      icon: "icon-docs",
      url: `${text}: ${url}`,
      handler: () => navigator.clipboard.writeText(`${text}: ${url}`),
    },
    {
      id: "mastodon",
      text: `${t("share")} ${t("on")} Mastodon`,
      icon: "icon-mastodon",
      url: `https://s2f.kytta.dev/?text=${encodeURI(text)} https%3A%2F%2Fveganify.app%2F%3Fean%3D${barcode}`,
    },
    {
      id: "twitter",
      text: `${t("share")} ${t("on")} Twitter`,
      icon: "icon-twitter",
      url: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(text)}`,
    },
    {
      id: "whatsapp",
      text: `${t("share")} ${t("on")} WhatsApp`,
      icon: "icon-whatsapp",
      url: `whatsapp://send?text=${encodeURI(text)} ${url}`,
    },
    {
      id: "telegram",
      text: `${t("share")} ${t("on")} Telegram`,
      icon: "icon-telegram",
      url: `https://telegram.me/share/url?url=${url}&text=${encodeURI(text)}`,
    },
    {
      id: "facebook",
      text: `${t("share")} ${t("on")} Facebook`,
      icon: "icon-facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      id: "message",
      text: `${t("share")} via message`,
      icon: "icon-chat",
      url: `sms:&body=${url} ${text}`,
    },
    {
      id: "email",
      text: `${t("share")} via e-mail`,
      icon: "icon-mail",
      url: `mailto:?body="${url}"&subject=${text}`,
    },
  ];

  return showButton ? (
    <span
      className="button"
      id="share"
      onClick={() => {
        navigator.share({ text, url }).catch(console.error);
      }}
    >
      {t("share")}
    </span>
  ) : (
    <ModalWrapper
      id="share"
      buttonType="span"
      buttonClass="button"
      buttonText={t("share")}
    >
      <span className="center">
        <Image
          src="../img/pwainstall_img.svg"
          className="heading_img"
          width={48}
          height={48}
          alt="Share"
        />
        <h1>{t("share")}</h1>
      </span>
      {shareOptions.map(({ id, text, icon, url, handler }) => (
        <div
          key={id}
          className="share-btn"
          id={id}
          onClick={() =>
            handler
              ? handler()
                  .then(() => handleShareClick(url))
                  .catch(console.error)
              : handleShareClick(url)
          }
        >
          <span className="share-text">{text}</span>
          <span className={`share-icon ${icon}`}></span>
        </div>
      ))}
    </ModalWrapper>
  );
};

export default ShareButton;
