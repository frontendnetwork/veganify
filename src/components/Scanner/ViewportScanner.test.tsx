import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { GlobalWindow } from "happy-dom";

const domWindow = new GlobalWindow();
Object.assign(globalThis, {
  CustomEvent: domWindow.CustomEvent,
  cancelAnimationFrame: domWindow.cancelAnimationFrame.bind(domWindow),
  document: domWindow.document,
  Element: domWindow.Element,
  Event: domWindow.Event,
  FocusEvent: domWindow.FocusEvent,
  getComputedStyle: domWindow.getComputedStyle.bind(domWindow),
  HTMLButtonElement: domWindow.HTMLButtonElement,
  HTMLDivElement: domWindow.HTMLDivElement,
  HTMLElement: domWindow.HTMLElement,
  HTMLInputElement: domWindow.HTMLInputElement,
  HTMLSelectElement: domWindow.HTMLSelectElement,
  HTMLTextAreaElement: domWindow.HTMLTextAreaElement,
  KeyboardEvent: domWindow.KeyboardEvent,
  MouseEvent: domWindow.MouseEvent,
  MutationObserver: domWindow.MutationObserver,
  Node: domWindow.Node,
  NodeFilter: domWindow.NodeFilter,
  navigator: domWindow.navigator,
  ResizeObserver: domWindow.ResizeObserver,
  requestAnimationFrame: domWindow.requestAnimationFrame.bind(domWindow),
  SVGElement: domWindow.SVGElement,
  window: domWindow,
});

const { cleanup, fireEvent, render, waitFor } = await import(
  "@testing-library/react"
);

mock.module("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import type { DetectionResult } from "./models/scanner";

type InitCallback = (error: Error | null) => void;
type DetectionCallback = (result: DetectionResult) => void;
interface CameraStream {
  getTracks: () => Array<{ stop: () => void }>;
}

const initCallbacks: InitCallback[] = [];
let detectionCallback: DetectionCallback | undefined;

const init = mock((_config: unknown, callback: InitCallback) => {
  initCallbacks.push(callback);
  return Promise.resolve();
});
const start = mock(() => undefined);
const stop = mock(() => Promise.resolve());
const onDetected = mock((callback: DetectionCallback) => {
  detectionCallback = callback;
});
const offDetected = mock(() => undefined);

mock.module("@ericblade/quagga2", () => ({
  default: {
    init,
    offDetected,
    onDetected,
    start,
    stop,
  },
}));

const { ViewportScanner } = await import("./ViewportScanner");

const getUserMedia = mock(
  (): Promise<CameraStream> =>
    Promise.resolve({
      getTracks: () => [{ stop: mock(() => undefined) }],
    })
);

const setMediaDevices = (): void => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
};

const renderScanner = () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  const detected: DetectionResult[] = [];
  const errors: unknown[] = [];
  const onCancelled = mock(() => undefined);
  const setScanning = mock(() => undefined);
  const onScanDetected = mock((result: DetectionResult) => {
    detected.push(result);
  });
  const onError = mock((error: unknown) => {
    errors.push(error);
  });

  const view = render(
    <ViewportScanner
      onCancelled={onCancelled}
      onDetected={onScanDetected}
      onError={onError}
      setScanning={setScanning}
      triggerRef={{ current: trigger }}
    />
  );

  return {
    detected,
    errors,
    getByRole: view.getByRole,
    onCancelled,
    onError,
    onScanDetected,
    trigger,
  };
};

beforeEach(() => {
  initCallbacks.length = 0;
  detectionCallback = undefined;
  init.mockClear();
  start.mockClear();
  stop.mockClear();
  onDetected.mockClear();
  offDetected.mockClear();
  getUserMedia.mockClear();
  getUserMedia.mockImplementation(
    (): Promise<CameraStream> =>
      Promise.resolve({
        getTracks: () => [{ stop: mock(() => undefined) }],
      })
  );
  setMediaDevices();
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("ViewportScanner", () => {
  test("reports one detection per mounted scanner", async () => {
    const { detected, onScanDetected } = renderScanner();

    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    initCallbacks[0]?.(null);
    await waitFor(() => expect(start).toHaveBeenCalledTimes(1));

    const result = { codeResult: { code: "4000417025005" } };
    detectionCallback?.(result);
    detectionCallback?.({ codeResult: { code: "4000417025006" } });

    expect(onScanDetected).toHaveBeenCalledTimes(1);
    expect(detected).toEqual([result]);
  });

  test("cancels once when the scanner is explicitly closed", async () => {
    const { getByRole, onCancelled } = renderScanner();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));

    fireEvent.click(getByRole("button", { name: "close" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCancelled).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalled();
  });

  test("reports camera preflight errors once without initializing Quagga", async () => {
    const cameraError = new Error("permission denied");
    getUserMedia.mockRejectedValueOnce(cameraError);
    const { errors, onError } = renderScanner();

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(errors).toEqual([cameraError]);
    expect(init).not.toHaveBeenCalled();
  });

  test("does not initialize a stale preflight stream after close", async () => {
    let resolveStream:
      | ((stream: { getTracks: () => Array<{ stop: () => void }> }) => void)
      | undefined;
    const trackStop = mock(() => undefined);
    getUserMedia.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveStream = resolve;
        })
    );
    const { getByRole, onError } = renderScanner();

    await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));
    fireEvent.click(getByRole("button", { name: "close" }));
    resolveStream?.({ getTracks: () => [{ stop: trackStop }] });
    await Promise.resolve();
    await Promise.resolve();

    expect(trackStop).toHaveBeenCalledTimes(1);
    expect(init).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test("reports Quagga initialization errors once", async () => {
    const quaggaError = new Error("quagga failed");
    const { errors, onError } = renderScanner();

    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    initCallbacks[0]?.(quaggaError);
    initCallbacks[0]?.(quaggaError);

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(errors).toEqual([quaggaError]);
    expect(start).not.toHaveBeenCalled();
  });

  test("returns focus to the connected trigger after close", async () => {
    const { getByRole, trigger } = renderScanner();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    trigger.focus();

    fireEvent.click(getByRole("button", { name: "close" }));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test("does not fail when the previous focus target is disconnected", async () => {
    const { getByRole, trigger } = renderScanner();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    trigger.remove();

    expect(() =>
      fireEvent.click(getByRole("button", { name: "close" }))
    ).not.toThrow();
  });

  test("does not start a stale successful init callback after close", async () => {
    const { getByRole } = renderScanner();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));

    fireEvent.click(getByRole("button", { name: "close" }));
    initCallbacks[0]?.(null);
    await Promise.resolve();

    expect(start).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test("keeps the detection listener during a camera switch", async () => {
    const { detected, getByRole } = renderScanner();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    initCallbacks[0]?.(null);
    await waitFor(() => expect(start).toHaveBeenCalledTimes(1));

    fireEvent.click(getByRole("button", { name: "switchcamera" }));
    await waitFor(() => expect(init).toHaveBeenCalledTimes(2));
    initCallbacks[0]?.(null);
    expect(start).toHaveBeenCalledTimes(1);
    initCallbacks[1]?.(null);
    await waitFor(() => expect(start).toHaveBeenCalledTimes(2));

    expect(onDetected).toHaveBeenCalledTimes(1);
    expect(offDetected).not.toHaveBeenCalled();
    detectionCallback?.({ codeResult: { code: "4000417025005" } });
    expect(detected).toHaveLength(1);
  });
});
