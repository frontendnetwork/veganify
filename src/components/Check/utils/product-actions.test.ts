import Veganify from "@frontendnetwork/veganify";

import { fetchProduct } from "./product-actions";

// Mock Veganify
jest.mock("@frontendnetwork/veganify", () => ({
  getInstance: jest.fn(() => ({
    getProductByBarcode: jest.fn(),
  })),
}));

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

  // Reference existing test cases
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
  });
});
