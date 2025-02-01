"use server";

import Veganify, { ProductResponse } from "@frontendnetwork/veganify";

export async function fetchProduct(barcode: string): Promise<{
  product?: ProductResponse["product"];
  sources?: ProductResponse["sources"];
  status: number;
}> {
  try {
    const veganify = Veganify.getInstance({
      staging: process.env.NEXT_PUBLIC_STAGING === "true",
    });

    const data = await veganify.getProductByBarcode(barcode);

    return {
      product: data.product,
      sources: data.sources,
      status: data.status,
    };
  } catch (error) {
    console.error("Product fetch error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred", { cause: error });
  }
}
