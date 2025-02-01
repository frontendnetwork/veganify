"use server";

import Veganify, { ValidationError } from "@frontendnetwork/veganify";

export async function checkIngredients(ingredients: string) {
  if (!ingredients.trim()) {
    throw new Error("Ingredients cannot be empty");
  }

  try {
    const veganify = Veganify.getInstance({
      staging: process.env.NEXT_PUBLIC_STAGING === "true",
    });

    const data = await veganify.checkIngredientsListV1(ingredients);

    return {
      vegan: data.data.vegan,
      surelyVegan: data.data.surely_vegan,
      notVegan: data.data.not_vegan,
      maybeNotVegan: data.data.maybe_not_vegan,
      unknown: data.data.unknown,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      throw new Error("Invalid ingredients format");
    }
    throw new Error("Failed to check ingredients");
  }
}
