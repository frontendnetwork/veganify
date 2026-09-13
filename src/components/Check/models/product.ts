export type TriState = "yes" | "no" | "unknown";

export type GradeLetter = "a" | "b" | "c" | "d" | "e";

export interface GradeState {
  grade: GradeLetter | null;
}

export interface ProductState {
  animaltestfree: TriState;
  grade: GradeState;
  nutriscore: GradeState;
  palmoil: TriState;
  vegan: TriState;
  vegetarian: TriState;
}
