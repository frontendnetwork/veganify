import type { RefObject } from "react";

export interface ScannerProps {
  onDetected: (result: DetectionResult) => void;
  setScanning: (scanning: boolean) => void;
  /** The button that opened the scanner; focus returns here on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export interface DetectionResult {
  codeResult: {
    code: string;
  };
}
