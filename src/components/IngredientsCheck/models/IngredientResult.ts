export interface IngredientResult {
  maybeNotVegan: string[];
  notVegan: string[];
  surelyVegan: string[];
  unknown: string[];
  vegan: boolean | null;
}
