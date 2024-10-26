"use client";

import ModalWrapper from "@/components/elements/modalwrapper";

import LicenseModalContent from "../shared/LicenseModalContent";

export function SourceInfo({
  t,
}: {
  t: (key: string, values?: Record<string, string>) => string;
}) {
  return (
    <span className="source">
      {t("source")}:{" "}
      <a href="https://www.veganpeace.com/ingredients/ingredients.htm">
        VeganPeace
      </a>
      ,{" "}
      <a href="https://www.peta.org/living/food/animal-ingredients-list/">
        PETA
      </a>{" "}
      &amp;{" "}
      <a href="https://www.veganwolf.com/animal_ingredients.htm">
        The VEGAN WOLF
      </a>
      <ModalWrapper
        id="license"
        buttonType="sup"
        buttonClass="help-icon"
        buttonText="?"
      >
        <LicenseModalContent />
      </ModalWrapper>
      <br />
      <span
        dangerouslySetInnerHTML={{
          __html: t("languagewarning", {
            deepl: '<a href="https://deepl.com">DeepL</a>',
          }),
        }}
      />
    </span>
  );
}
