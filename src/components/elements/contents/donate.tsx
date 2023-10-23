import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SupportOption = () => {
  const t = useTranslations("More");
  const [icon, setIcon] = useState<string>("icon-paypal");
  const [vendor, setVendor] = useState<string>("PayPal");
  const [supportBtnText, setSupportBtnText] = useState<string>("Donate with PayPal");
  const [supportBtnLink, setSupportBtnLink] = useState<string>(
    "https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536"
  );
  const [onceChecked, setOnceChecked] = useState<boolean>(true);
  const [ghChecked, setGhChecked] = useState<boolean>(false);
  const [KofiChecked, setKofiChecked] = useState<boolean>(false);

  const handleOptionOnceClick = () => {
    setIcon("icon-paypal");
    setVendor("PayPal");
    setSupportBtnText("Donate with PayPal");
    setSupportBtnLink(
      "https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536"
    );
    setOnceChecked(true);
    setGhChecked(false);
    setKofiChecked(false);
  };

  const handleOptionKofiClick = () => {
    setIcon("icon-kofi");
    setVendor("Ko-Fi.com");
    setSupportBtnText("Sponsor on Ko-Fi");
    setSupportBtnLink("https://ko-fi.com/vegancheck");
    setKofiChecked(true);
    setOnceChecked(false);
    setGhChecked(false);
  };

  const handleOptionGhClick = () => {
    setIcon("icon-github-circled");
    setVendor("GitHub");
    setSupportBtnText("Sponsor on GitHub");
    setSupportBtnLink("https://github.com/sponsors/philipbrembeck");
    setGhChecked(true);
    setOnceChecked(false);
    setKofiChecked(false);
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
      <div
        className={`option ${onceChecked ? "active" : ""}`}
        id="option_once"
        onClick={handleOptionOnceClick}
      >
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="once"
          checked={onceChecked}
        />
        <span className="muted">{t("onceviapaypal")}</span>
        <span className="price">1-15€</span>
      </div>
      <div
        className={`option ${KofiChecked ? "active" : ""}`}
        id="option_kofi"
        onClick={handleOptionKofiClick}
      >
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="kofi"
          checked={KofiChecked}
        />
        <span className="muted">{t("onceviakofi")}</span>
        <span className="price">1-50€</span>
      </div>
      <div
        className={`option ${ghChecked ? "active" : ""}`}
        id="option_gh"
        onClick={handleOptionGhClick}
      >
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="gh"
          checked={ghChecked}
        />
        <span className="muted">{t("monthlyviagithub")}</span>
        <span className="price">1-100$/{t("month")}</span>
      </div>
      <div className="center donate">
        <a href={supportBtnLink} id="supportbtn" className="button">
          <span className={icon}></span> {supportBtnText}
        </a>
        <span className="info">
          {t("redirect")} <span id="vendor">{vendor}</span>.
        </span>
      </div>
    </>
  );
};

export default SupportOption;
