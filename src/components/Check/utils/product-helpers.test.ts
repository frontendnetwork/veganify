import type { ProductResult } from "@/models/ProductResults";

import { getProductState } from "./product-helpers";

describe("getProductState", () => {
  describe("getVeganState", () => {
    test("returns correct classes for vegan states", () => {
      const testCases: [ProductResult, string][] = [
        [{ vegan: true } as ProductResult, "vegan icon-ok"],
        [{ vegan: false } as ProductResult, "non-vegan icon-cancel"],
        [{ vegan: "n/a" } as ProductResult, "unknown icon-help"],
        [{ vegan: undefined } as ProductResult, "unknown icon-help"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.vegan).toBe(expected);
      });
    });

    test("handles vegetarian states", () => {
      const testCases: [ProductResult, string][] = [
        [{ vegetarian: true } as ProductResult, "vegan icon-ok"],
        [{ vegetarian: false } as ProductResult, "non-vegan icon-cancel"],
        [{ vegetarian: "n/a" } as ProductResult, "unknown icon-help"],
        [{ vegetarian: undefined } as ProductResult, "unknown icon-help"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.vegetarian).toBe(expected);
      });
    });

    test("handles animal test free states", () => {
      const testCases: [ProductResult, string][] = [
        [{ animaltestfree: true } as ProductResult, "vegan icon-ok"],
        [{ animaltestfree: false } as ProductResult, "non-vegan icon-cancel"],
        [{ animaltestfree: "n/a" } as ProductResult, "unknown icon-help"],
        [{ animaltestfree: undefined } as ProductResult, "unknown icon-help"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.animaltestfree).toBe(expected);
      });
    });

    test("handles palm oil states", () => {
      const testCases: [ProductResult, string][] = [
        [{ palmoil: true } as ProductResult, "vegan icon-ok"],
        [{ palmoil: false } as ProductResult, "non-vegan icon-cancel"],
        [{ palmoil: "n/a" } as ProductResult, "unknown icon-help"],
        [{ palmoil: undefined } as ProductResult, "unknown icon-help"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.palmoil).toBe(expected);
      });
    });
  });

  describe("getNutriscoreClass", () => {
    test("handles valid nutriscore grades", () => {
      const testCases: [string, { score: string; className: string }][] = [
        ["A", { className: "nutri_a", score: "nutri_a icon-a" }],
        ["B", { className: "nutri_b", score: "nutri_b icon-b" }],
        ["C", { className: "nutri_c", score: "nutri_c icon-c" }],
        ["D", { className: "nutri_d", score: "nutri_d icon-d" }],
        ["E", { className: "nutri_e", score: "nutri_e icon-e" }],
      ];

      testCases.forEach(([grade, expected]) => {
        const result = getProductState({ nutriscore: grade } as ProductResult);
        expect(result.nutriscore).toEqual(expected);
      });
    });

    test("handles case-insensitive nutriscore grades", () => {
      const input = { nutriscore: "a" } as ProductResult;
      const result = getProductState(input);
      expect(result.nutriscore).toEqual({
        className: "nutri_a",
        score: "nutri_a icon-a",
      });
    });

    test("handles invalid nutriscore grades", () => {
      const testCases: (string | undefined)[] = [
        "F",
        "X",
        "123",
        "n/a",
        undefined,
      ];

      testCases.forEach((grade) => {
        const result = getProductState({ nutriscore: grade } as ProductResult);
        expect(result.nutriscore).toEqual({
          className: "",
          score: "unknown icon-help",
        });
      });
    });

    test("handles general grade scores similarly to nutriscore", () => {
      const testCases: [string, { score: string; className: string }][] = [
        ["A", { className: "nutri_a", score: "nutri_a icon-a" }],
        ["B", { className: "nutri_b", score: "nutri_b icon-b" }],
        ["C", { className: "nutri_c", score: "nutri_c icon-c" }],
      ];

      testCases.forEach(([grade, expected]) => {
        const result = getProductState({ grade } as ProductResult);
        expect(result.grade).toEqual(expected);
      });
    });
  });

  test("handles complete product data", () => {
    const input: ProductResult = {
      animaltestfree: "n/a",
      grade: "B",
      nutriscore: "A",
      palmoil: undefined,
      productname: "Foo Chocolate Bar",
      vegan: true,
      vegetarian: false,
    };

    const result = getProductState(input);

    expect(result).toEqual({
      animaltestfree: "unknown icon-help",
      grade: { className: "nutri_b", score: "nutri_b icon-b" },
      nutriscore: { className: "nutri_a", score: "nutri_a icon-a" },
      palmoil: "unknown icon-help",
      vegan: "vegan icon-ok",
      vegetarian: "non-vegan icon-cancel",
    });
  });

  test("handles empty product data", () => {
    const input = {} as ProductResult;
    const result = getProductState(input);

    expect(result).toEqual({
      animaltestfree: "unknown icon-help",
      grade: { className: "", score: "unknown icon-help" },
      nutriscore: { className: "", score: "unknown icon-help" },
      palmoil: "unknown icon-help",
      vegan: "unknown icon-help",
      vegetarian: "unknown icon-help",
    });
  });
});
