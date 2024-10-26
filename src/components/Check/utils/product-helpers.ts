import { ProductResult } from "@/models/ProductResults";

import { NutriscoreGrade, ProductState } from "../models/product";

export function getProductState(result: ProductResult): ProductState {
  const getVeganState = (value: boolean | "n/a" | undefined): string => {
    if (value === true) return "vegan icon-ok";
    if (value === false) return "non-vegan icon-cancel";
    return "unknown icon-help";
  };

  const getNutriscoreClass = (score: string | undefined): NutriscoreGrade => {
    if (!score || score === "n/a")
      return { score: "unknown icon-help", className: "" };

    const normalizedScore = score.toLowerCase();
    if (["a", "b", "c", "d", "e"].includes(normalizedScore)) {
      return {
        score: `nutri_${normalizedScore} icon-${normalizedScore}`,
        className: `nutri_${normalizedScore}`,
      };
    }
    return { score: "unknown icon-help", className: "" };
  };

  return {
    vegan: getVeganState(result.vegan),
    vegetarian: getVeganState(result.vegetarian),
    animaltestfree: getVeganState(result.animaltestfree),
    palmoil: getVeganState(result.palmoil),
    nutriscore: getNutriscoreClass(result.nutriscore),
    grade: getNutriscoreClass(result.grade),
  };
}
