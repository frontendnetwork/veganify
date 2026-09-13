"use client";

import { useCallback, useState } from "react";

import type { DetectionResult } from "./models/scanner";
import { ViewportScanner } from "./ViewportScanner";

interface ScanButtonProps {
  handleSubmit: (barcode: string, obj: object) => void;
  onDetected: (barcode: string) => void;
}

export function ScanButton({ onDetected, handleSubmit }: ScanButtonProps) {
  const [scanning, setScanning] = useState(false);

  const startScanning = useCallback(() => setScanning(true), []);

  const handleDetection = useCallback(
    (result: DetectionResult) => {
      const barcode = result.codeResult.code;
      setScanning(false);
      onDetected(barcode);
      handleSubmit(barcode, {});
    },
    [handleSubmit, onDetected]
  );

  return (
    <>
      <button
        aria-label="Barcode scannen"
        onClick={startScanning}
        type="button"
      >
        <span className="icon-barcode" />
      </button>

      {!!scanning && (
        <ViewportScanner
          onDetected={handleDetection}
          setScanning={setScanning}
        />
      )}
    </>
  );
}
