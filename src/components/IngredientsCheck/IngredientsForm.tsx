"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";

import type { IngredientResult } from "./models/IngredientResult";
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
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        height={48}
        src="/./img/Veganify.svg"
        width={48}
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
            aria-label={t("submit")}
            name="checkingredients"
            type="submit"
          >
            <span className="icon-right-open" />
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
