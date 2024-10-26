"use client";

import { useState } from "react";

import { DetectionResult } from "./models/scanner";
import { ViewportScanner } from "./ViewportScanner";

interface ScanButtonProps {
  onDetected: (barcode: string) => void;
  handleSubmit: (barcode: string, obj: object) => void;
}

export function ScanButton({ onDetected, handleSubmit }: ScanButtonProps) {
  const [scanning, setScanning] = useState(false);

  const handleDetection = (result: DetectionResult) => {
    const barcode = result.codeResult.code;
    setScanning(false);
    onDetected(barcode);
    handleSubmit(barcode, {});
  };

  return (
    <>
      <button
        type="button"
        aria-label="Barcode scannen"
        onClick={() => setScanning(true)}
      >
        <span className="icon-barcode" />
      </button>

      {scanning && (
        <ViewportScanner
          onDetected={handleDetection}
          setScanning={setScanning}
        />
      )}
    </>
  );
}
