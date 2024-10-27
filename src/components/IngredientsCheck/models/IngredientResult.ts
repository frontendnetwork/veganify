export interface IngredientResult {
  vegan: boolean | null;
  surelyVegan: string[];
  notVegan: string[];
  maybeNotVegan: string[];
  unknown: string[];
}
