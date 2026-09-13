import { beforeEach, describe, expect, it, type Mock, mock } from "bun:test";

import Veganify, { ValidationError } from "@frontendnetwork/veganify";

import { FetchStatus } from "@/models/FetchStatus";

import { checkIngredients } from "./actions";

// Mock Veganify
mock.module("@frontendnetwork/veganify", () => {
  const mockInstance = {
    checkIngredientsListV1: mock(),
  };
  return {
    __esModule: true,
    default: {
      getInstance: mock(() => mockInstance),
    },
    ValidationError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = "ValidationError";
      }
    },
    VeganifyError: class extends Error {
      statusCode?: number;
      constructor(message: string, statusCode?: number) {
        super(message);
        this.name = "VeganifyError";
        this.statusCode = statusCode;
      }
    },
  };
});

describe("checkIngredients", () => {
  let mockVeganifyInstance: {
    checkIngredientsListV1: Mock<(...args: any[]) => any>;
  };

  beforeEach(() => {
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockClear();
    mockVeganifyInstance = {
      checkIngredientsListV1: mock().mockResolvedValue({
        code: "200",
        data: {
          maybe_not_vegan: [],
          not_vegan: [],
          surely_vegan: ["apple"],
          unknown: [],
          vegan: true,
        },
        message: "OK",
        status: "success",
      }),
    };
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockReturnValue(
      mockVeganifyInstance
    );
  });

  it("should successfully check ingredients and return formatted data", async () => {
    const mockApiResponse = {
      code: "200",
      data: {
        maybe_not_vegan: [],
        not_vegan: [],
        surely_vegan: ["apple", "banana"],
        unknown: ["artificial-flavor"],
        vegan: true,
      },
      message: "OK",
      status: "success",
    };

    mockVeganifyInstance.checkIngredientsListV1.mockResolvedValue(
      mockApiResponse
    );

    const result = await checkIngredients("apple, banana, artificial-flavor");

    expect(result).toEqual({
      result: {
        maybeNotVegan: [],
        notVegan: [],
        surelyVegan: ["apple", "banana"],
        unknown: ["artificial-flavor"],
        vegan: true,
      },
      status: FetchStatus.OK,
    });

    // Verify Veganify was called with correct parameters
    expect(mockVeganifyInstance.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple, banana, artificial-flavor"
    );
  });

  it("should map validation errors to INVALID status", async () => {
    mockVeganifyInstance.checkIngredientsListV1.mockRejectedValue(
      new ValidationError("Invalid ingredients format")
    );

    const result = await checkIngredients("invalid!ingredients");

    expect(result).toEqual({ status: FetchStatus.INVALID });
    expect(mockVeganifyInstance.checkIngredientsListV1).toHaveBeenCalledWith(
      "invalid!ingredients"
    );
  });

  it("should return INVALID status when ingredients string is empty", async () => {
    expect(await checkIngredients("")).toEqual({
      status: FetchStatus.INVALID,
    });
    expect(await checkIngredients("   ")).toEqual({
      status: FetchStatus.INVALID,
    });

    // Verify Veganify was not called
    expect(mockVeganifyInstance.checkIngredientsListV1).not.toHaveBeenCalled();
  });

  it("should map API failures to SERVER_ERROR status", async () => {
    mockVeganifyInstance.checkIngredientsListV1.mockRejectedValue(
      new Error("API Error")
    );

    const result = await checkIngredients("apple");

    expect(result).toEqual({ status: FetchStatus.SERVER_ERROR });
    expect(mockVeganifyInstance.checkIngredientsListV1).toHaveBeenCalledWith(
      "apple"
    );
  });

  it("should handle non-vegan ingredients correctly", async () => {
    const mockApiResponse = {
      code: "200",
      data: {
        maybe_not_vegan: ["sugar"],
        not_vegan: ["gelatin"],
        surely_vegan: ["apple"],
        unknown: [],
        vegan: false,
      },
      message: "OK",
      status: "success",
    };

    mockVeganifyInstance.checkIngredientsListV1.mockResolvedValue(
      mockApiResponse
    );

    const result = await checkIngredients("apple, gelatin, sugar");

    expect(result).toEqual({
      result: {
        maybeNotVegan: ["sugar"],
        notVegan: ["gelatin"],
        surelyVegan: ["apple"],
        unknown: [],
        vegan: false,
      },
      status: FetchStatus.OK,
    });
  });

  it("should handle staging environment flag correctly", async () => {
    const originalEnv = process.env.NEXT_PUBLIC_STAGING;

    // Test with staging true
    process.env.NEXT_PUBLIC_STAGING = "true";
    await checkIngredients("apple");
    expect(Veganify.getInstance).toHaveBeenCalledWith({
      staging: true,
    });

    // Test with staging false
    process.env.NEXT_PUBLIC_STAGING = "false";
    await checkIngredients("apple");
    expect(Veganify.getInstance).toHaveBeenCalledWith({
      staging: false,
    });

    // Reset environment
    process.env.NEXT_PUBLIC_STAGING = originalEnv;
  });
});
