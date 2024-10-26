export interface ScannerProps {
  onDetected: (result: DetectionResult) => void;
  setScanning: (scanning: boolean) => void;
}

export interface DetectionResult {
  codeResult: {
    code: string;
  };
}
