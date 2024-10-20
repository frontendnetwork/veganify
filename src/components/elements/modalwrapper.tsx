import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
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

  const modalRoot = useMemo(() => {
    return typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;
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
  }, [closeModal]);

  const ButtonComponent = buttonType;

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
        modalRoot &&
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
          modalRoot
        )}
    </>
  );
};

export default ModalWrapper;
