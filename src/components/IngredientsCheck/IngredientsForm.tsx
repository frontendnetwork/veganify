"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { IngredientResult } from "./models/IngredientResult";
import { ResultDisplay } from "./ResultsDisplay";
import { checkIngredients } from "./utils/actions";
import { preprocessIngredients } from "./utils/preprocessIngredients";

export function IngredientsForm() {
  const t = useTranslations("Ingredients");
  const [result, setResult] = useState<IngredientResult>({
    vegan: null,
    surelyVegan: [],
    notVegan: [],
    maybeNotVegan: [],
    unknown: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult({
      vegan: null,
      surelyVegan: [],
      notVegan: [],
      maybeNotVegan: [],
      unknown: [],
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
      setResult(data);
    } catch (error) {
      console.error("Error processing ingredients:", error);
      setError(t("cannotbeempty"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Image
        src="/./img/Veganify.svg"
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        width={48}
        height={48}
      />
      <h2 style={{ textAlign: "center", marginTop: "0" }}>
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
            type="submit"
            name="checkingredients"
            aria-label={t("submit")}
          >
            <span className="icon-right-open"></span>
          </button>
        </fieldset>
      </form>
      {result.vegan !== null && <ResultDisplay result={result} t={t} />}
      {error && (
        <div id="result">
          <span className="animated fadeIn">
            <div className="resultborder">{error}</div>
          </span>
        </div>
      )}
      {loading && (
        <div id="result" className="loading_skeleton">
          <div className="animated fadeIn">
            <div className="resultborder">
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  <b>{t("vegan")}</b>
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
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
