"use server";

import Veganify from "@frontendnetwork/veganify";

export async function checkIngredients(ingredients: string) {
  if (!ingredients.trim()) {
    throw new Error("Ingredients cannot be empty");
  }

  try {
    const data = await Veganify.checkIngredientsListV1(
      ingredients,
      process.env.NEXT_PUBLIC_STAGING === "true"
    );

    return {
      vegan: data.data.vegan,
      surelyVegan: data.data.surely_vegan,
      notVegan: data.data.not_vegan,
      maybeNotVegan: data.data.maybe_not_vegan,
      unknown: data.data.unknown,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to check ingredients`);
  }
}
