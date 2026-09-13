"use client";

import { ScanBarcode } from "lucide-react";
import { useTranslations } from "next-intl";
import { type RefObject, useCallback, useRef, useState } from "react";

import type { DetectionResult } from "./models/scanner";
import { ViewportScanner } from "./ViewportScanner";

interface ScanButtonProps {
  buttonRef?: RefObject<HTMLButtonElement | null>;
  handleSubmit: (barcode: string) => void;
  onDetected: (barcode: string) => void;
}

export function ScanButton({
  onDetected,
  handleSubmit,
  buttonRef,
}: ScanButtonProps) {
  const t = useTranslations("Scanner");
  const [scanning, setScanning] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const startScanning = useCallback(() => setScanning(true), []);

  const attachTrigger = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (buttonRef) {
        buttonRef.current = node;
      }
    },
    [buttonRef]
  );

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
        className="fluid-hover flex w-14 shrink-0 items-center justify-center text-muted hover:bg-surface-2 hover:text-ink data-[fluid-hover-active]:bg-surface-2 data-[fluid-hover-active]:text-ink"
        onClick={startScanning}
        ref={attachTrigger}
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
