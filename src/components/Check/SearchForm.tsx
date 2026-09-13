"use client";

import { ArrowRight, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type FormEvent, useCallback } from "react";

import ScanButton from "@/components/Scanner";

interface SearchFormProps {
  barcode: string;
  loading: boolean;
  onBarcodeChange: (barcode: string) => void;
  onSubmit: (barcode: string, e?: FormEvent) => void;
}

export function SearchForm({
  barcode,
  loading,
  onBarcodeChange,
  onSubmit,
}: SearchFormProps) {
  const t = useTranslations("Check");

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => onSubmit(barcode, event),
    [barcode, onSubmit]
  );
  const handleScanSubmit = useCallback(
    (scannedBarcode: string) => onSubmit(scannedBarcode),
    [onSubmit]
  );
  const handleBarcodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onBarcodeChange(event.target.value),
    [onBarcodeChange]
  );
  const handleClearBarcode = useCallback(
    () => onBarcodeChange(""),
    [onBarcodeChange]
  );

  return (
    <form aria-label={t("enterbarcode")} onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-2">
        <label
          className="font-medium text-muted text-sm"
          htmlFor="barcodeInput"
        >
          {t("enterbarcode")}
        </label>
        <div className="fluid-hover relative flex rounded-xl border border-line-strong bg-surface shadow-elev-1 focus-within:border-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
          <div className="relative min-w-0 flex-1">
            <input
              aria-describedby="barcodeHint"
              autoComplete="off"
              className={`h-14 w-full rounded-l-xl bg-transparent px-4 text-ink text-lg tracking-wide placeholder:text-muted focus:outline-none ${barcode ? "pr-14" : ""}`}
              id="barcodeInput"
              inputMode="numeric"
              name="barcode"
              onChange={handleBarcodeChange}
              pattern="[0-9]*"
              placeholder={t("barcodeexample")}
              spellCheck={false}
              type="text"
              value={barcode}
            />
            {barcode ? (
              <button
                aria-label={t("clearbarcode")}
                className="fluid-hover absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:bg-surface-2 hover:text-ink"
                onClick={handleClearBarcode}
                type="button"
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            ) : null}
          </div>
          <div aria-hidden="true" className="my-3 w-px bg-line" />
          <ScanButton
            handleSubmit={handleScanSubmit}
            onDetected={onBarcodeChange}
          />
          <button
            aria-label={t("submit")}
            className="fluid-hover flex w-14 items-center justify-center rounded-r-xl bg-accent text-accent-foreground hover:bg-accent-hover disabled:opacity-60"
            disabled={loading}
            name="submit"
            type="submit"
          >
            {loading ? (
              <Loader2
                aria-hidden="true"
                className="size-5 animate-spin motion-reduce:animate-none"
              />
            ) : (
              <ArrowRight aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
        <p className="text-muted text-sm" id="barcodeHint">
          {t("barcodehint")}
        </p>
      </div>
    </form>
  );
}
