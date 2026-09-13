import { useTranslations } from "next-intl";

const LicenseModalContent = () => {
  const t = useTranslations("Check");

  return (
    <div className="space-y-3 text-muted text-sm">
      <p>{t("licenses_desc")}</p>
      <p className="space-y-2">
        <span className="block">
          © OpenFoodFacts Contributors, licensed under{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://opendatacommons.org/licenses/odbl/1.0/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open Database License
          </a>{" "}
          and{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://opendatacommons.org/licenses/dbcl/1.0/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Database Contents License
          </a>
          .
        </span>
        <span className="block">
          © Open EAN/GTIN Database Contributors, licensed under{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://www.gnu.org/licenses/fdl-1.3.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            GNU FDL
          </a>
          .
        </span>
        <span className="block">
          © Veganify Contributors and Hamed Montazeri, licensed under{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE"
            rel="noopener noreferrer"
            target="_blank"
          >
            MIT License
          </a>
          , sourced from{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://www.veganpeace.com/ingredients/ingredients.htm"
            rel="noopener noreferrer"
            target="_blank"
          >
            VeganPeace
          </a>
          ,{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://www.peta.org/living/food/animal-ingredients-list/"
            rel="noopener noreferrer"
            target="_blank"
          >
            PETA
          </a>{" "}
          and{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://www.veganwolf.com/animal_ingredients.htm"
            rel="noopener noreferrer"
            target="_blank"
          >
            The VEGAN WOLF
          </a>
          .
        </span>
        <span className="block">
          © Veganify Contributors, sourced from ©{" "}
          <a
            className="text-link underline-offset-2 hover:underline"
            href="https://crueltyfree.peta.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            PETA (Beauty without Bunnies)
          </a>
          .
        </span>
      </p>
    </div>
  );
};

export default LicenseModalContent;
