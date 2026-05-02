"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  buttonClass: string;
  buttonText: string;
  buttonType: "sup" | "span" | "div";
  children: ReactNode;
  id: string;
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
    if (!isOpen) {
      return;
    }

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

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ButtonComponent
        className={buttonClass}
        data-target={id}
        data-toggle="modal"
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
