export interface NutriscoreGrade {
  score: string;
  className: string;
}

export interface ProductState {
  vegan: string;
  vegetarian: string;
  animaltestfree: string;
  palmoil: string;
  nutriscore: NutriscoreGrade;
  grade: NutriscoreGrade;
}
