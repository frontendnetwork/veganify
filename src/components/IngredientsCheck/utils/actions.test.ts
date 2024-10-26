import Veganify from "@frontendnetwork/veganify";

jest.mock("@frontendnetwork/veganify", () => ({
  getProductByBarcode: jest.fn(),
}));

async function testFetchProduct(barcode: string) {
  try {
    const data = await Veganify.getProductByBarcode(
      barcode,
      process.env.NEXT_PUBLIC_STAGING === "true"
    );
    if (data && "product" in data && "sources" in data) {
      return {
        product: data.product,
        sources: data.sources,
        status: data.status,
      };
    } else if (data && "status" in data) {
      return {
        status: data.status,
      };
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Product fetch error:", error);
    throw error;
  }
}

describe("fetchProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env.NEXT_PUBLIC_STAGING = undefined;
  });

  it("returns product and sources when available", async () => {
    const mockResponse = {
      product: {
        name: "Test Product",
        vegan: true,
      },
      sources: {
        openFoodFacts: true,
      },
      status: 200,
    };

    (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
      mockResponse
    );

    const result = await testFetchProduct("4000417025005");

    expect(result).toEqual(mockResponse);
    expect(Veganify.getProductByBarcode).toHaveBeenCalledWith(
      "4000417025005",
      false
    );
  });

  it("returns only status when no product found", async () => {
    const mockResponse = {
      status: 404,
    };

    (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce(
      mockResponse
    );

    const result = await testFetchProduct("4000417025005");

    expect(result).toEqual({ status: 404 });
  });

  it("throws error when API call fails", async () => {
    const mockError = new Error("API Error");
    (Veganify.getProductByBarcode as jest.Mock).mockRejectedValueOnce(
      mockError
    );

    await expect(testFetchProduct("4000417025005")).rejects.toThrow(
      "API Error"
    );
  });

  it("uses staging flag correctly", async () => {
    const mockResponse = {
      product: {
        name: "Test Product",
        vegan: true,
      },
      sources: {
        openFoodFacts: true,
      },
      status: 200,
    };

    (Veganify.getProductByBarcode as jest.Mock).mockResolvedValue(mockResponse);

    // Test with staging true
    process.env.NEXT_PUBLIC_STAGING = "true";
    await testFetchProduct("4000417025005");
    expect(Veganify.getProductByBarcode).toHaveBeenLastCalledWith(
      "4000417025005",
      true
    );

    // Test with staging false
    process.env.NEXT_PUBLIC_STAGING = "false";
    await testFetchProduct("4000417025005");
    expect(Veganify.getProductByBarcode).toHaveBeenLastCalledWith(
      "4000417025005",
      false
    );

    // Test with staging undefined
    process.env.NEXT_PUBLIC_STAGING = undefined;
    await testFetchProduct("4000417025005");
    expect(Veganify.getProductByBarcode).toHaveBeenLastCalledWith(
      "4000417025005",
      false
    );
  });

  it("handles invalid response format", async () => {
    (Veganify.getProductByBarcode as jest.Mock).mockResolvedValueOnce({
      invalidField: "invalid",
    });

    await expect(testFetchProduct("4000417025005")).rejects.toThrow(
      "Invalid response format"
    );
  });
});
