import type { ProductResult } from "@/models/ProductResults";

import type {
  GradeLetter,
  GradeState,
  ProductState,
  TriState,
} from "../models/product";

const getTriState = (value: boolean | "n/a" | undefined): TriState => {
  if (value === true) {
    return "yes";
  }
  if (value === false) {
    return "no";
  }
  return "unknown";
};

const GRADE_LETTERS: GradeLetter[] = ["a", "b", "c", "d", "e"];

const getGrade = (score: string | undefined): GradeState => {
  if (!score || score === "n/a") {
    return { grade: null };
  }

  const normalizedScore = score.toLowerCase();
  return GRADE_LETTERS.includes(normalizedScore as GradeLetter)
    ? { grade: normalizedScore as GradeLetter }
    : { grade: null };
};

export function getProductState(result: ProductResult): ProductState {
  return {
    animaltestfree: getTriState(result.animaltestfree),
    grade: getGrade(result.grade),
    nutriscore: getGrade(result.nutriscore),
    palmoil: getTriState(result.palmoil),
    vegan: getTriState(result.vegan),
    vegetarian: getTriState(result.vegetarian),
  };
}
