import Veganify from "@frontendnetwork/veganify";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState, FormEvent } from "react";

import ModalWrapper from "@/components/elements/modalwrapper";

const IngredientsCheck = () => {
  const t = useTranslations("Ingredients");
  const [surelyVegan, setSurelyVegan] = useState<string[]>([]);
  const [notVegan, setNotVegan] = useState<string[]>([]);
  const [maybeVegan, setMaybeVegan] = useState<string[]>([]);
  const [vegan, setVegan] = useState<boolean | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setVegan(null);
    setSurelyVegan([]);
    setNotVegan([]);
    setMaybeVegan([]);
    setError(false);
    event.preventDefault();
    const ingredients = event.currentTarget.elements.namedItem(
      "ingredients"
    ) as HTMLInputElement;

    const checkIngredients = async () => {
      setLoading(true);
      try {
        const data = await Veganify.checkIngredientsList(
          ingredients.value,
          process.env.NEXT_PUBLIC_STAGING === "true" ? true : false
        );
        setVegan(data.data.vegan);
        setSurelyVegan(data.data.surely_vegan);
        setNotVegan(data.data.not_vegan);
        setMaybeVegan(data.data.maybe_vegan);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    checkIngredients();
  };

  return (
    <>
      <Image
        src="/./img/Veganify.svg"
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        width={48}
        height={48}
      />
      <h2 style={{ textAlign: "center", marginTop: "0" }}>
        {t("ingredientcheck")}
      </h2>
      <p style={{ textAlign: "center" }}>{t("ingredientcheck_desc")}</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("entercommaseperated")}</legend>
          <textarea
            id="ingredients"
            name="ingredients"
            placeholder={t("entercommaseperated")}
          />
          <button
            name="checkingredients"
            aria-label={t("submit")}
            role="button"
          >
            <span className="icon-right-open"></span>
          </button>
        </fieldset>
      </form>

      {vegan !== null && (
        <div id="result">
          <div className="">
            <div className="resultborder">
              <div className="Grid">
                <div className="Grid-cell description">
                  <b>{t("vegan")}</b>
                </div>
                <div className="Grid-cell icons">
                  <span
                    className={
                      vegan ? "vegan icon-ok" : "non-vegan icon-cancel"
                    }
                  ></span>
                </div>
              </div>
              {notVegan.length > 0 && (
                <>
                  {notVegan.map((item) => (
                    <div className="Grid" key={item}>
                      <div className="Grid-cell description">
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                      <div className="Grid-cell icons">
                        <span className="non-vegan icon-cancel"></span>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {maybeVegan.length > 0 && (
                <>
                  {maybeVegan.map((item) => (
                    <div className="Grid" key={item}>
                      <div className="Grid-cell description">
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                      <div className="Grid-cell icons">
                        <span className="maybe-vegan icon-help"></span>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {surelyVegan.length > 0 && (
                <>
                  {surelyVegan.map((item) => (
                    <div className="Grid" key={item}>
                      <div className="Grid-cell description">
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                      <div className="Grid-cell icons">
                        <span className="vegan icon-ok"></span>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <span className="source">
                {t("source")}:{" "}
                <a href="https://www.veganpeace.com/ingredients/ingredients.htm">
                  VeganPeace
                </a>{" "}
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
                    <a href="https://www.gnu.org/licenses/fdl-1.3.html">
                      GNU FDL
                    </a>
                    .<br />
                    &copy; Veganify Contributors and Hamed Montazeri, licensed
                    under{" "}
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
                    <a href="https://crueltyfree.peta.org">
                      PETA (Beauty without Bunnies)
                    </a>
                    .
                  </p>
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
            </div>
          </div>
        </div>
      )}
      {error && (
        <div id="result">
          <span className="animated fadeIn">
            <div className="resultborder">{t("cannotbeempty")}</div>
          </span>
        </div>
      )}
      {loading && (
        <div id="result" className="loading_skeleton">
          <div className="animated fadeIn">
            <div className="resultborder">
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  <b>{t("vegan")}</b>
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
                </div>
              </div>
              <span className="source skeleton">&nbsp;</span>
              <span className="source skeleton">&nbsp;</span>
              <span className="source skeleton">&nbsp;</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientsCheck;
