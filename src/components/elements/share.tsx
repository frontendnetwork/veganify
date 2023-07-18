import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ModalWrapper from "@/components/elements/modalwrapper";
import Image from "next/image";

interface ShareButtonProps {
  productName: string | undefined;
  barcode: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ productName, barcode }) => {
  const t = useTranslations("Check");
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.share as (() => Promise<void>) | undefined) {
      setShowButton(true);
    }
  }, []);

  const text = productName + " - Checked using VeganCheck";
  const url = `https://vegancheck.me/?ean=${barcode}`;

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(`${text}: ${url}`)
      .then(() => {
        (document.querySelector(".btn-dark") as HTMLElement)?.click();
      })
      .catch((error) => {
        console.error("Error writing to clipboard:", error);
      });
  };

  const handleMastodonClick = () => {
    const mastodonurl = `https://s2f.kytta.dev/?text=${encodeURI(
      text
    )} https%3A%2F%2Fvegancheck.me%2F%3Fean%3D${barcode}`;
    window.location.href = mastodonurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleTweetClick = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(
      text
    )}`;
    window.location.href = tweetUrl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleWhatsAppClick = () => {
    const whatsappurl = `whatsapp://send?text=${encodeURI(text)} ${url}`;
    window.location.href = whatsappurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleTelegramClick = () => {
    const telegramurl = `https://telegram.me/share/url?url=${url}&text=${encodeURI(
      text
    )}`;
    window.location.href = telegramurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleFacebookClick = () => {
    const facebookurl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.location.href = facebookurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleMessageClick = () => {
    const messageurl = `sms:&body=${url} ${text}`;
    window.location.href = messageurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  const handleEmailClick = () => {
    const emailurl = `mailto:?body="${url}"&subject=${text}`;
    window.location.href = emailurl;
    (document.querySelector(".btn-dark") as HTMLElement)?.click();
  };

  return showButton ? (
    <span
      className="button"
      id="share"
      onClick={() => {
        navigator
          .share({
            text,
            url,
          })
          .catch((err) => {console.error(err)});
      }}
    >
      {t("share")}
    </span>
  ) : (
    <>
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
        <div className="share-btn" id="copy" onClick={handleCopyClick}>
          <span className="share-text">{t("copy")}</span>
          <span className="share-icon icon-docs"></span>
        </div>
        <div className="share-btn" id="mastodon" onClick={handleMastodonClick}>
          <span className="share-text">
            {t("share")} {t("on")} Mastodon
          </span>
          <span className="share-icon icon-mastodon"></span>
        </div>
        <div className="share-btn" id="twitter" onClick={handleTweetClick}>
          <span className="share-text">
            {t("share")} {t("on")} Twitter
          </span>
          <span className="share-icon icon-twitter"></span>
        </div>
        <div className="share-btn" id="whatsapp" onClick={handleWhatsAppClick}>
          <span className="share-text">
            {t("share")} {t("on")} WhatsApp
          </span>
          <span className="share-icon icon-whatsapp"></span>
        </div>
        <div className="share-btn" id="telegram" onClick={handleTelegramClick}>
          <span className="share-text">
            {t("share")} {t("on")} Telegram
          </span>
          <span className="share-icon icon-telegram"></span>
        </div>
        <div className="share-btn" id="facebook" onClick={handleFacebookClick}>
          <span className="share-text">
            {t("share")} {t("on")} Facebook
          </span>
          <span className="share-icon icon-facebook"></span>
        </div>
        <div className="share-btn" id="message" onClick={handleMessageClick}>
          <span className="share-text">{t("share")} via message</span>
          <span className="share-icon icon-chat"></span>
        </div>
        <div className="share-btn" id="email" onClick={handleEmailClick}>
          <span className="share-text">{t("share")} via e-mail</span>
          <span className="share-icon icon-mail"></span>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ShareButton;
