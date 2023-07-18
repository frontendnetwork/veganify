
import VeganCheck from "@frontendnetwork/vegancheck";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

import ModalWrapper from "@/components/elements/modalwrapper";
import ShareButton from "@/components/elements/share";

import Scan from "./Scanner/scanner";

interface ProductResult {
  productname?: string;
  vegan?: string;
  vegetarian?: string;
  animaltestfree?: string;
  palmoil?: string;
  nutriscore?: string;
  grade?: string;
}

interface Sources {
  api?: string;
  baseuri?: string;
}

interface ErrorResponse {
  response: {
    status: number;
  };
}

const ProductSearch: React.FC = () => {
  const t = useTranslations("Check");
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<ProductResult>({});
  const [sources, setSources] = useState<Sources>({});
  const [barcode, setBarcode] = useState<string>("");
  const [showFound, setShowFound] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [showInvalid, setShowInvalid] = useState<boolean>(false);
  const [showTimeout, setShowTimeout] = useState<boolean>(false);
  const [showTimeoutFinal, setShowTimeoutFinal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /* EAN from URL for iOS Shortcut */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eanFromURL = params.get("ean");
    if (eanFromURL) {
      setBarcode(eanFromURL);
      handleSubmit(eanFromURL);
    }
  }, []);

  /* Submitting */
  const handleSubmit = async (barcode: string, event?: React.FormEvent) => {
    event?.preventDefault();
    setShowTimeoutFinal(false);
    setShowTimeout(false);
    setShowFound(false);
    setShowNotFound(false);
    setShowInvalid(false);
  
    setLoading(true);
    try {
      const data = await VeganCheck.getProductByBarcode(barcode);
      setLoading(false);
      if (data.status === 200) {
        setResult(data.product);
        setSources(data.sources);
        setShowFound(true);
        setShowTimeout(false);
      } else if (data.status === 404) {
        setShowNotFound(true);
        setShowTimeout(false);
      } else {
        setShowInvalid(true);
        setShowTimeout(false);
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        'status' in (error as ErrorResponse).response
      ) {
        if ((error as ErrorResponse).response.status == 400) {
          setShowInvalid(true);
          setShowTimeout(false);
        }
        else if ((error as ErrorResponse).response.status == 404) {
          setShowNotFound(true);
          setShowTimeout(false);
        }
      } else {
        console.error(error);
        setShowTimeoutFinal(true);
        setShowTimeout(false);
      }
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const productname = result.productname === "n/a" ? "?" : result.productname;
  let vegan = "unknown icon-help";
  if (result.vegan === "true") {
    vegan = "vegan icon-ok";
  } else if (result.vegan === "false") {
    vegan = "non-vegan icon-cancel";
  }

  let vegetarian = "unknown icon-help";
  if (result.vegetarian === "true") {
    vegetarian = "vegan icon-ok";
  } else if (result.vegetarian === "false") {
    vegetarian = "non-vegan icon-cancel";
  }

  let animaltestfree = "unknown icon-help";
  if (result.animaltestfree === "true") {
    animaltestfree = "vegan icon-ok";
  } else if (result.animaltestfree === "false") {
    animaltestfree = "non-vegan icon-cancel";
  }

  let palmoil = "unknown icon-help";
  if (result.palmoil === "true") {
    palmoil = "non-vegan icon-cancel";
  } else if (result.palmoil === "false") {
    palmoil = "vegan icon-ok";
  }

  let nutriscore = result.nutriscore;
  let grade = result.grade;
  const api = sources.api;
  const uri = sources.baseuri;

  if (nutriscore === "n/a") {
    nutriscore = "unknown icon-help";
  } else if (nutriscore === "a") {
    nutriscore = "nutri_a icon-a";
  } else if (nutriscore === "b") {
    nutriscore = "nutri_b icon-b";
  } else if (nutriscore === "c") {
    nutriscore = "nutri_c icon-c";
  } else if (nutriscore === "d") {
    nutriscore = "nutri_d icon-d";
  } else if (nutriscore === "e") {
    nutriscore = "nutri_e icon-e";
  }

  if (grade === "n/a") {
    grade = "unknown icon-help";
  } else if (grade === "A") {
    grade = "nutri_a icon-a";
  } else if (grade === "B") {
    grade = "nutri_b icon-b";
  } else if (grade === "C") {
    grade = "nutri_c icon-c";
  } else if (grade === "D") {
    grade = "nutri_d icon-d";
  } else if (grade === "A+") {
    grade = "nutri_a icon-a";
  } else if (grade === "Not eligible") {
    grade = "non-vegan icon-cancel";
  }

  return (
    <>
      <Image
        src="/./img/VeganCheck.svg"
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        width={48}
        height={48}
      />
      <form
        ref={formRef}
        id="eanform"
        onSubmit={(e) => handleSubmit(barcode, e)}
      >
        <legend>{t("enterbarcode")}</legend>
        <fieldset>
          <Scan
            onDetected={(barcode) => setBarcode(barcode)}
            handleSubmit={(barcode) => handleSubmit(barcode)}
          />
          <input
            type="number"
            name="barcode"
            placeholder={t("enterbarcode")}
            autoFocus={true}
            value={barcode}
            onChange={handleChange}
          />
          <button name="submit" aria-label={t("submit")} role="button">
            <span className="icon-right-open" />
          </button>
        </fieldset>
      </form>
      {showFound && (
        <>
          <div id="result">
            <div className="resultborder" id="RSFound">
              <span className="unknown">
                <span className="name" id="name_sh">
                  {productname}
                </span>
              </span>
              <span id="result_sh">
                <div className="Grid">
                  <div className="Grid-cell description">{t("vegan")}</div>
                  <div className="Grid-cell icons RSVegan">
                    <span className={vegan}></span>
                  </div>
                </div>
              </span>
              <div className="Grid">
                <div className="Grid-cell description">{t("vegetarian")}</div>
                <div className="Grid-cell icons RSVegetarian">
                  <span className={vegetarian}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                  {t("palmoil")}
                  <ModalWrapper
                    id="palmoil"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/palmoil_img.svg"
                        className="heading_img"
                        alt="Palmoil"
                        width={48}
                        height={48}
                      />
                      <h1>{t("palmoil")}</h1>
                    </span>
                    <p>{t("palmoil_desc")}</p>
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSPalmoil">
                  <span className={palmoil}></span>
                </div>
              </div>
              <div
                className="Grid Crueltyfree"
                style={
                  animaltestfree === "unknown icon-help"
                    ? { display: "none" }
                    : {}
                }
              >
                <div className="Grid-cell description">{t("crueltyfree")}</div>
                <div className="Grid-cell icons RSAnimaltestfree">
                  <span className={animaltestfree}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                  Nutriscore
                  <ModalWrapper
                    id="nutriscore"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/nutriscore_image.svg"
                        className="heading_img"
                        alt="Nutriscore"
                        width={48}
                        height={48}
                      />
                      <h1>Nutriscore</h1>
                    </span>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t("nutriscore_desc", {
                          Algorithmwatch:
                            '<a href="https://algorithmwatch.org/en/nutriscore/">Algorithmwatch</a>',
                        }),
                      }}
                    />
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSNutriscore">
                  <span className={nutriscore}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                  Grade
                  <ModalWrapper
                    id="grade"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/grade_img.svg"
                        className="heading_img"
                        alt="Grades"
                        width={48}
                        height={48}
                      />
                      <h1>Grades</h1>
                    </span>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t("grades_desc", {
                          Grades:
                            '<a href="https://grade.vegancheck.me">VeganCheck Grades</a>',
                        }),
                      }}
                    />
                    <span className="center">
                      <a href="https://grade.vegancheck.me" className="button">
                        VeganCheck Grades
                      </a>
                    </span>
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSGrade">
                  <span className={grade}></span>
                </div>
              </div>
              <span className="source">
                {t("source")}:{" "}
                <a href={uri} className="RSSource" target="_blank">
                  {api}
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
                    <a href="https://www.veganwolf.com/animal_ingredients.htm">
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
              </span>
              <ShareButton productName={productname} barcode={barcode} />
            </div>
          </div>
        </>
      )}
      {showNotFound && (
        <div id="result">
          <div className="resultborder" id="RSNotFound">
            <span>{t("notindb")}</span>
            <p className="missing" style={{ textAlign: "center" }}>
              {t("notindb_add")}{" "}
              <a
                href="https://world.openfoodfacts.org/cgi/product.pl"
                target="_blank"
              >
                {t("add_food")}
              </a>{" "}
              {t("or")}{" "}
              <a
                href="https://world.openbeautyfacts.org/cgi/product.pl"
                target="_blank"
              >
                {t("add_cosmetic")}
              </a>
              .
            </p>
          </div>
        </div>
      )}
      {showInvalid && (
        <div id="result">
          <div className="resultborder" id="RSInvalid">
            <span>{t("wrongbarcode")}</span>
          </div>
        </div>
      )}
      {showTimeout && (
        <div className="timeout animated fadeIn">
          {t("timeout1")}
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      )}
      {showTimeoutFinal && (
        <div className="timeout-final animated fadeIn">{t("timeout2")}</div>
      )}
      {loading && (
        <>
          <div id="result" className="loading_skeleton">
            <div className="animated fadeIn resultborder" id="RSFound">
              <span className="unknown">
                <span className="name skeleton">&nbsp;</span>
              </span>
              <span id="result_sh">
                <div className="Grid">
                  <div className="Grid-cell description skeleton">
                    {t("vegan")}
                  </div>
                  <div className="Grid-cell icons skeleton">
                    <span className="icon-help"></span>
                  </div>
                </div>
              </span>
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  {t("vegetarian")}
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  {t("palmoil")}
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description skeleton">Nutriscore</div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description skeleton">
                  Grade
                </div>
                <div className="Grid-cell icons skeleton">
                  <span className="icon-help"></span>
                </div>
              </div>
              <span className="source skeleton">&nbsp;</span>
              <span className="button skeleton">{t("share")}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductSearch;
