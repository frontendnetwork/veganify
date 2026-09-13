"use client";

import Image from "next/image";
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
    (event: FormEvent) => onSubmit(barcode, event),
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
    <>
      <Image
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        height={48}
        src="/./img/Veganify.svg"
        width={48}
      />
      <form onSubmit={handleFormSubmit}>
        <legend>{t("enterbarcode")}</legend>
        <fieldset>
          <legend>{t("enterbarcode")}</legend>
          <ScanButton
            handleSubmit={handleScanSubmit}
            onDetected={onBarcodeChange}
          />
          <label className="hidden" htmlFor="barcodeInput">
            {t("enterbarcode")}
          </label>
          <input
            autoFocus={true}
            id="barcodeInput"
            name="barcode"
            onChange={handleBarcodeChange}
            placeholder={t("enterbarcode")}
            type="number"
            value={barcode}
          />
          <button aria-label={t("submit")} name="submit">
            <span className="icon-right-open" />
          </button>
        </fieldset>
      </form>
    </>
  );
}
