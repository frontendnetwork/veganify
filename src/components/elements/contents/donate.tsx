import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SUPPORT_OPTIONS = {
  PAYPAL: {
    icon: "icon-paypal",
    vendor: "PayPal",
    text: "Donate with PayPal",
    link: "https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536",
    price: "1-15€",
    translationKey: "onceviapaypal",
  },
  KOFI: {
    icon: "icon-kofi",
    vendor: "Ko-Fi.com",
    text: "Sponsor on Ko-Fi",
    link: "https://ko-fi.com/veganify",
    price: "1-50€",
    translationKey: "onceviakofi",
  },
  GITHUB: {
    icon: "icon-github-circled",
    vendor: "GitHub",
    text: "Sponsor on GitHub",
    link: "https://github.com/sponsors/philipbrembeck",
    price: "1-100$",
    translationKey: "monthlyviagithub",
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
          src="/img/donate_img.svg"
          className="heading_img"
          alt="Donate"
          width={48}
          height={48}
        />
        <h1>{t("buyusacoffee")}</h1>
      </span>
      {Object.entries(SUPPORT_OPTIONS).map(([key, option]) => (
        <div
          key={key}
          className={`option ${selectedOption === option ? "active" : ""}`}
          id={`option_${key.toLowerCase()}`}
          onClick={() => handleOptionClick(option)}
        >
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id={key.toLowerCase()}
            checked={selectedOption === option}
          />
          <span className="muted">{t(option.translationKey)}</span>
          <span className="price">{option.price}</span>
        </div>
      ))}
      <div className="center donate">
        <a href={selectedOption.link} id="supportbtn" className="button">
          <span className={selectedOption.icon}></span> {selectedOption.text}
        </a>
        <span className="info">
          {t("redirect")} <span id="vendor">{selectedOption.vendor}</span>.
        </span>
      </div>
    </>
  );
};

export default SupportOption;
