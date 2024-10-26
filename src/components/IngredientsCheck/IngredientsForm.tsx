"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { IngredientResult } from "./models/IngredientResult";
import { ResultDisplay } from "./ResultsDisplay";
import { checkIngredients } from "./utils/actions";

export function IngredientsForm() {
  const t = useTranslations("Ingredients");
  const [result, setResult] = useState<IngredientResult>({
    vegan: null,
    surelyVegan: [],
    notVegan: [],
    maybeVegan: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult({ vegan: null, surelyVegan: [], notVegan: [], maybeVegan: [] });
    setError(null);

    const formData = new FormData(event.currentTarget);
    const ingredients = formData.get("ingredients") as string;

    if (!ingredients.trim()) {
      setError(t("cannotbeempty"));
      return;
    }

    setLoading(true);
    try {
      const data = await checkIngredients(ingredients);
      setResult(data);
    } catch (error) {
      console.log(error);
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
