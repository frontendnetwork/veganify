"use client";

import { ScanBarcode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import type { DetectionResult } from "./models/scanner";
import { ViewportScanner } from "./ViewportScanner";

interface ScanButtonProps {
  handleSubmit: (barcode: string) => void;
  onDetected: (barcode: string) => void;
}

export function ScanButton({ onDetected, handleSubmit }: ScanButtonProps) {
  const t = useTranslations("Scanner");
  const [scanning, setScanning] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const startScanning = useCallback(() => setScanning(true), []);

  const handleDetection = useCallback(
    (result: DetectionResult) => {
      const barcode = result.codeResult.code;
      setScanning(false);
      onDetected(barcode);
      handleSubmit(barcode);
    },
    [handleSubmit, onDetected]
  );

  return (
    <>
      <button
        aria-label={t("open")}
        className="fluid-hover flex w-14 shrink-0 items-center justify-center text-muted hover:bg-surface-2 hover:text-ink"
        onClick={startScanning}
        ref={triggerRef}
        type="button"
      >
        <ScanBarcode aria-hidden="true" className="size-5" />
      </button>
      {!!scanning && (
        <ViewportScanner
          onDetected={handleDetection}
          setScanning={setScanning}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}
