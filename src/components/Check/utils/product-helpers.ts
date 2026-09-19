import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";

import type {
  GradeLetter,
  GradeState,
  ProductState,
  TriState,
} from "../models/product";

export interface RawProduct {
  animaltestfree?: boolean | "n/a";
  grade?: string;
  nutriscore?: string;
  palmoil?: boolean | "n/a";
  productname: string;
  vegan?: boolean | "n/a";
  vegetarian?: boolean | "n/a";
}

export interface RawSources {
  api?: string;
  baseuri?: string;
}

export function normalizeProduct(rawProduct: RawProduct): ProductResult {
  return {
    animaltestfree: rawProduct.animaltestfree ?? "n/a",
    grade: rawProduct.grade ?? "",
    nutriscore: rawProduct.nutriscore ?? "",
    palmoil: rawProduct.palmoil ?? "n/a",
    productname: rawProduct.productname,
    vegan: rawProduct.vegan ?? "n/a",
    vegetarian: rawProduct.vegetarian ?? "n/a",
  };
}

export function normalizeSources(rawSources: RawSources): Sources {
  return {
    api: rawSources.api,
    baseuri: rawSources.baseuri,
  };
}

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
