import { type ElementType, type ReactNode, useCallback, useState } from "react";

interface Props {
  buttonClass: string;
  buttonText: string;
  buttonType: "sup" | "span" | "div";
  children: ReactNode;
  id: string;
}

const Modal = ({
  id,
  children,
  buttonType,
  buttonClass,
  buttonText,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    const modalView = document.querySelector(".modal_view");
    if (modalView) {
      modalView.classList.add("fadeOutDown");
      setTimeout(() => setIsOpen(false), 500);
    }
  }, []);

  const ButtonComponent: ElementType = buttonType;

  return (
    <>
      <ButtonComponent
        className={buttonClass}
        data-target={id}
        data-toggle="modal"
        onClick={openModal}
      >
        {buttonText}
      </ButtonComponent>
      {!!isOpen && (
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
        </div>
      )}
    </>
  );
};

export default Modal;
