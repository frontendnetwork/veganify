import { describe, expect, mock, test } from "bun:test";

import {
  AbortError,
  ScanBusyError,
  ScanCameraError,
  ScanCancelledError,
  ScanDisposedError,
  ScanSession,
  type ScanSessionTimer,
  ScanTimeoutError,
} from "./scan-session";

const createFakeTimer = () => {
  const callbacks = new Map<ReturnType<typeof setTimeout>, () => void>();
  let nextId = 0;
  const timer: ScanSessionTimer = {
    clearTimeout: (id) => callbacks.delete(id),
    setTimeout: (callback) => {
      const id = nextId as unknown as ReturnType<typeof setTimeout>;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    },
  };
  return {
    runNext: () => {
      const entry = callbacks.entries().next().value;
      if (!entry) {
        throw new Error("No fake timer is pending.");
      }
      const [id, callback] = entry;
      callbacks.delete(id);
      callback();
    },
    timer,
  };
};

describe("ScanSession", () => {
  test("rejects consent cancellation without entering the scanning phase", async () => {
    const session = new ScanSession();
    const scan = session.start();

    expect(session.getSnapshot()).toEqual({ phase: "consent" });
    session.cancel();

    await expect(scan).rejects.toBeInstanceOf(ScanCancelledError);
    expect(session.getSnapshot()).toEqual({ phase: "idle" });
  });

  test("resolves the first detected barcode and ignores later detections", async () => {
    const session = new ScanSession();
    const scan = session.start();

    session.confirmConsent();
    expect(session.getSnapshot()).toEqual({ phase: "scanning" });
    session.reportDetection(" 4000417025005 ");
    session.reportDetection("4000417025006");

    await expect(scan).resolves.toBe("4000417025005");
    expect(session.getSnapshot()).toEqual({ phase: "idle" });
  });

  test("rejects camera failures, disposal, and overlapping requests with named errors", async () => {
    const session = new ScanSession();
    const firstScan = session.start();
    const overlappingScan = session.start();

    await expect(overlappingScan).rejects.toBeInstanceOf(ScanBusyError);
    session.confirmConsent();
    session.reportCameraError();
    await expect(firstScan).rejects.toBeInstanceOf(ScanCameraError);

    const disposedScan = session.start();
    session.dispose();
    await expect(disposedScan).rejects.toBeInstanceOf(ScanDisposedError);
  });

  test("aborts once and removes the native abort listener after settlement", async () => {
    const controller = new AbortController();
    const removeAbortListener = mock(
      controller.signal.removeEventListener.bind(controller.signal)
    );
    controller.signal.removeEventListener = removeAbortListener;
    const session = new ScanSession();
    const scan = session.start(controller.signal);

    controller.abort();

    await expect(scan).rejects.toBeInstanceOf(AbortError);
    expect(removeAbortListener).toHaveBeenCalledTimes(1);
    controller.abort();
    expect(session.getSnapshot()).toEqual({ phase: "idle" });
  });

  test("uses the consent timer and then the camera timer", async () => {
    const fakeTimer = createFakeTimer();
    const session = new ScanSession({ timer: fakeTimer.timer });
    const consentScan = session.start();

    fakeTimer.runNext();
    await expect(consentScan).rejects.toBeInstanceOf(ScanTimeoutError);

    const cameraScan = session.start();
    session.confirmConsent();
    fakeTimer.runNext();
    await expect(cameraScan).rejects.toBeInstanceOf(ScanTimeoutError);
  });
});
