"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";
import { FetchStatus } from "@/models/FetchStatus";
import type { IngredientResult } from "./models/IngredientResult";
import { ResultDisplay } from "./ResultsDisplay";
import { checkIngredients } from "./utils/actions";
import { preprocessIngredients } from "./utils/preprocessIngredients";

export function IngredientsForm() {
  const t = useTranslations("Ingredients");
  const [result, setResult] = useState<IngredientResult>({
    maybeNotVegan: [],
    notVegan: [],
    surelyVegan: [],
    unknown: [],
    vegan: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setResult({
        maybeNotVegan: [],
        notVegan: [],
        surelyVegan: [],
        unknown: [],
        vegan: null,
      });
      setError(null);

      const formData = new FormData(event.currentTarget);
      const rawIngredients = formData.get("ingredients") as string;

      if (!rawIngredients.trim()) {
        setError(t("cannotbeempty"));
        return;
      }

      setLoading(true);
      try {
        const processedIngredients = preprocessIngredients(rawIngredients);
        const ingredientsString = processedIngredients.join(", ");

        const data = await checkIngredients(ingredientsString);
        if (data.status === FetchStatus.OK && data.result) {
          setResult(data.result);
        } else if (data.status === FetchStatus.INVALID) {
          setError(t("cannotbeempty"));
        } else {
          setError(t("unknown_error"));
        }
      } catch {
        setError(t("unknown_error"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  return (
    <>
      <Image
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        height={48}
        src="/./img/Veganify.svg"
        width={48}
      />
      <h2 style={{ marginTop: "0", textAlign: "center" }}>
        {t("ingredientcheck")}
      </h2>
      <p style={{ textAlign: "center" }}>{t("ingredientcheck_desc")}</p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("entercommaseperated")}</legend>
          <textarea
            id="ingredients"
            name="ingredients"
            placeholder={t("entercommaseperated")}
          />
          <button
            aria-label={t("submit")}
            name="checkingredients"
            type="submit"
          >
            <span className="icon-right-open" />
          </button>
        </fieldset>
      </form>
      {result.vegan !== null && <ResultDisplay result={result} t={t} />}
      {!!error && (
        <div id="result">
          <span className="animated fadeIn">
            <div className="resultborder">{error}</div>
          </span>
        </div>
      )}
      {!!loading && (
        <div className="loading_skeleton" id="result">
          <div className="animated fadeIn">
            <div className="resultborder">
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  <b>{t("vegan")}</b>
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help" />
                </div>
              </div>
              <span className="source skeleton">&nbsp;</span>
              <span className="source skeleton">&nbsp;</span>
              <span className="source skeleton">&nbsp;</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
