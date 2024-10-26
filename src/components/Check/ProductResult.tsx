"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import ModalWrapper from "@/components/elements/modalwrapper";
import ShareButton from "@/components/elements/share";
import { ProductResult } from "@/models/ProductResults";
import { Sources } from "@/models/Sources";

import LicenseModalContent from "../shared/LicenseModalContent";

import { ProductState } from "./models/product";
import { ResultGrid } from "./ResultGrid";

interface ProductResultProps {
  result: ProductResult;
  sources: Sources;
  productState: ProductState;
  barcode: string;
}

export function ProductResultView({
  result,
  sources,
  productState,
  barcode,
}: ProductResultProps) {
  const t = useTranslations("Check");
  const productname = result.productname === "n/a" ? "?" : result.productname;

  return (
    <div id="result">
      <div className="resultborder" id="RSFound">
        <span className="unknown">
          <span className="name" id="name_sh">
            {productname}
          </span>
        </span>

        <ResultGrid label={t("vegan")} iconClass={productState.vegan} />
        <ResultGrid
          label={t("vegetarian")}
          iconClass={productState.vegetarian}
        />

        <ResultGrid
          label={t("palmoil")}
          iconClass={productState.palmoil}
          helpModal={
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
          }
        />

        {productState.animaltestfree !== "unknown icon-help" && (
          <ResultGrid
            label={t("crueltyfree")}
            iconClass={productState.animaltestfree}
          />
        )}

        <ResultGrid
          label="Nutriscore"
          iconClass={productState.nutriscore.score}
          helpModal={
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
          }
        />

        <ResultGrid
          label="Grade"
          iconClass={productState.grade.score}
          helpModal={
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
                      '<a href="https://grade.veganify.app">Veganify Grades</a>',
                  }),
                }}
              />
              <span className="center">
                <a href="https://grade.veganify.app" className="button">
                  Veganify Grades
                </a>
              </span>
            </ModalWrapper>
          }
        />

        <span className="source">
          {t("source")}:{" "}
          <a href={sources.baseuri} className="RSSource" target="_blank">
            {sources.api}
          </a>
          <ModalWrapper
            id="license"
            buttonType="sup"
            buttonClass="help-icon"
            buttonText="?"
          >
            <LicenseModalContent />
          </ModalWrapper>
        </span>

        <ShareButton productName={productname} barcode={barcode} />
      </div>
    </div>
  );
}
