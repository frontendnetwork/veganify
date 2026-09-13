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
    VeganifyError: class extends Error {
      statusCode?: number;
      constructor(message: string, statusCode?: number) {
        super(message);
        this.name = "VeganifyError";
        this.statusCode = statusCode;
      }
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
  let mockVeganifyInstance: {
    checkIngredientsListV1: Mock<(...args: any[]) => any>;
  };

  beforeEach(() => {
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockClear();
    mockVeganifyInstance = {
      checkIngredientsListV1: mock().mockResolvedValue({
        code: "200",
        status: "success",
        message: "OK",
        data: {
          vegan: true,
          surely_vegan: ["apple"],
          not_vegan: [],
          maybe_not_vegan: [],
          unknown: [],
        },
      }),
    };
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockReturnValue(
      mockVeganifyInstance
    );
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
      result: {
        vegan: true,
        surelyVegan: ["apple", "banana"],
        notVegan: [],
        maybeNotVegan: [],
        unknown: ["artificial-flavor"],
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
      result: {
        vegan: false,
        surelyVegan: ["apple"],
        notVegan: ["gelatin"],
        maybeNotVegan: ["sugar"],
        unknown: [],
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
