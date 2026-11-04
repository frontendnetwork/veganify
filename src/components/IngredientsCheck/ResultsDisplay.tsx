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
    <div className="border-line bg-surface shadow-elev-2 mt-6 rounded-2xl border p-5 sm:p-6">
      <div className="border-line flex items-center justify-between border-b pb-3">
        <p className="text-ink font-semibold">{t("vegan")}</p>
        <p
          className={
            result.vegan
              ? "text-success flex items-center gap-1.5 font-medium"
              : "text-danger flex items-center gap-1.5 font-medium"
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
