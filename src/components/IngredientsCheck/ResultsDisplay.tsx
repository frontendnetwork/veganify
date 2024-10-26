import { IngredientList } from "./IngredientsList";
import { IngredientResult } from "./models/IngredientResult";
import { SourceInfo } from "./SourceInfo";

export function ResultDisplay({
  result,
  t,
}: {
  result: IngredientResult;
  t: (key: string, values?: Record<string, string>) => string;
}) {
  return (
    <div id="result">
      <div className="">
        <div className="resultborder">
          <div className="Grid">
            <div className="Grid-cell description">
              <b>{t("vegan")}</b>
            </div>
            <div className="Grid-cell icons">
              <span
                className={
                  result.vegan ? "vegan icon-ok" : "non-vegan icon-cancel"
                }
              ></span>
            </div>
          </div>
          <IngredientList
            items={result.notVegan}
            iconClass="non-vegan icon-cancel"
          />
          <IngredientList
            items={result.maybeVegan}
            iconClass="maybe-vegan icon-help"
          />
          <IngredientList
            items={result.surelyVegan}
            iconClass="vegan icon-ok"
          />
          <SourceInfo t={t} />
        </div>
      </div>
    </div>
  );
}
