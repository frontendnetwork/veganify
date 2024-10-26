import { preprocessIngredients } from "./preprocessIngredients";

describe("preprocessIngredients", () => {
  describe("percentage handling", () => {
    test("removes simple percentages", () => {
      expect(preprocessIngredients("water 80%, salt 20%")).toEqual([
        "water",
        "salt",
      ]);
    });

    test("removes decimal percentages", () => {
      expect(preprocessIngredients("water 80.5%, salt 19.5%")).toEqual([
        "water",
        "salt",
      ]);
    });
  });

  describe("separator handling", () => {
    test("splits by comma", () => {
      expect(preprocessIngredients("water,salt,sugar")).toEqual([
        "water",
        "salt",
        "sugar",
      ]);
    });

    test("converts colons to commas", () => {
      expect(preprocessIngredients("water:salt:sugar")).toEqual([
        "water",
        "salt",
        "sugar",
      ]);
    });

    test("handles mixed separators", () => {
      expect(preprocessIngredients("water:salt,sugar:pepper")).toEqual([
        "water",
        "salt",
        "sugar",
        "pepper",
      ]);
    });
  });

  describe("whitespace handling", () => {
    test("trims whitespace", () => {
      expect(preprocessIngredients(" water , salt , sugar ")).toEqual([
        "water",
        "salt",
        "sugar",
      ]);
    });

    test("preserves multiple spaces within ingredients", () => {
      expect(preprocessIngredients("water    salt,   sugar")).toEqual([
        "water    salt",
        "sugar",
      ]);
    });
  });

  describe("parentheses handling", () => {
    test("combines parenthetical content", () => {
      expect(preprocessIngredients("water (filtered)")).toEqual([
        "water filtered",
      ]);
    });

    test("combines multiple parenthetical contents", () => {
      expect(preprocessIngredients("water (filtered) (purified)")).toEqual([
        "water filtered purified",
      ]);
    });

    test("handles nested parentheses", () => {
      expect(preprocessIngredients("salt (sea salt (iodized))")).toEqual([
        "salt sea salt iodized",
      ]);
    });
  });

  describe("number handling", () => {
    test("preserves vitamin numbers", () => {
      expect(preprocessIngredients("vitamin b12, vitamin d3")).toEqual([
        "vitamin b12",
        "vitamin d3",
      ]);
    });

    test("preserves E-numbers", () => {
      expect(preprocessIngredients("e150a, e627")).toEqual(["e150a", "e627"]);
    });
  });

  describe("deduplication", () => {
    test("removes exact duplicates", () => {
      expect(preprocessIngredients("water, water, salt, salt")).toEqual([
        "water",
        "salt",
      ]);
    });

    test("removes substring duplicates", () => {
      expect(preprocessIngredients("coconut milk, coconut")).toEqual([
        "coconut milk",
      ]);
    });
  });

  describe("complex real-world cases", () => {
    test("handles complex ingredient list", () => {
      const input =
        "Water (75%), Coconut Milk (15.5%), Sugar (raw) 5%, Salt (sea) 4.5%: Natural Flavoring";
      expect(preprocessIngredients(input)).toEqual([
        "Water",
        "Coconut Milk",
        "Sugar raw",
        "Salt sea",
        "Natural Flavoring",
      ]);
    });

    test("handles ingredients with additives", () => {
      expect(
        preprocessIngredients(
          "water, sugar (brown), salt (sea salt), vitamin b12"
        )
      ).toEqual(["water", "sugar brown", "salt sea salt", "vitamin b12"]);
    });
  });

  describe("edge cases", () => {
    test("handles empty input", () => {
      expect(preprocessIngredients("")).toEqual([]);
    });

    test("handles input with only separators", () => {
      expect(preprocessIngredients(",,,:::,,,")).toEqual([]);
    });

    test("handles input with only spaces", () => {
      expect(preprocessIngredients("   ")).toEqual([]);
    });

    test("handles special characters", () => {
      expect(preprocessIngredients("()[]{}")).toEqual(["[]{}"]);
    });
  });

  describe("error handling", () => {
    test("handles null or undefined", () => {
      // @ts-expect-error Testing invalid input
      expect(preprocessIngredients(null)).toEqual([]);
      // @ts-expect-error Testing invalid input
      expect(preprocessIngredients(undefined)).toEqual([]);
    });

    test("handles non-string input", () => {
      // @ts-expect-error Testing invalid input
      expect(preprocessIngredients(123)).toEqual([]);
      // @ts-expect-error Testing invalid input
      expect(preprocessIngredients({})).toEqual([]);
    });
  });
});
