"use server";

import Veganify, {
  ValidationError,
  VeganifyError,
} from "@frontendnetwork/veganify";

import { FetchStatus } from "@/models/FetchStatus";

import type { IngredientResult } from "../models/IngredientResult";

export interface IngredientsCheckResult {
  result?: IngredientResult;
  status: FetchStatus;
}

export async function checkIngredients(
  ingredients: string
): Promise<IngredientsCheckResult> {
  if (!ingredients.trim()) {
    return { status: FetchStatus.INVALID };
  }

  try {
    const veganify = Veganify.getInstance({
      staging: process.env.NEXT_PUBLIC_STAGING === "true",
    });

    const data = await veganify.checkIngredientsListV1(ingredients);

    return {
      result: {
        maybeNotVegan: data.data.maybe_not_vegan,
        notVegan: data.data.not_vegan,
        surelyVegan: data.data.surely_vegan,
        unknown: data.data.unknown,
        vegan: data.data.vegan,
      },
      status: FetchStatus.OK,
    };
  } catch (error) {
    // Thrown errors are masked when crossing the server action boundary;
    // typed statuses let the client render the actual failure cause.
    if (error instanceof ValidationError) {
      return { status: FetchStatus.INVALID };
    }
    if (error instanceof VeganifyError && error.statusCode === 408) {
      return { status: FetchStatus.TIMEOUT };
    }
    console.error("Ingredients check failed:", error);
    return { status: FetchStatus.SERVER_ERROR };
  }
}
