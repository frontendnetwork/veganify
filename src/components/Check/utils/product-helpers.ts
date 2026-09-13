import type { ProductResult } from "@/models/ProductResults";

import type { NutriscoreGrade, ProductState } from "../models/product";

export function getProductState(result: ProductResult): ProductState {
  const getVeganState = (value: boolean | "n/a" | undefined): string => {
    if (value === true) {
      return "vegan icon-ok";
    }
    if (value === false) {
      return "non-vegan icon-cancel";
    }
    return "unknown icon-help";
  };

  const getNutriscoreClass = (score: string | undefined): NutriscoreGrade => {
    if (!score || score === "n/a") {
      return { className: "", score: "unknown icon-help" };
    }

    const normalizedScore = score.toLowerCase();
    if (["a", "b", "c", "d", "e"].includes(normalizedScore)) {
      return {
        className: `nutri_${normalizedScore}`,
        score: `nutri_${normalizedScore} icon-${normalizedScore}`,
      };
    }
    return { className: "", score: "unknown icon-help" };
  };

  return {
    animaltestfree: getVeganState(result.animaltestfree),
    grade: getNutriscoreClass(result.grade),
    nutriscore: getNutriscoreClass(result.nutriscore),
    palmoil: getVeganState(result.palmoil),
    vegan: getVeganState(result.vegan),
    vegetarian: getVeganState(result.vegetarian),
  };
}
