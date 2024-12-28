"use server";

import Veganify from "@frontendnetwork/veganify";

import { ProductResult } from "@/models/ProductResults";
import { Sources } from "@/models/Sources";

export async function fetchProduct(barcode: string): Promise<{
  product?: ProductResult;
  sources?: Sources;
  status: number;
}> {
  try {
    const data = await Veganify.getProductByBarcode(
      barcode,
      process.env.NEXT_PUBLIC_STAGING === "true"
    );
    if ("product" in data && "sources" in data) {
      return {
        product: data.product,
        sources: data.sources,
        status: data.status,
      };
    } else {
      return {
        status: data.status,
      };
    }
  } catch (error) {
    console.error("Product fetch error:", error);
    throw error;
  }
}
