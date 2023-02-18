import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ModalWrapper from "@/components/elements/modalwrapper";

const ShareButton = ({ productName, barcode }) => {
  const t = useTranslations("Check");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setShowButton(true);
    }
  }, []);

  let text = productName + " - Checked using VeganCheck";
  let url = `https://vegancheck.me/?ean=${barcode}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${text}: ${url}`);
    document.querySelector(".btn-dark").click();
  };

  const handleMastodonClick = () => {
    const mastodonurl = `https://s2f.kytta.dev/?text=${encodeURI(text)} https%3A%2F%2Fvegancheck.me%2F%3Fean%3D${barcode}`;
    window.location = mastodonurl;
    document.querySelector(".btn-dark").click();
  };

  const handleTweetClick = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(
      text
    )}`;
    window.location = tweetUrl;
    document.querySelector(".btn-dark").click();
  };

  const handleWhatsAppClick = () => {
    const whatsappurl = `whatsapp://send?text=${encodeURI(text)} ${url}`;
    window.location = whatsappurl;
    document.querySelector(".btn-dark").click();
  };

  const handleTelegramClick = () => {
    const telegramurl = `https://telegram.me/share/url?url=${url}&text=${encodeURI(
      text
    )}`;
    window.location = telegramurl;
    document.querySelector(".btn-dark").click();
  };

  const handleFacebookClick = () => {
    const facebookurl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.location = facebookurl;
    document.querySelector(".btn-dark").click();
  };

  const handleMessageClick = () => {
    const messageurl = `sms:&body=${url} ${text}`;
    window.location = messageurl;
    document.querySelector(".btn-dark").click();
  };

  const handleEmailClick = () => {
    const emailurl = `mailto:?body="${url}"&subject=${text}`;
    window.location = emailurl;
    document.querySelector(".btn-dark").click();
  };

  return showButton ? (
    <span
      className="button"
      id="share"
      onClick={() => {
        navigator
          .share({
            text: text,
            url: url,
          })
          .catch((err) => {});
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
        <span class="center">
          <img src="../img/pwainstall_img.svg" class="heading_img" />
          <h1>{t("share")}</h1>
        </span>
        <div class="share-btn" id="copy" onClick={handleCopyClick}>
          <span class="share-text">{t("copy")}</span>
          <span class="share-icon icon-docs"></span>
        </div>
        <div class="share-btn" id="mastodon" onClick={handleMastodonClick}>
          <span class="share-text">{t("share")} {t("on")} Mastodon</span>
          <span class="share-icon icon-mastodon"></span>
        </div>
        <div class="share-btn" id="twitter" onClick={handleTweetClick}>
          <span class="share-text">{t("share")} {t("on")} Twitter</span>
          <span class="share-icon icon-twitter"></span>
        </div>
        <div class="share-btn" id="whatsapp" onClick={handleWhatsAppClick}>
          <span class="share-text">{t("share")} {t("on")} WhatsApp</span>
          <span class="share-icon icon-whatsapp"></span>
        </div>
        <div class="share-btn" id="telegram" onClick={handleTelegramClick}>
          <span class="share-text">{t("share")} {t("on")} Telegram</span>
          <span class="share-icon icon-telegram"></span>
        </div>
        <div class="share-btn" id="facebook" onClick={handleFacebookClick}>
          <span class="share-text">{t("share")} {t("on")} Facebook</span>
          <span class="share-icon icon-facebook"></span>
        </div>
        <div class="share-btn" id="message" onClick={handleMessageClick}>
          <span class="share-text">{t("share")} via message</span>
          <span class="share-icon icon-chat"></span>
        </div>
        <div class="share-btn" id="email" onClick={handleEmailClick}>
          <span class="share-text">{t("share")} via e-mail</span>
          <span class="share-icon icon-mail"></span>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ShareButton;
