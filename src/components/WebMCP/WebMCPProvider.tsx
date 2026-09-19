"use client";

import type {
  InputSchema,
  ModelContext,
  ModelContextTool,
  WebMcpToolInput,
} from "@mcp-b/webmcp-types";
import { useTranslations } from "next-intl";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import type { DetectionResult } from "@/components/Scanner/models/scanner";
import { AppDialog } from "@/components/ui/app-dialog";
import type { ToolDescriptor } from "./models/webmcp";
import { getModelContext } from "./utils/model-context";
import { ScanSession } from "./utils/scan-session";
import { createWebMcpTools } from "./utils/tools";
import { ViewportScanner } from "./WebMCPScanner";

const IDLE_SNAPSHOT = { phase: "idle" } as const;

type RegisterableTool = ModelContextTool<WebMcpToolInput, unknown> & {
  inputSchema: InputSchema;
};

const registerWebMcpTool = (
  modelContext: ModelContext,
  tool: ToolDescriptor,
  signal: AbortSignal
): Promise<void> =>
  modelContext.registerTool(tool as RegisterableTool, { signal });

export function WebMCPProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("WebMCP");
  const session = useMemo(() => new ScanSession(), []);
  const focusTargetRef = useRef<HTMLSpanElement>(null);
  const registrationEpochRef = useRef(0);
  const registrationGateRef = useRef<Promise<void>>(Promise.resolve());
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    () => IDLE_SNAPSHOT
  );

  useEffect(() => {
    const epoch = registrationEpochRef.current + 1;
    registrationEpochRef.current = epoch;
    const registrationController = new AbortController();
    let disposed = false;
    const previousRun = registrationGateRef.current;

    const run = previousRun.then(async () => {
      if (disposed || registrationEpochRef.current !== epoch) {
        return;
      }

      const modelContext = getModelContext();
      if (!modelContext || disposed || registrationEpochRef.current !== epoch) {
        return;
      }

      const tools = createWebMcpTools({
        scanProduct: (options) => session.start(options?.signal),
      });

      try {
        for (const tool of tools) {
          if (disposed || registrationEpochRef.current !== epoch) {
            return;
          }
          // Registration is intentionally sequential so a partial run can be
          // aborted before the next tool name is attempted.
          // biome-ignore lint/performance/noAwaitInLoops: Registration order prevents duplicate partial runs.
          await registerWebMcpTool(
            modelContext,
            tool,
            registrationController.signal
          );
        }
      } catch {
        registrationController.abort();
      }
    });
    registrationGateRef.current = run.catch(() => undefined);

    return () => {
      disposed = true;
      registrationEpochRef.current += 1;
      registrationController.abort();
      session.dispose();
    };
  }, [session]);

  const handleConsentChange = useCallback(
    (open: boolean) => {
      if (!open) {
        session.cancel();
      }
    },
    [session]
  );
  const handleCancel = useCallback(() => session.cancel(), [session]);
  const handleConfirm = useCallback(() => session.confirmConsent(), [session]);
  const handleDetected = useCallback(
    (result: DetectionResult) =>
      session.reportDetection(result.codeResult.code),
    [session]
  );
  const handleScannerCancelled = useCallback(() => session.cancel(), [session]);
  const handleScannerError = useCallback(
    () => session.reportCameraError(),
    [session]
  );
  const setScannerScanning = useCallback(() => undefined, []);

  return (
    <>
      {children}
      <span
        aria-hidden="true"
        className="sr-only"
        ref={focusTargetRef}
        tabIndex={-1}
      />
      <AppDialog
        description={t("scanDescription")}
        onOpenChange={handleConsentChange}
        open={snapshot.phase === "consent"}
        title={t("scanTitle")}
      >
        <div className="flex justify-end gap-2">
          <button
            className="fluid-hover rounded-lg border border-line-strong px-4 py-2 font-medium text-ink text-sm hover:bg-surface-2"
            onClick={handleCancel}
            type="button"
          >
            {t("cancel")}
          </button>
          <button
            className="fluid-hover rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground text-sm hover:bg-accent-hover"
            onClick={handleConfirm}
            type="button"
          >
            {t("openCamera")}
          </button>
        </div>
      </AppDialog>
      {snapshot.phase === "scanning" ? (
        <ViewportScanner
          onCancelled={handleScannerCancelled}
          onDetected={handleDetected}
          onError={handleScannerError}
          setScanning={setScannerScanning}
          triggerRef={focusTargetRef}
        />
      ) : null}
    </>
  );
}
