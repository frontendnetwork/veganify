import React, { useState, ReactNode, ElementType } from "react";

interface Props {
  id: string;
  children: ReactNode;
  buttonType: "sup" | "span" | "div";
  buttonClass: string;
  buttonText: string;
}

const Modal = ({
  id,
  children,
  buttonType,
  buttonClass,
  buttonText,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = (state: boolean) => {
    setIsOpen(state);
  };

  const ButtonComponent: ElementType = buttonType;

  return (
    <>
      <ButtonComponent
        data-target={id}
        data-toggle="modal"
        className={buttonClass}
        onClick={() => toggleModal(true)}
      >
        {buttonText}
      </ButtonComponent>
      {isOpen && (
        <div className="modal_view animated fadeInUp open">
          <div className="modal_close">
            <button
              className="btn-dark"
              data-dismiss="modal"
              onClick={() => {
                const modalView = document.querySelector(".modal_view");
                if (modalView) {
                  modalView.classList.add("fadeOutDown");
                  setTimeout(() => toggleModal(false), 500);
                }
              }}
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
