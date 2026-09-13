"use client";

import Quagga from "@ericblade/quagga2";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import type { ScannerProps } from "./models/scanner";

export function ViewportScanner({ onDetected, setScanning }: ScannerProps) {
  const [facingMode, setFacingMode] = useState("user");
  const [isHidden, setIsHidden] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  const initializeScanner = (newFacingMode: string) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

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
            aspectRatio: { ideal: height / width },
            facingMode: newFacingMode,
            height: { ideal: height, max: 1080, min: 480 },
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
          return;
        }
        Quagga.start();
      }
    );
  };

  const handleCameraSwitch = useCallback(() => {
    const newFacingMode = facingMode === "environment" ? "user" : "environment";
    const newIsMirrored = newFacingMode === "user";

    setFacingMode(newFacingMode);
    setIsMirrored(newIsMirrored);

    Quagga.stop();
    initializeScanner(newFacingMode);
  }, [facingMode]);

  const handleClose = useCallback(() => {
    setIsHidden(true);
    setScanning(false);
    Quagga.stop();
  }, [setScanning]);

  const handleCloseKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleCameraSwitchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        handleCameraSwitch();
      }
    },
    [handleCameraSwitch]
  );

  useEffect(() => {
    initializeScanner(facingMode);
    Quagga.onDetected(onDetected);

    return () => {
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
  }, []);

  if (isHidden) {
    return null;
  }

  const viewportStyle: CSSProperties = {
    left: "50%",
    position: "fixed",
    top: 0,
    transform: isMirrored ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)",
    zIndex: 999,
  };

  const backdropStyle: CSSProperties = {
    backdropFilter: "blur(0.5rem)",
    background: "rgba(0, 0, 0, 0.2)",
    height: "100%",
    left: 0,
    position: "fixed",
    top: 0,
    WebkitBackdropFilter: "blur(0.5rem)",
    width: "100%",
    zIndex: 998,
  };

  return (
    <>
      <div style={backdropStyle} />
      <div id="controls">
        <span id="close">
          <div className="flex-container">
            <div className="flex-item">
              <span
                aria-label="Close scanner"
                className="icon-left-open"
                id="closebtn"
                onClick={handleClose}
                onKeyDown={handleCloseKeyDown}
                role="button"
                tabIndex={0}
              />
            </div>
            <div className="flex-item">
              <span
                aria-label="Switch camera"
                className="icon-flipcamera"
                id="switch-camera"
                onClick={handleCameraSwitch}
                onKeyDown={handleCameraSwitchKeyDown}
                role="button"
                tabIndex={0}
              />
            </div>
          </div>
        </span>
      </div>
      <div className="viewport" id="interactive" style={viewportStyle} />
    </>
  );
}
