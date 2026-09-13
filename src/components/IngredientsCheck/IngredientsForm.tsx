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
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ")
    .replace(/;/g, ",");

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
          aria-describedby={error ? "ingredients-error" : undefined}
          aria-invalid={error ? true : undefined}
          className="fluid-hover min-h-28 w-full resize-y rounded-xl border border-line-strong bg-surface px-4 py-3 text-ink shadow-elev-1 placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="fluid-hover mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface font-medium text-ink text-sm hover:bg-surface-2 disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-[0.98]"
          disabled={isScanning || loading}
          onClick={triggerFileSelect}
          type="button"
        >
          <Camera aria-hidden="true" className="size-4" />
          {isScanning ? `${t("scanning")} ${ocrProgress}%` : t("scanlabel")}
        </button>
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
          <p
            className="mt-5 rounded-xl border border-line bg-surface p-4 text-ink text-sm shadow-elev-1"
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
