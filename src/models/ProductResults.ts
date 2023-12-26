export type ProductResult = {
  productname: string;
  vegan: boolean | "n/a" | undefined;
  vegetarian: boolean | "n/a" | undefined;
  animaltestfree: boolean | string | undefined;
  palmoil: boolean | "n/a" | undefined;
  nutriscore?: string;
  grade?: string;
};
