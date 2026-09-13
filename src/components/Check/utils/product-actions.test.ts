import {
  afterEach,
  beforeEach,
  describe,
  expect,
  type Mock,
  mock,
  test,
} from "bun:test";

import Veganify, {
  NotFoundError,
  ValidationError,
  VeganifyError,
} from "@frontendnetwork/veganify";

import { FetchStatus } from "@/models/FetchStatus";

import { fetchProduct } from "./product-actions";

// Mock Veganify
mock.module("@frontendnetwork/veganify", () => {
  const mockInstance = {
    getProductByBarcode: mock(),
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
  let mockVeganify: { getProductByBarcode: Mock<(...args: any[]) => any> };

  beforeEach(() => {
    console.error = mock() as typeof console.error;
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockClear();
    mockVeganify = {
      getProductByBarcode: mock().mockResolvedValue({
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
    (Veganify.getInstance as Mock<(...args: any[]) => any>).mockReturnValue(
      mockVeganify
    );
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe("successful responses", () => {
    test("returns product and sources with OK status", async () => {
      mockVeganify.getProductByBarcode.mockResolvedValueOnce({
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
      });

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({
        product: {
          productname: "Test Product",
          vegan: true,
        },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: FetchStatus.OK,
      });
    });

    test("returns product with minimal data", async () => {
      mockVeganify.getProductByBarcode.mockResolvedValueOnce({
        product: {
          productname: "Minimal Product",
        },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      });

      const result = await fetchProduct("4000417025005");
      expect(result.status).toBe(FetchStatus.OK);
      expect(result.product?.productname).toBe("Minimal Product");
    });
  });

  describe("error mapping", () => {
    test("maps invalid barcode format to INVALID status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new ValidationError("Invalid barcode format")
      );

      const result = await fetchProduct("invalid");
      expect(result).toEqual({ status: FetchStatus.INVALID });
    });

    test("maps non-existent product to NOT_FOUND status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new NotFoundError("Product not found")
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: FetchStatus.NOT_FOUND });
    });

    test("maps request timeout to TIMEOUT status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new VeganifyError("Request timed out", 408)
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: FetchStatus.TIMEOUT });
    });

    test("maps API errors to SERVER_ERROR status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new VeganifyError("HTTP error 500", 500)
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: FetchStatus.SERVER_ERROR });
    });

    test("maps network errors to SERVER_ERROR status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: FetchStatus.SERVER_ERROR });
    });

    test("maps non-error rejections to SERVER_ERROR status", async () => {
      mockVeganify.getProductByBarcode.mockRejectedValueOnce(
        "Unexpected error"
      );

      const result = await fetchProduct("4000417025005");
      expect(result).toEqual({ status: FetchStatus.SERVER_ERROR });
    });
  });

  describe("edge cases", () => {
    test("handles empty product name", async () => {
      mockVeganify.getProductByBarcode.mockResolvedValueOnce({
        product: { productname: "" },
        sources: {
          processed: true,
          api: "test",
          baseuri: "test",
        },
        status: 200,
      });

      const result = await fetchProduct("4000417025005");
      expect(result.status).toBe(FetchStatus.OK);
      expect(result.product?.productname).toBe("");
    });

    test("handles missing sources", async () => {
      mockVeganify.getProductByBarcode.mockResolvedValueOnce({
        product: {
          productname: "Test Product",
        },
        status: 200,
      });

      const result = await fetchProduct("4000417025005");
      expect(result.status).toBe(FetchStatus.OK);
      expect(result.sources).toBeUndefined();
    });
  });
});
