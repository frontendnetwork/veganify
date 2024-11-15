"use client";

import Quagga from "@ericblade/quagga2";
import { CSSProperties, useEffect, useState } from "react";

import { ScannerProps } from "./models/scanner";

export function ViewportScanner({ onDetected, setScanning }: ScannerProps) {
  const [facingMode, setFacingMode] = useState("user");
  const [isHidden, setIsHidden] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  const initializeScanner = (newFacingMode: string) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            aspectRatio: { ideal: height / width },
            facingMode: newFacingMode,
            height: { min: 480, ideal: height, max: 1080 },
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            "ean_reader",
            "code_39_reader",
            "code_128_reader",
            "i2of5_reader",
          ],
        },
        locate: true,
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

  const handleCameraSwitch = () => {
    const newFacingMode = facingMode === "environment" ? "user" : "environment";
    const newIsMirrored = newFacingMode === "user";

    setFacingMode(newFacingMode);
    setIsMirrored(newIsMirrored);

    Quagga.stop();
    initializeScanner(newFacingMode);
  };

  const handleClose = () => {
    setIsHidden(true);
    setScanning(false);
    Quagga.stop();
  };

  useEffect(() => {
    initializeScanner(facingMode);
    Quagga.onDetected(onDetected);

    return () => {
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
    // We disable this here, since we only want to run this effect once
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isHidden) return null;

  const viewportStyle: CSSProperties = {
    position: "fixed",
    zIndex: 999,
    left: "50%",
    top: 0,
    transform: isMirrored ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)",
  };

  const backdropStyle: CSSProperties = {
    position: "fixed",
    zIndex: 998,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(0.5rem)",
    WebkitBackdropFilter: "blur(0.5rem)",
  };

  return (
    <>
      <div style={backdropStyle} />
      <div id="controls">
        <span id="close">
          <div className="flex-container">
            <div className="flex-item">
              <span
                id="closebtn"
                className="icon-left-open"
                onClick={handleClose}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClose();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Close scanner"
              />
            </div>
            <div className="flex-item">
              <span
                id="switch-camera"
                className="icon-flipcamera"
                onClick={handleCameraSwitch}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCameraSwitch();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Switch camera"
              />
            </div>
          </div>
        </span>
      </div>
      <div id="interactive" className="viewport" style={viewportStyle} />
    </>
  );
}
