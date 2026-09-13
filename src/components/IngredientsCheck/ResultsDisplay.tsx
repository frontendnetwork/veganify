import { IngredientList } from "./IngredientList";
import type { IngredientResult } from "./models/IngredientResult";
import type { TranslationFunction } from "./models/TranslateFunction";
import { SourceInfo } from "./SourceInfo";

interface ResultDisplayProps {
  result: IngredientResult;
  t: TranslationFunction;
}

export function ResultDisplay({ result, t }: ResultDisplayProps) {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-elev-2 sm:p-6">
      <div className="flex items-center justify-between border-line border-b pb-3">
        <p className="font-semibold text-ink">{t("vegan")}</p>
        <p
          className={
            result.vegan
              ? "flex items-center gap-1.5 font-medium text-success"
              : "flex items-center gap-1.5 font-medium text-danger"
          }
        >
          {result.vegan ? t("yes") : t("no")}
        </p>
      </div>
      <IngredientList icon="danger" items={result.notVegan} t={t} />
      <IngredientList icon="unknown" items={result.unknown} t={t} />
      <IngredientList icon="caution" items={result.maybeNotVegan} t={t} />
      <IngredientList icon="success" items={result.surelyVegan} t={t} />
      <SourceInfo />
    </div>
  );
}
