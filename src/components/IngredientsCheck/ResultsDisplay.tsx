import { IngredientList } from "./IngredientsList";
import { IngredientResult } from "./models/IngredientResult";
import { TranslationFunction } from "./models/TranslateFunction";
import { SourceInfo } from "./SourceInfo";

interface ResultDisplayProps {
  result: IngredientResult;
  t: TranslationFunction;
}

export function ResultDisplay({ result, t }: ResultDisplayProps) {
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
            t={t}
          />
          <IngredientList
            items={result.unknown}
            iconClass="unknown-vegan icon-help"
            t={t}
          />
          <IngredientList
            items={result.maybeNotVegan}
            iconClass="maybe-vegan icon-attention-alt"
            t={t}
          />
          <IngredientList
            items={result.surelyVegan}
            iconClass="vegan icon-ok"
            t={t}
          />
          <SourceInfo t={t} />
        </div>
      </div>
    </div>
  );
}
