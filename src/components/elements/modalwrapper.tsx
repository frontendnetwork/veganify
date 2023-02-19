import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  id: string;
  buttonType: string;
  buttonClass: string;
  buttonText: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalProps> = ({ children, id, buttonType, buttonClass, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRoot = typeof document !== 'undefined' ? document.getElementById("modal-root") : null;

  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touchY = event.changedTouches[0].clientY;
      document.body.addEventListener("touchmove", handleTouchMove);

      function handleTouchMove(event: TouchEvent) {
        const currentY = event.changedTouches[0].clientY;
        if (currentY > touchY) {
          closeModal();
          document.body.removeEventListener("touchmove", handleTouchMove);
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKeyPress);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    const modalView = document.querySelector(".modal_view");
    if (modalView) {
      modalView.classList.add("fadeOutDown");
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
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
                onClick={closeModal}
              >
                ×
              </a>
            </div>
            {children}
          </div>,
          modalRoot!
        )}
    </>
  );
};

export default ModalWrapper;
