"use server";

import Veganify, {
  NotFoundError,
  type ProductResponse,
  ValidationError,
  VeganifyError,
} from "@frontendnetwork/veganify";

import { FetchStatus } from "@/models/FetchStatus";

export interface ProductFetchResult {
  product?: ProductResponse["product"];
  sources?: ProductResponse["sources"];
  status: FetchStatus;
}

export async function fetchProduct(
  barcode: string
): Promise<ProductFetchResult> {
  try {
    const veganify = Veganify.getInstance({
      staging: process.env.NEXT_PUBLIC_STAGING === "true",
    });

    const data = await veganify.getProductByBarcode(barcode);

    return {
      product: data.product,
      sources: data.sources,
      status: FetchStatus.OK,
    };
  } catch (error) {
    // Server actions serialize thrown errors opaquely in production, which
    // hid real failures behind a generic timeout message. Return typed
    // statuses instead so the client can show the right message.
    if (error instanceof ValidationError) {
      return { status: FetchStatus.INVALID };
    }
    if (error instanceof NotFoundError) {
      return { status: FetchStatus.NOT_FOUND };
    }
    if (error instanceof VeganifyError && error.statusCode === 408) {
      return { status: FetchStatus.TIMEOUT };
    }
    console.error("Product fetch failed:", error);
    return { status: FetchStatus.SERVER_ERROR };
  }
}
