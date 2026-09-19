import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import type { ModelContext } from "@mcp-b/webmcp-types";
import { GlobalWindow } from "happy-dom";
import { type ReactNode, StrictMode } from "react";
import type { ScannerProps } from "@/components/Scanner/models/scanner";
import type { EmptyToolInput, ToolDescriptor } from "./models/webmcp";

const domWindow = new GlobalWindow();
Object.assign(globalThis, {
  CustomEvent: domWindow.CustomEvent,
  cancelAnimationFrame: domWindow.cancelAnimationFrame.bind(domWindow),
  Document: domWindow.Document,
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

const getUserMedia = mock(() =>
  Promise.reject(new Error("camera must not be requested in this test"))
);

mock.module("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
const FakeAppDialog = ({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) => (open ? <div role="dialog">{children}</div> : null);

let scannerMounts = 0;
let latestScannerProps: ScannerProps | undefined;
const FakeViewportScanner = (props: ScannerProps) => {
  scannerMounts += 1;
  latestScannerProps = props;
  return <div data-testid="fake-scanner" />;
};

mock.module("@/components/ui/app-dialog", () => ({
  AppDialog: FakeAppDialog,
}));
mock.module("./WebMCPScanner", () => ({
  ViewportScanner: FakeViewportScanner,
}));

const registerResolvers: Array<() => void> = [];
const registeredTools: Array<{
  signal: AbortSignal | undefined;
  tool: ToolDescriptor;
}> = [];
const registerTool = mock(
  (tool: ToolDescriptor, options?: { signal?: AbortSignal }) => {
    registeredTools.push({ signal: options?.signal, tool });
    return Promise.resolve();
  }
);
const modelContext = {
  registerTool,
} as unknown as ModelContext;

const { WebMCPProvider } = await import("./WebMCPProvider");

const installContext = (): void => {
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: modelContext,
  });
};

beforeEach(() => {
  scannerMounts = 0;
  latestScannerProps = undefined;
  registeredTools.length = 0;
  registerResolvers.length = 0;
  registerTool.mockClear();
  getUserMedia.mockClear();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  installContext();
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "modelContext");
});

describe("WebMCPProvider", () => {
  test("registers all tools with one owned signal and cleans them up", async () => {
    const view = render(<WebMCPProvider>content</WebMCPProvider>);

    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(4));
    expect(registeredTools.map(({ tool }) => tool.name)).toEqual([
      "check_ingredients",
      "check_product",
      "scan_product",
      "get_history",
    ]);
    expect(new Set(registeredTools.map(({ signal }) => signal)).size).toBe(1);
    const [registration] = registeredTools;
    expect(registration.signal?.aborted).toBe(false);

    view.unmount();
    expect(registration.signal?.aborted).toBe(true);
  });

  test("requires consent before mounting the scanner", async () => {
    const view = render(<WebMCPProvider>content</WebMCPProvider>);
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(4));
    const scanTool = registeredTools.find(
      ({ tool }) => tool.name === "scan_product"
    )?.tool;
    if (!scanTool) {
      throw new Error("scan_product was not registered");
    }
    const executeScan = scanTool.execute as unknown as (
      input: EmptyToolInput
    ) => Promise<unknown>;

    const scan = executeScan({});
    expect(scannerMounts).toBe(0);
    await waitFor(() => expect(view.getByRole("dialog")).toBeTruthy());

    fireEvent.click(view.getByRole("button", { name: "cancel" }));
    await expect(scan).rejects.toMatchObject({ name: "ScanCancelledError" });
    expect(scannerMounts).toBe(0);
    expect(getUserMedia).not.toHaveBeenCalled();

    const secondScan = executeScan({});
    await waitFor(() => expect(view.getByRole("dialog")).toBeTruthy());
    fireEvent.click(view.getByRole("button", { name: "openCamera" }));
    await waitFor(() => expect(scannerMounts).toBe(1));
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(latestScannerProps).toBeDefined();
    latestScannerProps?.onCancelled?.();
    await expect(secondScan).rejects.toMatchObject({
      name: "ScanCancelledError",
    });
  });

  test("aborts registration when a partial run fails", async () => {
    registerTool.mockImplementationOnce(
      (tool: ToolDescriptor, options?: { signal?: AbortSignal }) => {
        registeredTools.push({ signal: options?.signal, tool });
        return Promise.reject(new Error("duplicate tool"));
      }
    );
    render(<WebMCPProvider>content</WebMCPProvider>);

    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(registeredTools[0]?.signal?.aborted).toBe(true));
  });

  test("waits for an earlier registration run before a remount registers again", async () => {
    registerTool.mockImplementation((tool, options) => {
      registeredTools.push({ signal: options?.signal, tool });
      return new Promise<void>((resolve) => {
        registerResolvers.push(resolve);
      });
    });

    const view = render(
      <StrictMode>
        <WebMCPProvider>content</WebMCPProvider>
      </StrictMode>
    );
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(1));
    const firstSignal = registeredTools[0]?.signal;
    expect(firstSignal).toBeDefined();

    registerResolvers.shift()?.();
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(2));
    view.unmount();
    registerResolvers.shift()?.();
    expect(firstSignal?.aborted).toBe(true);
    expect(registeredTools.every(({ signal }) => signal?.aborted)).toBe(true);
  });
});
