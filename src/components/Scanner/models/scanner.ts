import type { RefObject } from "react";

export interface ScannerProps {
  /** Called once when a user explicitly closes the scanner. */
  onCancelled?: () => void;
  onDetected: (result: DetectionResult) => void;
  /** Called once when the current camera attempt cannot initialize. */
  onError?: (error: unknown) => void;
  setScanning: (scanning: boolean) => void;
  /** The element that opened the scanner; focus returns here on close. */
  triggerRef: RefObject<HTMLElement | null>;
}

export interface DetectionResult {
  codeResult: {
    code: string;
  };
}
