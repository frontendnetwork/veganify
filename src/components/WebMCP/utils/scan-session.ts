export const SCAN_CONSENT_TIMEOUT_MS = 60_000;
export const SCAN_CAMERA_TIMEOUT_MS = 60_000;

type ScanPhase = "idle" | "consent" | "scanning";

export interface ScanSessionSnapshot {
  phase: ScanPhase;
}

export interface ScanSessionTimer {
  clearTimeout: (id: ReturnType<typeof setTimeout>) => void;
  setTimeout: (
    callback: () => void,
    delay: number
  ) => ReturnType<typeof setTimeout>;
}

export interface ScanSessionOptions {
  timer?: ScanSessionTimer;
}

export class AbortError extends Error {
  constructor(message = "The scan was aborted.") {
    super(message);
    this.name = "AbortError";
  }
}

export class ScanCancelledError extends Error {
  constructor(message = "The scan was cancelled.") {
    super(message);
    this.name = "ScanCancelledError";
  }
}

export class ScanCameraError extends Error {
  constructor(message = "The camera could not be started.") {
    super(message);
    this.name = "ScanCameraError";
  }
}

export class ScanDisposedError extends Error {
  constructor(message = "The scan provider was disposed.") {
    super(message);
    this.name = "ScanDisposedError";
  }
}

export class ScanTimeoutError extends Error {
  constructor(message = "The scan timed out.") {
    super(message);
    this.name = "ScanTimeoutError";
  }
}

export class ScanBusyError extends Error {
  constructor(message = "Another scan is already in progress.") {
    super(message);
    this.name = "ScanBusyError";
  }
}

interface ActiveScan {
  phase: Exclude<ScanPhase, "idle">;
  reject: (error: Error) => void;
  resolve: (barcode: string) => void;
  signal?: AbortSignal;
  signalListener?: () => void;
  timerId?: ReturnType<typeof setTimeout>;
}

const DEFAULT_TIMER: ScanSessionTimer = {
  clearTimeout: (id) => globalThis.clearTimeout(id),
  setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
};

export class ScanSession {
  private activeScan: ActiveScan | null = null;
  private readonly listeners = new Set<() => void>();
  private readonly timer: ScanSessionTimer;
  private snapshot: ScanSessionSnapshot = { phase: "idle" };

  constructor(options: ScanSessionOptions = {}) {
    this.timer = options.timer ?? DEFAULT_TIMER;
  }

  getSnapshot = (): ScanSessionSnapshot => this.snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  start(signal?: AbortSignal): Promise<string> {
    if (this.activeScan) {
      return Promise.reject(new ScanBusyError());
    }
    if (signal?.aborted) {
      return Promise.reject(new AbortError());
    }

    return new Promise<string>((resolve, reject) => {
      const activeScan: ActiveScan = {
        phase: "consent",
        reject,
        resolve,
        signal,
      };
      this.activeScan = activeScan;
      this.setPhase("consent");

      if (signal) {
        const handleAbort = () => this.settleReject(new AbortError());
        activeScan.signalListener = handleAbort;
        signal.addEventListener("abort", handleAbort, { once: true });
      }

      activeScan.timerId = this.timer.setTimeout(() => {
        if (this.activeScan !== activeScan) {
          return;
        }
        this.settleReject(
          new ScanTimeoutError("The camera consent prompt timed out.")
        );
      }, SCAN_CONSENT_TIMEOUT_MS);
    });
  }

  confirmConsent(): void {
    const { activeScan } = this;
    if (activeScan?.phase !== "consent") {
      return;
    }

    this.clearTimer(activeScan);
    activeScan.phase = "scanning";
    this.setPhase("scanning");
    activeScan.timerId = this.timer.setTimeout(() => {
      if (this.activeScan !== activeScan) {
        return;
      }
      this.settleReject(
        new ScanTimeoutError(
          "The camera scan timed out before a barcode was found."
        )
      );
    }, SCAN_CAMERA_TIMEOUT_MS);
  }

  cancel(): void {
    if (!this.activeScan) {
      return;
    }
    this.settleReject(new ScanCancelledError());
  }

  reportDetection(barcode: string): void {
    const { activeScan } = this;
    if (activeScan?.phase !== "scanning" || !barcode.trim()) {
      return;
    }
    this.settleResolve(barcode.trim());
  }

  reportCameraError(): void {
    if (!this.activeScan) {
      return;
    }
    this.settleReject(new ScanCameraError());
  }

  dispose(): void {
    if (this.activeScan) {
      this.settleReject(new ScanDisposedError());
      return;
    }
    this.setPhase("idle");
  }

  private clearTimer(activeScan: ActiveScan): void {
    if (activeScan.timerId === undefined) {
      return;
    }
    this.timer.clearTimeout(activeScan.timerId);
    activeScan.timerId = undefined;
  }

  private settleResolve(barcode: string): void {
    const { activeScan } = this;
    if (!activeScan) {
      return;
    }
    this.clearTimer(activeScan);
    this.removeSignalListener(activeScan);
    this.activeScan = null;
    this.setPhase("idle");
    activeScan.resolve(barcode);
  }

  private settleReject(error: Error): void {
    const { activeScan } = this;
    if (!activeScan) {
      return;
    }
    this.clearTimer(activeScan);
    this.removeSignalListener(activeScan);
    this.activeScan = null;
    this.setPhase("idle");
    activeScan.reject(error);
  }

  private removeSignalListener(activeScan: ActiveScan): void {
    if (!(activeScan.signal && activeScan.signalListener)) {
      return;
    }
    activeScan.signal.removeEventListener("abort", activeScan.signalListener);
    activeScan.signalListener = undefined;
  }

  private setPhase(phase: ScanPhase): void {
    if (this.snapshot.phase === phase) {
      return;
    }
    this.snapshot = { phase };
    for (const listener of this.listeners) {
      listener();
    }
  }
}
