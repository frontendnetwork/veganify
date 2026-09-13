"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type FormEvent, useCallback, useRef } from "react";

import ScanButton from "@/components/Scanner";
import {
  useFluidHover,
  useRegisterFluidHoverItem,
} from "@/hooks/use-fluid-hover";

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

  const groupRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Fluid Functionalism proximity hover: the nearest interactive part of the
  // search bar pre-highlights before the cursor lands. Gap clicks stay inert
  // — empty space must not submit the form.
  const { handlers, registerItem } = useFluidHover(groupRef, {
    axis: "x",
    gapClick: false,
  });
  useRegisterFluidHoverItem(registerItem, 0, scanRef);
  useRegisterFluidHoverItem(registerItem, 1, submitRef);

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
        <div
          className="fluid-hover relative flex rounded-xl border border-line-strong bg-surface shadow-elev-1 focus-within:border-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-ring"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
          onMouseMove={handlers.onMouseMove}
          ref={groupRef}
        >
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
            buttonRef={scanRef}
            handleSubmit={handleScanSubmit}
            onDetected={onBarcodeChange}
          />
          <button
            aria-label={t("submit")}
            className="fluid-hover flex w-14 items-center justify-center rounded-r-xl bg-accent text-accent-foreground hover:bg-accent-hover disabled:opacity-60 data-[fluid-hover-active]:brightness-110"
            disabled={loading}
            name="submit"
            ref={submitRef}
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
