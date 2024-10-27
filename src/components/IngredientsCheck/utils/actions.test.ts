import Veganify from "@frontendnetwork/veganify";

import { checkIngredients } from "./actions";

jest.mock("@frontendnetwork/veganify", () => ({
  __esModule: true,
  default: {
    checkIngredientsListV1: jest.fn(),
  },
}));

describe("checkIngredients", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully check ingredients and return formatted data", async () => {
    // Mock successful API response
    const mockApiResponse = {
      data: {
        vegan: true,
        surely_vegan: ["apple", "banana"],
        not_vegan: [],
        maybe_not_vegan: [],
        unknown: ["artificial-flavor"],
      },
    };

    (Veganify.checkIngredientsListV1 as jest.Mock).mockResolvedValue(
      mockApiResponse
    );

    const result = await checkIngredients("apple, banana, artificial-flavor");

    // Check if the function returns the expected formatted data
    expect(result).toEqual({
      vegan: true,
      surelyVegan: ["apple", "banana"],
      notVegan: [],
      maybeNotVegan: [],
      unknown: ["artificial-flavor"],
    });

    // Verify Veganify was called with correct parameters
    expect(Veganify.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple, banana, artificial-flavor",
      process.env.NEXT_PUBLIC_STAGING === "true"
    );
  });

  it("should throw an error when ingredients string is empty", async () => {
    await expect(checkIngredients("")).rejects.toThrow(
      "Ingredients cannot be empty"
    );
    await expect(checkIngredients("   ")).rejects.toThrow(
      "Ingredients cannot be empty"
    );

    // Verify Veganify was not called
    expect(Veganify.checkIngredientsListV1).not.toHaveBeenCalled();
  });

  it("should throw an error when API call fails", async () => {
    // Mock API failure
    (Veganify.checkIngredientsListV1 as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    await expect(checkIngredients("apple")).rejects.toThrow(
      "Failed to check ingredients"
    );

    // Verify Veganify was called
    expect(Veganify.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple",
      process.env.NEXT_PUBLIC_STAGING === "true"
    );
  });

  it("should handle non-vegan ingredients correctly", async () => {
    // Mock API response with non-vegan ingredients
    const mockApiResponse = {
      data: {
        vegan: false,
        surely_vegan: ["apple"],
        not_vegan: ["gelatin"],
        maybe_not_vegan: ["sugar"],
        unknown: [],
      },
    };

    (Veganify.checkIngredientsListV1 as jest.Mock).mockResolvedValue(
      mockApiResponse
    );

    const result = await checkIngredients("apple, gelatin, sugar");

    expect(result).toEqual({
      vegan: false,
      surelyVegan: ["apple"],
      notVegan: ["gelatin"],
      maybeNotVegan: ["sugar"],
      unknown: [],
    });
  });

  it("should handle staging environment flag correctly", async () => {
    const originalEnv = process.env.NEXT_PUBLIC_STAGING;

    // Test with staging true
    process.env.NEXT_PUBLIC_STAGING = "true";
    await checkIngredients("apple");
    expect(Veganify.checkIngredientsListV1).toHaveBeenCalledWith("apple", true);

    // Test with staging false
    process.env.NEXT_PUBLIC_STAGING = "false";
    await checkIngredients("apple");
    expect(Veganify.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple",
      false
    );

    process.env.NEXT_PUBLIC_STAGING = originalEnv;
  });
});
