"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import LicenseModalContent from "@/components/shared/LicenseModalContent";
import { Dialog } from "@/components/ui/dialog";

export function SourceInfo() {
  const t = useTranslations("Ingredients");
  const [licenseOpen, setLicenseOpen] = useState(false);
  const handleLicenseOpen = useCallback(() => setLicenseOpen(true), []);

  return (
    <div className="pt-3 text-muted text-sm">
      <p>
        {t("source")}:{" "}
        <a
          className="font-medium text-link underline-offset-2 hover:underline"
          href="https://www.veganpeace.com/ingredients/ingredients.htm"
          rel="noopener noreferrer"
          target="_blank"
        >
          VeganPeace
        </a>
        ,{" "}
        <a
          className="font-medium text-link underline-offset-2 hover:underline"
          href="https://www.peta.org/living/food/animal-ingredients-list/"
          rel="noopener noreferrer"
          target="_blank"
        >
          PETA
        </a>{" "}
        &amp;{" "}
        <a
          className="font-medium text-link underline-offset-2 hover:underline"
          href="https://www.veganwolf.com/animal_ingredients.htm"
          rel="noopener noreferrer"
          target="_blank"
        >
          The VEGAN WOLF
        </a>
      </p>
      <button
        className="fluid-hover mt-1 text-link underline-offset-2 hover:underline"
        onClick={handleLicenseOpen}
        type="button"
      >
        {t("licenses")}
      </button>
      <Dialog
        onOpenChange={setLicenseOpen}
        open={licenseOpen}
        title={t("licenses")}
      >
        <LicenseModalContent />
      </Dialog>
      <p className="mt-2 text-xs">
        {t.rich("languagewarning", {
          deepl: (chunks) => (
            <a
              className="font-medium text-link underline-offset-2 hover:underline"
              href="https://deepl.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
}
