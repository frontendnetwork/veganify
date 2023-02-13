import React, { Component, useState } from "react";
import Quagga from "quagga";

class Scanner extends Component {
  state = {
    facingMode: "environment",
  };

  handleClick = () => {
    if (this.state.facingMode === "environment") {
      this.setState({ facingMode: "user" });
    } else {
      this.setState({ facingMode: "environment" });
    }

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            aspectRatio: { ideal: window.innerHeight / window.innerWidth },
            facingMode: this.state.facingMode,
            focusMode: "continuous",
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
      function (err) {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
  };

  componentDidMount = () => {
    console.log(this.state.facingMode);
    this.handleClick();
    Quagga.onDetected(this._onDetected);
  };

  componentWillUnmount = () => {
    Quagga.offDetected(this._onDetected);
  };

  _onDetected = (result) => {
    this.props.onDetected(result);
    Quagga.stop();
  };

  state = {
    isHidden: false,
  };

  _onClose = () => {
    this.setState({
      isHidden: !this.state.isHidden,
    });
    this.props.setScanning(false);
    Quagga.stop();
  };

  render() {
    const vid = {
      position: "fixed",
      zIndex: "999",
      left: "0px",
      top: "0px",
    };

    return (
      !this.state.isHidden && (
        <>
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

class Result extends Component {
  render() {
    const result = this.props.result;

    if (!result) {
      return null;
    }
    return result.codeResult.code;
  }
}

class Scan extends React.Component {
  state = {
    scanning: false,
    results: [],
    codeResult: "",
  };

  _scan = () => {
    this.setState({ scanning: true });
  };

  _onDetected = (result) => {
    this.setState({
      results: this.state.results.concat([result]),
      codeResult: result.codeResult.code,
    });
    this.setState({ scanning: !this.state.scanning });
    let barcode = result.codeResult.code;
    this.props.onDetected(barcode);
    Quagga.stop();
    this.props.handleSubmit(barcode, {});
  };

  render() {
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
        {this.state.scanning ? (
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
