import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SUPPORT_OPTIONS = {
  GITHUB: {
    icon: "icon-github-circled",
    link: "https://github.com/sponsors/philipbrembeck",
    price: "1-100$",
    text: "Sponsor on GitHub",
    translationKey: "monthlyviagithub",
    vendor: "GitHub",
  },
  KOFI: {
    icon: "icon-kofi",
    link: "https://ko-fi.com/veganify",
    price: "1-50€",
    text: "Sponsor on Ko-Fi",
    translationKey: "onceviakofi",
    vendor: "Ko-Fi.com",
  },
  PAYPAL: {
    icon: "icon-paypal",
    link: "https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536",
    price: "1-15€",
    text: "Donate with PayPal",
    translationKey: "onceviapaypal",
    vendor: "PayPal",
  },
};

const SupportOption = () => {
  const t = useTranslations("More");
  const [selectedOption, setSelectedOption] = useState(SUPPORT_OPTIONS.PAYPAL);

  const handleOptionClick = (
    option: (typeof SUPPORT_OPTIONS)[keyof typeof SUPPORT_OPTIONS]
  ) => {
    setSelectedOption(option);
  };

  return (
    <>
      <span className="center">
        <Image
          alt="Donate"
          className="heading_img"
          height={48}
          src="/img/donate_img.svg"
          width={48}
        />
        <h1>{t("buyusacoffee")}</h1>
      </span>
      {Object.entries(SUPPORT_OPTIONS).map(([key, option]) => {
        const handleOptionSelect = () => handleOptionClick(option);

        return (
          <div
            className={`option ${selectedOption === option ? "active" : ""}`}
            id={`option_${key.toLowerCase()}`}
            key={key}
            onClick={handleOptionSelect}
          >
            <input
              checked={selectedOption === option}
              className="form-check-input"
              id={key.toLowerCase()}
              name="flexRadioDefault"
              type="radio"
            />
            <span className="muted">{t(option.translationKey)}</span>
            <span className="price">{option.price}</span>
          </div>
        );
      })}
      <div className="center donate">
        <a className="button" href={selectedOption.link} id="supportbtn">
          <span className={selectedOption.icon} /> {selectedOption.text}
        </a>
        <span className="info">
          {t("redirect")} <span id="vendor">{selectedOption.vendor}</span>.
        </span>
      </div>
    </>
  );
};

export default SupportOption;
