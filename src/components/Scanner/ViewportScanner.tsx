"use client";

import Quagga from "@ericblade/quagga2";
import {
  Content as DialogContent,
  Portal as DialogPortal,
  Root as DialogRoot,
} from "@radix-ui/react-dialog";
import { CameraOff, SwitchCamera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInertBackground } from "@/hooks/use-inert-background";
import type { ScannerProps } from "./models/scanner";

export function ViewportScanner({
  onDetected,
  setScanning,
  triggerRef,
}: ScannerProps) {
  const t = useTranslations("Scanner");
  // The scanner is a full-screen modal for its whole mounted lifetime.
  useInertBackground(true);
  const [facingMode, setFacingMode] = useState("environment");
  const [isHidden, setIsHidden] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  // Camera attempts are async and can overlap (dev StrictMode remounts,
  // rapid camera switches). Only the latest attempt may set state — a stale
  // attempt's late failure must not flag an error over a live camera.
  const attemptRef = useRef(0);

  const initializeScanner = useCallback(async (newFacingMode: string) => {
    const attempt = attemptRef.current + 1;
    attemptRef.current = attempt;
    setCameraError(false);
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Request the stream in the screen's own aspect ratio (portrait screens
    // swap width/height, since constraints describe the sensor frame). A
    // stream that already matches the screen means the full-bleed
    // object-fit: cover crop is only a few pixels instead of two thirds.
    const isPortrait = height >= width;
    const idealWidth = Math.min(isPortrait ? height : width, 1920);
    const idealHeight = Math.min(isPortrait ? width : height, 1920);

    // Preflight: obtain permission and a camera before Quagga touches
    // anything. A getUserMedia rejection that reaches Quagga's
    // InputStreamBrowser teardown crashes it ("null.removeEventListener"),
    // so failures are handled here instead — and `facingMode` uses an
    // `ideal` constraint so devices without the requested camera (e.g.
    // desktop Safari, no rear camera) fall back instead of rejecting.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: newFacingMode } },
      });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (err) {
      console.error("Camera unavailable:", err);
      if (attemptRef.current === attempt) {
        setCameraError(true);
      }
      return;
    }

    Quagga.init(
      {
        decoder: {
          readers: [
            "ean_reader",
            "code_39_reader",
            "code_128_reader",
            "i2of5_reader",
          ],
        },
        inputStream: {
          constraints: {
            facingMode: { ideal: newFacingMode },
            height: { ideal: idealHeight },
            width: { ideal: idealWidth },
          },
          type: "LiveStream",
        },
        locate: true,
        locator: {
          halfSample: true,
          patchSize: "medium",
        },
        numOfWorkers: 2,
      },
      (err: Error | null) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          if (attemptRef.current === attempt) {
            setCameraError(true);
          }
          return;
        }
        Quagga.start();
      }
    );
  }, []);

  const stop = useCallback(() => {
    try {
      Quagga.stop();
    } catch {
      // Quagga was never started (camera preflight failed) — nothing to stop.
    }
    Quagga.offDetected(onDetected);
  }, [onDetected]);

  const handleClose = useCallback(() => {
    setIsHidden(true);
    setScanning(false);
    stop();
  }, [setScanning, stop]);

  const handleCameraSwitch = useCallback(() => {
    const newFacingMode = facingMode === "environment" ? "user" : "environment";

    setFacingMode(newFacingMode);
    Quagga.stop();
    initializeScanner(newFacingMode);
  }, [facingMode, initializeScanner]);

  useEffect(() => {
    initializeScanner(facingMode);
    Quagga.onDetected(onDetected);

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleClose();
      }
    },
    [handleClose]
  );
  const preventClose = useCallback((event: Event) => {
    event.preventDefault();
  }, []);
  const returnFocusToTrigger = useCallback(
    (event: Event) => {
      event.preventDefault();
      triggerRef.current?.focus();
    },
    [triggerRef]
  );

  if (isHidden) {
    return null;
  }

  const viewportStyle: CSSProperties = {
    height: "100%",
    position: "fixed",
    width: "100%",
  };

  return (
    <DialogRoot onOpenChange={handleOpenChange} open>
      <DialogPortal forceMount>
        <DialogContent
          aria-label={t("open")}
          aria-modal="true"
          asChild
          forceMount
          onEscapeKeyDown={handleClose}
          onInteractOutside={preventClose}
          onCloseAutoFocus={returnFocusToTrigger}
        >
          <div className="fixed inset-0 z-50 overflow-hidden bg-black">
            {/* Quagga sizes its <video> inline to the stream resolution;
                force a full-bleed cover fit instead: fill the screen, crop
                the overflow, never stretch. */}
            <div
              className="viewport size-full [&_video]:absolute [&_video]:inset-0 [&_video]:size-full! [&_video]:object-cover"
              id="interactive"
              style={viewportStyle}
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <button
                aria-label={t("close")}
                className="fluid-hover flex size-11 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                onClick={handleClose}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <button
                aria-label={t("switchcamera")}
                className="fluid-hover flex size-11 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 md:hidden"
                onClick={handleCameraSwitch}
                type="button"
              >
                <SwitchCamera aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 flex justify-center p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              {cameraError ? (
                <div className="flex max-w-sm flex-col items-center gap-3 rounded-xl bg-white/10 p-5 text-center text-white backdrop-blur-sm">
                  <CameraOff aria-hidden="true" className="size-6" />
                  <p className="text-sm">{t("cameraerror")}</p>
                  <button
                    className="fluid-hover rounded-lg bg-white px-4 py-2 font-medium text-black text-sm hover:bg-white/90"
                    onClick={handleClose}
                    type="button"
                  >
                    {t("close")}
                  </button>
                </div>
              ) : (
                <p className="rounded-lg bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  {t("hint")}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
