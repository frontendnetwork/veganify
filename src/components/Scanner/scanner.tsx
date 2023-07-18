/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from "react";
import Quagga from "@ericblade/quagga2";
interface ScannerProps {
  onDetected: (result: any) => void;
  setScanning: (scanning: boolean) => void;
}

interface ScannerState {
  facingMode: string;
  isHidden: boolean;
  isMirrored: boolean;
}

class Scanner extends Component<ScannerProps, ScannerState> {
  state: ScannerState = {
    facingMode: "user",
    isHidden: false,
    isMirrored: true,
  };

  handleClick = () => {
    const { facingMode } = this.state;
    const newFacingMode = facingMode === "environment" ? "user" : "environment";
    const isMirrored = newFacingMode === "user";
    this.setState({ facingMode: newFacingMode, isMirrored });

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
      (err: any) => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
  };

  componentDidMount() {
    const { facingMode } = this.state;
    console.log(facingMode);
    this.handleClick();
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
  }

  _onDetected = (result: any) => {
    const { onDetected } = this.props;
    onDetected(result);
    Quagga.stop();
  };

  _onClose = () => {
    const { isHidden } = this.state;
    this.setState({ isHidden: !isHidden });
    const { setScanning } = this.props;
    setScanning(false);
    Quagga.stop();
  };

  render() {
    const { isHidden, isMirrored } = this.state;

    const vid: React.CSSProperties = {
      position: "fixed",
      zIndex: 999,
      left: "50%",
      top: 0,
      transform: isMirrored ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)",
    };

    const backdrop: React.CSSProperties = {
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
      !isHidden && (
        <>
          <div style={backdrop}></div>
          <div id="controls">
            <span id="close">
              <div className="flex-container">
                <div className="flex-item">
                  <span
                    id="closebtn"
                    className="icon-left-open"
                    onClick={this._onClose}
                  ></span>
                </div>

                <div className="flex-item">
                  <span
                    id="switch-camera"
                    className="icon-flipcamera"
                    onClick={this.handleClick}
                  ></span>
                </div>
              </div>
            </span>
          </div>
          <div id="interactive" className="viewport" style={vid}></div>
        </>
      )
    );
  }
}

interface ResultProps {
  result: any;
}

class Result extends Component<ResultProps> {
  render() {
    const { result } = this.props;
    if (!result) {
      return null;
    }
    return result.codeResult.code;
  }
}

interface ScanProps {
  onDetected: (barcode: string) => void;
  handleSubmit: (barcode: string, obj: object) => void;
}

interface ScanState {
  scanning: boolean;
  results: any[];
  codeResult: string;
}

class Scan extends React.Component<ScanProps, ScanState> {
  state: ScanState = {
    scanning: false,
    results: [],
    codeResult: "",
  };

  _scan = () => {
    this.setState({ scanning: true });
  };

  _onDetected = (result: any) => {
    const { onDetected, handleSubmit } = this.props;
    const { results } = this.state;
    const newResults = [...results, result];
    const codeResult = result.codeResult.code;
    this.setState({ results: newResults, codeResult, scanning: false });
    onDetected(codeResult);
    Quagga.stop();
    handleSubmit(codeResult, {});
  };

  render() {
    const { scanning } = this.state;
    return (
      <>
        <button
          type="button"
          aria-label="Barcode scannen"
          role="button"
          tabIndex={0}
          onClick={this._scan}
        >
          <span className="icon-barcode" />
        </button>
        {scanning ? (
          <Scanner
            onDetected={this._onDetected}
            setScanning={(scanning) => this.setState({ scanning })}
          />
        ) : null}
      </>
    );
  }
}

export default Scan;
