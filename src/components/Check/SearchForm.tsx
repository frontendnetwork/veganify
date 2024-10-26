"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import ScanButton from "@/components/Scanner";
import { FormEvent } from "react";

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

  return (
    <>
      <Image
        src="/./img/Veganify.svg"
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        width={48}
        height={48}
      />
      <form onSubmit={(e) => onSubmit(barcode, e)}>
        <legend>{t("enterbarcode")}</legend>
        <fieldset>
          <legend>{t("enterbarcode")}</legend>
          <ScanButton
            onDetected={onBarcodeChange}
            handleSubmit={(barcode) => onSubmit(barcode)}
          />
          <label htmlFor="barcodeInput" className="hidden">
            {t("enterbarcode")}
          </label>
          <input
            type="number"
            name="barcode"
            id="barcodeInput"
            placeholder={t("enterbarcode")}
            autoFocus={true}
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
          />
          <button name="submit" aria-label={t("submit")}>
            <span className="icon-right-open" />
          </button>
        </fieldset>
      </form>
    </>
  );
}
