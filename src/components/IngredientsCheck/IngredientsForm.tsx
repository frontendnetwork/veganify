"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";

import { FetchStatus } from "@/models/FetchStatus";
import type { IngredientResult } from "./models/IngredientResult";
import { ResultDisplay } from "./ResultsDisplay";
import { checkIngredients } from "./utils/actions";
import { preprocessIngredients } from "./utils/preprocessIngredients";

const EMPTY_RESULT: IngredientResult = {
  maybeNotVegan: [],
  notVegan: [],
  surelyVegan: [],
  unknown: [],
  vegan: null,
};

export function IngredientsForm() {
  const t = useTranslations("Ingredients");
  const [result, setResult] = useState<IngredientResult>(EMPTY_RESULT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setResult(EMPTY_RESULT);
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
      <h1 className="mb-1 text-center font-semibold text-xl">
        {t("ingredientcheck")}
      </h1>
      <p className="mb-5 text-center text-muted text-sm">
        {t("ingredientcheck_desc")}
      </p>

      <form onSubmit={handleSubmit}>
        <label
          className="mb-2 block font-medium text-muted text-sm"
          htmlFor="ingredients"
        >
          {t("entercommaseperated")}
        </label>
        <textarea
          className="fluid-hover min-h-28 w-full resize-y rounded-xl border border-line-strong bg-surface px-4 py-3 text-ink shadow-elev-1 placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
          id="ingredients"
          name="ingredients"
          placeholder={t("ingredientsexample")}
        />
        <button
          className="fluid-hover mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent font-medium text-accent-foreground text-sm hover:bg-accent-hover disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-[0.98]"
          disabled={loading}
          type="submit"
        >
          {t("submit")}
        </button>
      </form>

      <div aria-live="polite" role="status">
        {loading ? <p className="sr-only-focusable">{t("searching")}</p> : null}
        {result.vegan === null ? null : <ResultDisplay result={result} t={t} />}
        {error ? (
          <p className="mt-5 rounded-xl border border-line bg-surface p-4 text-ink text-sm shadow-elev-1">
            {error}
          </p>
        ) : null}
        {!!loading && (
          <div aria-hidden="true" className="mt-5 space-y-2">
            {[0, 1, 2, 3].map((row) => (
              <div
                className="h-6 rounded bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer"
                key={row}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
