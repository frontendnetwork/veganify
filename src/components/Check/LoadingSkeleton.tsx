"use client";

import { useTranslations } from "next-intl";

export function LoadingSkeleton() {
  const t = useTranslations("Check");

  return (
    <div id="result" className="loading_skeleton">
      <div className="animated fadeIn resultborder" id="RSFound">
        <span className="unknown">
          <span className="name skeleton">&nbsp;</span>
        </span>
        <span id="result_sh">
          <div className="Grid">
            <div className="Grid-cell description skeleton">{t("vegan")}</div>
            <div className="Grid-cell icons skeleton">
              <span className="icon-help"></span>
            </div>
          </div>
        </span>
        <div className="Grid">
          <div className="Grid-cell description skeleton">
            {t("vegetarian")}
          </div>
          <div className="Grid-cell icons skeleton">
            <span className="icon-help"></span>
          </div>
        </div>
        <div className="Grid">
          <div className="Grid-cell description skeleton">{t("palmoil")}</div>
          <div className="Grid-cell icons skeleton">
            <span className="icon-help"></span>
          </div>
        </div>
        <div className="Grid">
          <div className="Grid-cell description skeleton">Nutriscore</div>
          <div className="Grid-cell icons skeleton">
            <span className="icon-help"></span>
          </div>
        </div>
        <div className="Grid">
          <div className="Grid-cell description skeleton">Grade</div>
          <div className="Grid-cell icons skeleton">
            <span className="icon-help"></span>
          </div>
        </div>
        <span className="source skeleton">&nbsp;</span>
        <span className="button skeleton">{t("share")}</span>
      </div>
    </div>
  );
}
