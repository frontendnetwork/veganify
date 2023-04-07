import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ModalWrapper from "@/components/elements/modalwrapper";

const IngredientsCheck = () => {
  const t = useTranslations("Ingredients");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");
  const [flagged, setFlagged] = useState([]);
  const [vegan, setVegan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    setVegan("");
    setError(false);
    event.preventDefault();
    const ingredients = event.target.elements.ingredients.value;
    const url = `https://api.vegancheck.me/v0/ingredients/${ingredients}`;

    setLoading(true);
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.data.vegan);
        if (data.data.vegan === "false") {
          setVegan(false);
          setFlagged(data.data.flagged);
          setLoading(false);
        } else if (data.data.vegan === "true") {
          setVegan(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <>
      <Image
        src="/./img/VeganCheck.svg"
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

      {vegan && (
        <div id="result">
          <div className="">
            <div className="resultborder">
              <div className="Grid">
                <div className="Grid-cell description">
                  <b>{t("vegan")}</b>
                </div>
                <div className="Grid-cell icons">
                  <span className="vegan icon-ok"></span>
                </div>
              </div>
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
                <a href="http://www.veganwolf.com/animal_ingredients.htm">
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
                    &copy; VeganCheck.me Contributors and Hamed Montazeri,
                    licensed under{" "}
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
                    <a href="http://www.veganwolf.com/animal_ingredients.htm">
                      The VEGAN WOLF
                    </a>
                    .<br />
                    &copy; VeganCheck.me Contributors, sourced from ©{" "}
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
      {vegan === false && (
        <>
          <div id="result">
            <div className="">
              <div className="resultborder">
                <div className="Grid">
                  <div className="Grid-cell description">
                    <b>{t("vegan")}</b>
                  </div>
                  <div className="Grid-cell icons">
                    <span className="non-vegan icon-cancel"></span>
                  </div>
                </div>
                {flagged.map((item, index) => (
                  <div className="Grid" key={item}>
                    <div className="Grid-cell description" key={index}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </div>
                    <div className="Grid-cell icons">
                      <span className="non-vegan icon-cancel"></span>
                    </div>
                  </div>
                ))}
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
                  <a href="http://www.veganwolf.com/animal_ingredients.htm">
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
                      &copy; VeganCheck.me Contributors and Hamed Montazeri,
                      licensed under{" "}
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
                      <a href="http://www.veganwolf.com/animal_ingredients.htm">
                        The VEGAN WOLF
                      </a>
                      .<br />
                      &copy; VeganCheck.me Contributors, sourced from ©{" "}
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
        </>
      )}
      {error && (
        <div id="result">
          <span className="animated fadeIn">
            <div className="resultborder">{t("cannotbeempty")}</div>
          </span>
        </div>
      )}
      {loading && (
        <div id="result" class="loading_skeleton">
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
