"use client";

import { Camera } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";

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

/** Tesseract traineddata codes for the supported app locales. */
const OCR_LANGUAGES: Record<string, string> = {
  cz: "ces",
  de: "deu",
  en: "eng",
  es: "spa",
  fr: "fra",
  pl: "pol",
  "pt-br": "por",
};

/** OCR output is one line per printed line; the checker wants commas. */
const ocrTextToIngredients = (text: string): string =>
  text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ")
    .replace(/;/gu, ",");

export function IngredientsForm() {
  const t = useTranslations("Ingredients");
  const locale = useLocale();
  const [result, setResult] = useState<IngredientResult>(EMPTY_RESULT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIngredientsChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setIngredients(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setResult(EMPTY_RESULT);
      setError(null);

      if (!ingredients.trim()) {
        setError(t("cannotbeempty"));
        textareaRef.current?.focus();
        return;
      }

      setLoading(true);
      try {
        const processedIngredients = preprocessIngredients(ingredients);
        const ingredientsString = processedIngredients.join(", ");

        const data = await checkIngredients(ingredientsString);
        if (data.status === FetchStatus.OK && data.result) {
          setResult(data.result);
        } else if (data.status === FetchStatus.INVALID) {
          setError(t("cannotbeempty"));
          textareaRef.current?.focus();
        } else {
          setError(t("unknown_error"));
        }
      } catch {
        setError(t("unknown_error"));
      } finally {
        setLoading(false);
      }
    },
    [ingredients, t]
  );

  const handlePhotoSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Allow picking the same photo twice in a row.
      event.target.value = "";
      if (!file) {
        return;
      }

      setError(null);
      setOcrProgress(0);
      try {
        // Loaded on demand: the OCR engine is a multi-megabyte chunk that
        // must never land in the initial bundle.
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker(OCR_LANGUAGES[locale] ?? "eng", 1, {
          logger: (message: { progress: number; status: string }) => {
            if (message.status === "recognizing text") {
              setOcrProgress(Math.round(message.progress * 100));
            }
          },
        });
        try {
          const { data } = await worker.recognize(file);
          const recognized = ocrTextToIngredients(data.text ?? "");
          if (recognized) {
            setIngredients((previous) =>
              previous.trim() ? `${previous.trim()}, ${recognized}` : recognized
            );
            textareaRef.current?.focus();
          } else {
            setError(t("ocrerror"));
          }
        } finally {
          await worker.terminate();
        }
      } catch (err) {
        console.error("Ingredient OCR failed", err);
        setError(t("ocrerror"));
      } finally {
        setOcrProgress(null);
      }
    },
    [locale, t]
  );

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const isScanning = ocrProgress !== null;

  return (
    <>
      <h1 className="mb-1 text-center text-xl font-semibold">
        {t("ingredientcheck")}
      </h1>
      <p className="text-muted mb-5 text-center text-sm">
        {t("ingredientcheck_desc")}
      </p>

      <form onSubmit={handleSubmit}>
        <label
          className="text-muted mb-2 block text-sm font-medium"
          htmlFor="ingredients"
        >
          {t("entercommaseperated")}
        </label>
        <textarea
          aria-describedby={error ? "ingredients-error" : undefined}
          aria-invalid={error ? true : undefined}
          className="fluid-hover border-line-strong bg-surface text-ink shadow-elev-1 placeholder:text-muted focus:border-accent focus:ring-ring min-h-28 w-full resize-y rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none"
          id="ingredients"
          name="ingredients"
          onChange={handleIngredientsChange}
          placeholder={t("ingredientsexample")}
          ref={textareaRef}
          value={ingredients}
        />
        <input
          accept="image/*"
          capture="environment"
          className="sr-only-focusable"
          onChange={handlePhotoSelect}
          ref={fileInputRef}
          type="file"
        />
        <button
          className="fluid-hover fluid-press border-line-strong bg-surface text-ink hover:bg-surface-2 mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium disabled:opacity-60 motion-safe:active:scale-[0.98]"
          disabled={isScanning || loading}
          onClick={triggerFileSelect}
          type="button"
        >
          <Camera aria-hidden="true" className="size-4" />
          {isScanning ? `${t("scanning")} ${ocrProgress}%` : t("scanlabel")}
        </button>
        <button
          className="fluid-hover fluid-press bg-accent text-accent-foreground hover:bg-accent-hover mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium disabled:opacity-60 motion-safe:active:scale-[0.98]"
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
          <p
            className="border-line bg-surface text-ink shadow-elev-1 mt-5 rounded-xl border p-4 text-sm"
            id="ingredients-error"
          >
            {error}
          </p>
        ) : null}
        {!!loading && (
          <div aria-hidden="true" className="mt-5 space-y-2">
            {[0, 1, 2, 3].map((row) => (
              <div className="skeleton-shimmer h-6 rounded" key={row} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
