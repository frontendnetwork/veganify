import Veganify from "@frontendnetwork/veganify";

import { checkIngredients } from "./actions";

// Mock Veganify
jest.mock("@frontendnetwork/veganify", () => {
  const mockInstance = {
    checkIngredientsListV1: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      getInstance: jest.fn(() => mockInstance),
    },
    ValidationError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = "ValidationError";
      }
    },
  };
});

describe("checkIngredients", () => {
  let mockVeganifyInstance: { checkIngredientsListV1: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockVeganifyInstance = {
      checkIngredientsListV1: jest.fn(),
    };
    (Veganify.getInstance as jest.Mock).mockReturnValue(mockVeganifyInstance);
  });

  it("should successfully check ingredients and return formatted data", async () => {
    const mockApiResponse = {
      code: "200",
      status: "success",
      message: "OK",
      data: {
        vegan: true,
        surely_vegan: ["apple", "banana"],
        not_vegan: [],
        maybe_not_vegan: [],
        unknown: ["artificial-flavor"],
      },
    };

    mockVeganifyInstance.checkIngredientsListV1.mockResolvedValue(
      mockApiResponse
    );

    const result = await checkIngredients("apple, banana, artificial-flavor");

    expect(result).toEqual({
      vegan: true,
      surelyVegan: ["apple", "banana"],
      notVegan: [],
      maybeNotVegan: [],
      unknown: ["artificial-flavor"],
    });

    // Verify Veganify was called with correct parameters
    expect(mockVeganifyInstance.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple, banana, artificial-flavor"
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
    expect(mockVeganifyInstance.checkIngredientsListV1).not.toHaveBeenCalled();
  });

  it("should throw an error when API call fails", async () => {
    mockVeganifyInstance.checkIngredientsListV1.mockRejectedValue(
      new Error("API Error")
    );

    await expect(checkIngredients("apple")).rejects.toThrow(
      "Failed to check ingredients"
    );

    expect(mockVeganifyInstance.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple"
    );
  });

  it("should handle non-vegan ingredients correctly", async () => {
    const mockApiResponse = {
      code: "200",
      status: "success",
      message: "OK",
      data: {
        vegan: false,
        surely_vegan: ["apple"],
        not_vegan: ["gelatin"],
        maybe_not_vegan: ["sugar"],
        unknown: [],
      },
    };

    mockVeganifyInstance.checkIngredientsListV1.mockResolvedValue(
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
});
