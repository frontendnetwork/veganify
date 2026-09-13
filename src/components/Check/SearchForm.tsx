"use client";

import { ArrowRight, Loader2 } from "lucide-react";
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

  return (
    <form aria-label={t("enterbarcode")} onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-2">
        <label
          className="font-medium text-muted text-sm"
          htmlFor="barcodeInput"
        >
          {t("enterbarcode")}
        </label>
        <div className="fluid-hover flex rounded-xl border border-line-strong bg-surface shadow-elev-1 focus-within:border-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
          <input
            aria-describedby="barcodeHint"
            autoComplete="off"
            className="h-14 min-w-0 flex-1 rounded-l-xl bg-transparent px-4 text-ink text-lg tracking-wide placeholder:text-muted focus:outline-none"
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
