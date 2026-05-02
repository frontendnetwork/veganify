import { IngredientList } from "./IngredientsList";
import type { IngredientResult } from "./models/IngredientResult";
import type { TranslationFunction } from "./models/TranslateFunction";
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
              />
            </div>
          </div>
          <IngredientList
            iconClass="non-vegan icon-cancel"
            items={result.notVegan}
            t={t}
          />
          <IngredientList
            iconClass="unknown-vegan icon-help"
            items={result.unknown}
            t={t}
          />
          <IngredientList
            iconClass="maybe-vegan icon-attention-alt"
            items={result.maybeNotVegan}
            t={t}
          />
          <IngredientList
            iconClass="vegan icon-ok"
            items={result.surelyVegan}
            t={t}
          />
          <SourceInfo t={t} />
        </div>
      </div>
    </div>
  );
}
