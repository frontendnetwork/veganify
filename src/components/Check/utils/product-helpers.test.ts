import type { ProductResult } from "@/models/ProductResults";

import { getProductState } from "./product-helpers";

describe("getProductState", () => {
  describe("getTriState", () => {
    test("maps booleans and missing values to yes/no/unknown", () => {
      const testCases: [ProductResult, string][] = [
        [{ vegan: true } as ProductResult, "yes"],
        [{ vegan: false } as ProductResult, "no"],
        [{ vegan: "n/a" } as ProductResult, "unknown"],
        [{ vegan: undefined } as ProductResult, "unknown"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.vegan).toBe(expected);
      });
    });

    test("handles vegetarian states", () => {
      const testCases: [ProductResult, string][] = [
        [{ vegetarian: true } as ProductResult, "yes"],
        [{ vegetarian: false } as ProductResult, "no"],
        [{ vegetarian: "n/a" } as ProductResult, "unknown"],
        [{ vegetarian: undefined } as ProductResult, "unknown"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.vegetarian).toBe(expected);
      });
    });

    test("handles animal test free states", () => {
      const testCases: [ProductResult, string][] = [
        [{ animaltestfree: true } as ProductResult, "yes"],
        [{ animaltestfree: false } as ProductResult, "no"],
        [{ animaltestfree: "n/a" } as ProductResult, "unknown"],
        [{ animaltestfree: undefined } as ProductResult, "unknown"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.animaltestfree).toBe(expected);
      });
    });

    test("handles palm oil states", () => {
      const testCases: [ProductResult, string][] = [
        [{ palmoil: true } as ProductResult, "yes"],
        [{ palmoil: false } as ProductResult, "no"],
        [{ palmoil: "n/a" } as ProductResult, "unknown"],
        [{ palmoil: undefined } as ProductResult, "unknown"],
      ];

      testCases.forEach(([input, expected]) => {
        const result = getProductState(input);
        expect(result.palmoil).toBe(expected);
      });
    });
  });

  describe("getGrade", () => {
    test("handles valid nutriscore grades", () => {
      const testCases: [string, { grade: string }][] = [
        ["A", { grade: "a" }],
        ["B", { grade: "b" }],
        ["C", { grade: "c" }],
        ["D", { grade: "d" }],
        ["E", { grade: "e" }],
      ];

      testCases.forEach(([grade, expected]) => {
        const result = getProductState({ nutriscore: grade } as ProductResult);
        expect(result.nutriscore).toEqual(expected);
      });
    });

    test("handles case-insensitive nutriscore grades", () => {
      const input = { nutriscore: "a" } as ProductResult;
      const result = getProductState(input);
      expect(result.nutriscore).toEqual({ grade: "a" });
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
        expect(result.nutriscore).toEqual({ grade: null });
      });
    });

    test("handles general grade scores similarly to nutriscore", () => {
      const testCases: [string, { grade: string }][] = [
        ["A", { grade: "a" }],
        ["B", { grade: "b" }],
        ["C", { grade: "c" }],
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
      animaltestfree: "unknown",
      grade: { grade: "b" },
      nutriscore: { grade: "a" },
      palmoil: "unknown",
      vegan: "yes",
      vegetarian: "no",
    });
  });

  test("handles empty product data", () => {
    const input: ProductResult = {} as ProductResult;
    const result = getProductState(input);

    expect(result).toEqual({
      animaltestfree: "unknown",
      grade: { grade: null },
      nutriscore: { grade: null },
      palmoil: "unknown",
      vegan: "unknown",
      vegetarian: "unknown",
    });
  });
});
