"use client";

import { useTranslations } from "next-intl";

interface StatusMessagesProps {
  showNotFound: boolean;
  showInvalid: boolean;
  showTimeout: boolean;
  showTimeoutFinal: boolean;
}

export function StatusMessages({
  showNotFound,
  showInvalid,
  showTimeout,
  showTimeoutFinal,
}: StatusMessagesProps) {
  const t = useTranslations("Check");

  if (showNotFound) {
    return (
      <div id="result">
        <div className="resultborder" id="RSNotFound">
          <span>{t("notindb")}</span>
          <p className="missing" style={{ textAlign: "center" }}>
            {t("notindb_add")}{" "}
            <a
              href="https://world.openfoodfacts.org/cgi/product.pl"
              target="_blank"
            >
              {t("add_food")}
            </a>{" "}
            {t("or")}{" "}
            <a
              href="https://world.openbeautyfacts.org/cgi/product.pl"
              target="_blank"
            >
              {t("add_cosmetic")}
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (showInvalid) {
    return (
      <div id="result">
        <div className="resultborder" id="RSInvalid">
          <span>{t("wrongbarcode")}</span>
        </div>
      </div>
    );
  }

  if (showTimeout) {
    return (
      <div className="timeout animated fadeIn">
        {t("timeout1")}
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    );
  }

  if (showTimeoutFinal) {
    return <div className="timeout-final animated fadeIn">{t("timeout2")}</div>;
  }

  return null;
}
