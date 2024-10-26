export interface ProductResult {
  productname: string;
  vegan: boolean | "n/a" | undefined;
  vegetarian: boolean | "n/a" | undefined;
  animaltestfree: boolean | "n/a" | undefined;
  palmoil: boolean | "n/a" | undefined;
  nutriscore?: string;
  grade?: string;
}
