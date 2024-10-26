"use server";
"use cache";

import Veganify from "@frontendnetwork/veganify";

export async function checkIngredients(ingredients: string) {
  if (!ingredients.trim()) {
    throw new Error("Ingredients cannot be empty");
  }

  try {
    const data = await Veganify.checkIngredientsList(
      ingredients,
      process.env.NEXT_PUBLIC_STAGING === "true"
    );

    return {
      vegan: data.data.vegan,
      surelyVegan: data.data.surely_vegan,
      notVegan: data.data.not_vegan,
      maybeVegan: data.data.maybe_vegan,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to check ingredients`);
  }
}
