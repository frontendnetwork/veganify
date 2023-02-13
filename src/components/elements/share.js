import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

const ShareButton = () => {
  const t = useTranslations('Check');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setShowButton(true);
    }
  }, []);

  return showButton ? (
    <span
    className="button"
    id="share"
      onClick={() => {
        navigator.share({
          title: document.title,
          text: document.querySelector("#name_sh").innerHTML + " - Checked using VeganCheck",
          url: "https://vegancheck.me/"
        }).catch(err => {});
      }}
    >
      {t('share')}
    </span>
  ) : null;
};

export default ShareButton;