"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  id: string;
  buttonType: "sup" | "span" | "div";
  buttonClass: string;
  buttonText: string;
  children: ReactNode;
}

const ModalWrapper = ({
  children,
  id,
  buttonType,
  buttonClass,
  buttonText,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    modalRootRef.current = document.getElementById("modal-root");
    return () => setMounted(false);
  }, []);

  const closeModal = useCallback(() => {
    const modalView = document.querySelector(".modal_view");
    if (modalView) {
      modalView.classList.add("fadeOutDown");
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touchStartY = event.touches[0].clientY;

      const handleTouchEnd = (event: TouchEvent) => {
        const touchEndY = event.changedTouches[0].clientY;
        if (touchEndY - touchStartY > 10) {
          closeModal();
        }
        document.body.removeEventListener("touchend", handleTouchEnd);
      };

      document.body.addEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("keydown", handleEscapeKeyPress);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isOpen, closeModal]);

  const ButtonComponent = buttonType;

  if (!mounted) return null;

  return (
    <>
      <ButtonComponent
        data-target={id}
        data-toggle="modal"
        className={buttonClass}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </ButtonComponent>
      {isOpen &&
        modalRootRef.current &&
        createPortal(
          <div className="modal_view animated fadeInUp open">
            <div className="modal_close">
              <button
                className="btn-dark"
                data-dismiss="modal"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            {children}
          </div>,
          modalRootRef.current
        )}
    </>
  );
};

export default ModalWrapper;
