import Veganify, {
  NotFoundError,
  ValidationError,
} from "@frontendnetwork/veganify";

import { fetchProduct } from "./product-actions";

// Mock Veganify
jest.mock("@frontendnetwork/veganify", () => {
  const mockInstance = {
    getProductByBarcode: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      getInstance: jest.fn(() => mockInstance),
    },
    NotFoundError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
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

describe("fetchProduct", () => {
  const originalError = console.error;
  let mockVeganify: { getProductByBarcode: jest.Mock };

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
    mockVeganify = {
      getProductByBarcode: jest.fn().mockResolvedValue({
        product: {
          productname: "Test Product",
          vegan: true,
        },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      }),
    };
    (Veganify.getInstance as jest.Mock).mockReturnValue(mockVeganify);
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe("successful responses", () => {
    test("returns product and sources when available", async () => {
      const mockResponse = {
        product: {
          productname: "Test Product",
          vegan: true,
        },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      };

      mockVeganify.getProductByBarcode.mockResolvedValueOnce(mockResponse);

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual(mockResponse);
    });

    test("returns product with minimal data", async () => {
      const mockResponse = {
        product: {
          productname: "Minimal Product",
        },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      };

      mockVeganify.getProductByBarcode.mockResolvedValueOnce(mockResponse);

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("error handling", () => {
    test("throws error for invalid barcode format", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new ValidationError("Invalid barcode format")
      );

      await expect(fetchProduct("invalid")).rejects.toThrow(
        "Invalid barcode format"
      );
    });

    test("throws error for non-existent product", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new NotFoundError("Product not found")
      );

      await expect(fetchProduct("4000417025005")).rejects.toThrow(
        "Product not found"
      );
    });

    test("handles network errors", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(fetchProduct("4000417025005")).rejects.toThrow(
        "Network error"
      );
    });

    test("handles unexpected error formats", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        "Unexpected error"
      );

      await expect(fetchProduct("4000417025005")).rejects.toThrow(
        "Unknown error occurred"
      );
    });
  });

  describe("edge cases", () => {
    test("handles empty product response", async () => {
      const mockResponse = {
        product: {},
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      };

      mockVeganify.getProductByBarcode.mockResolvedValueOnce(mockResponse);

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual(mockResponse);
    });

    test("handles missing sources", async () => {
      const mockResponse = {
        product: {
          productname: "Test Product",
        },
        status: 200,
      };

      mockVeganify.getProductByBarcode.mockResolvedValueOnce(mockResponse);

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual(mockResponse);
    });
  });
});
