import Veganify from "@frontendnetwork/veganify";

import { fetchProduct } from "./product-actions";

// Mock Veganify
jest.mock("@frontendnetwork/veganify", () => ({
  getProductByBarcode: jest.fn(),
}));

describe("fetchProduct", () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
    (Veganify.getProductByBarcode as jest.Mock).mockResolvedValue({
      product: {
        name: "Test Product",
        vegan: true,
      },
      sources: {
        openFoodFacts: true,
      },
      status: 200,
    });
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe("successful responses", () => {
    test("returns product and sources when available", async () => {
      const mockResponse = {
        product: {
          name: "Test Product",
          vegan: true,
          ingredients: ["water", "sugar"],
        },
        sources: {
          openFoodFacts: true,
          community: false,
        },
        status: 200,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual(mockResponse);
    });

    test("returns only status when no product found", async () => {
      const mockResponse = {
        status: 404,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: 404 });
    });
  });

  describe("error handling", () => {
    test("throws error when API call fails", async () => {
      const mockError = new Error("API Error");
      (Veganify.getProductByBarcode as jest.Mock).mockRejectedValueOnce(
        mockError
      );

      await expect(fetchProduct("4000417025005")).rejects.toThrow("API Error");
    });

    test("handles invalid barcode format", async () => {
      const mockResponse = {
        status: 400,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct("invalid");
      expect(result).toEqual({ status: 400 });
    });
  });

  describe("environment handling", () => {
    const mockResponse = {
      product: {
        name: "Test Product",
      },
      sources: {
        openFoodFacts: true,
      },
      status: 200,
    };

    beforeEach(() => {
      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValue(
        mockResponse
      );
    });

    test("uses staging flag when NEXT_PUBLIC_STAGING is true", async () => {
      process.env.NEXT_PUBLIC_STAGING = "true";
      await fetchProduct("4000417025005");

      expect(Veganify.getProductByBarcode).toHaveBeenCalledWith(
        "4000417025005",
        true
      );
    });

    test("uses production when NEXT_PUBLIC_STAGING is false", async () => {
      process.env.NEXT_PUBLIC_STAGING = "false";
      await fetchProduct("4000417025005");

      expect(Veganify.getProductByBarcode).toHaveBeenCalledWith(
        "4000417025005",
        false
      );
    });

    test("defaults to production when NEXT_PUBLIC_STAGING is undefined", async () => {
      process.env.NEXT_PUBLIC_STAGING = undefined;
      await fetchProduct("4000417025005");

      expect(Veganify.getProductByBarcode).toHaveBeenCalledWith(
        "4000417025005",
        false
      );
    });
  });

  describe("edge cases", () => {
    test("handles empty response", async () => {
      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: 200 });
    });

    test("handles malformed response", async () => {
      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce({
        unexpected: "data",
        status: 200,
      });

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: 200 });
    });
  });

  describe("input validation", () => {
    test("handles empty barcode", async () => {
      const mockResponse = {
        status: 400,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct("");
      expect(result).toEqual({ status: 400 });
    });

    test("handles very long barcode", async () => {
      const longBarcode = "1".repeat(100);
      const mockResponse = {
        product: {
          name: "Test Product",
        },
        sources: {
          openFoodFacts: true,
        },
        status: 200,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct(longBarcode);
      expect(result).toEqual(mockResponse);
    });

    test("handles special characters in barcode", async () => {
      const specialBarcode = "123!@#456";
      const mockResponse = {
        product: {
          name: "Test Product",
        },
        sources: {
          openFoodFacts: true,
        },
        status: 200,
      };

      (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchProduct(specialBarcode);
      expect(result).toEqual(mockResponse);
    });
  });
});
