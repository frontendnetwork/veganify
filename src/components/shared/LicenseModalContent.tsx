import Image from "next/image";
import { useTranslations } from "next-intl";

const LicenseModalContent = () => {
  const t = useTranslations("Check");

  return (
    <>
      <span className="center">
        <Image
          src="../img/license_img.svg"
          className="heading_img"
          alt="Licenses"
          width={48}
          height={48}
        />
        <h1>{t("licenses")}</h1>
      </span>
      <p>{t("licenses_desc")}</p>
      <p>
        &copy; OpenFoodFacts Contributors, licensed under{" "}
        <a href="https://opendatacommons.org/licenses/odbl/1.0/">
          Open Database License
        </a>{" "}
        and{" "}
        <a href="https://opendatacommons.org/licenses/dbcl/1.0/">
          Database Contents License
        </a>
        .<br />
        &copy; Open EAN/GTIN Database Contributors, licensed under{" "}
        <a href="https://www.gnu.org/licenses/fdl-1.3.html">GNU FDL</a>
        .<br />
        &copy; Veganify Contributors and Hamed Montazeri, licensed under{" "}
        <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">
          MIT License
        </a>
        , sourced from{" "}
        <a href="https://www.veganpeace.com/ingredients/ingredients.htm">
          VeganPeace
        </a>
        ,{" "}
        <a href="https://www.peta.org/living/food/animal-ingredients-list/">
          PETA
        </a>{" "}
        and{" "}
        <a href="https://www.veganwolf.com/animal_ingredients.htm">
          The VEGAN WOLF
        </a>
        .<br />
        &copy; Veganify Contributors, sourced from ©{" "}
        <a href="https://crueltyfree.peta.org">PETA (Beauty without Bunnies)</a>
        .
      </p>
    </>
  );
};

export default LicenseModalContent;
