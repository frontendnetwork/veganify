import React, { useState } from "react";
import { createPortal } from "react-dom";

const ModalWrapper = ({ children, id, buttonType, buttonClass, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRoot = typeof document !== 'undefined' ? document.getElementById("modal-root") : null;

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {buttonType === "sup" && (
        <sup
          data-target={id}
          data-toggle="modal"
          className={buttonClass}
          onClick={openModal}
        >
          {buttonText}
        </sup>
      )}
      {buttonType === "span" && (
        <span
          data-target={id}
          data-toggle="modal"
          className={buttonClass}
          onClick={openModal}
        >
          {buttonText}
        </span>
      )}
      {buttonType === "div" && (
        <div
          data-target={id}
          data-toggle="modal"
          className={buttonClass}
          onClick={openModal}
        >
          {buttonText}
        </div>
      )}
      {isOpen &&
        createPortal(
          <div className="modal_view animated fadeInUp open">
            <div className="modal_close">
              <a
                className="btn-dark"
                data-dismiss="modal"
                onClick={() => {
                  document.querySelector(".modal_view").classList.add("fadeOutDown");
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 500);
                }}
              >
                ×
              </a>
            </div>
            {children}
          </div>,
          modalRoot
        )}
    </>
  );
};

export default ModalWrapper;
