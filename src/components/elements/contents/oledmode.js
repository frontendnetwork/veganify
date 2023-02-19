import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const OLEDMode = () => {
  const t = useTranslations('More');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const localStorageValue = localStorage.getItem("oled");
    if (localStorageValue === "true" && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute("data-theme", "oled");
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#000");
      setIsChecked(true);
    }
  }, []);

  const handleClick = () => {
    if (!isChecked && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setError(true);
      return;
    }
    if (!isChecked) {
      document.documentElement.setAttribute("data-theme", "oled");
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#000");
      localStorage.setItem('oled', 'true');
    } else {
      localStorage.clear();
      document.documentElement.removeAttribute("data-theme");
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#141414");
    }
    setIsChecked(!isChecked);
    setError(false);
  };

  return (
    <span className="Grid switcher">
      <div className="Grid-cell description">
        OLED-Mode
        <span className="info" id="cookieinfo">{t('thissetsacookie')}</span>
        <span className={`info ${error ? "animated fadeIn" : ""}`} id="oledinfo" style={{display: error ? "block" : "none"}}>{t('activatedarkmode')}</span>
      </div>
      <div className="Grid-cell icons">
        <input
          className={`switch ${error ? "animated shake" : ""}`}
          id="oled-switch"
          type="checkbox"
          checked={isChecked}
          onClick={handleClick}
          onChange={handleClick}
        />
      </div>
    </span>
  );
};

export default OLEDMode;
