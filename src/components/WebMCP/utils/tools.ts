"use client";

import type { JsonSchemaForInference } from "@mcp-b/webmcp-types";
import type { RecentCheck } from "@/components/Check/models/recent-check";
import {
  loadRecentChecks,
  rememberCheck,
} from "@/components/Check/recentChecks";
import {
  fetchProduct,
  type ProductFetchResult,
} from "@/components/Check/utils/product-actions";
import {
  normalizeProduct,
  normalizeSources,
} from "@/components/Check/utils/product-helpers";
import {
  checkIngredients,
  type IngredientsCheckResult,
} from "@/components/IngredientsCheck/utils/actions";
import { FetchStatus } from "@/models/FetchStatus";
import type {
  CheckIngredientsOutput,
  CheckIngredientsToolInput,
  CheckProductOutput,
  CheckProductToolInput,
  EmptyToolInput,
  GetHistoryToolInput,
  HistoryOutput,
  ScanProductOutput,
  ScanProductToolInput,
  ToolExecutionOptions,
  WebMcpToolDescriptor,
} from "../models/webmcp";

export const CHECK_INGREDIENTS_INPUT_SCHEMA = {
  additionalProperties: false,
  properties: {
    ingredients: {
      description: "A comma-separated list of product ingredients.",
      type: "string",
    },
  },
  required: ["ingredients"],
  type: "object",
} as const satisfies JsonSchemaForInference;

export const CHECK_PRODUCT_INPUT_SCHEMA = {
  additionalProperties: false,
  properties: {
    barcode: {
      description: "The product barcode, containing 8 to 13 digits.",
      type: "string",
    },
  },
  required: ["barcode"],
  type: "object",
} as const satisfies JsonSchemaForInference;

export const EMPTY_INPUT_SCHEMA = {
  additionalProperties: false,
  properties: {},
  type: "object",
} as const satisfies JsonSchemaForInference;

export class WebMcpToolInputError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "WebMcpToolInputError";
  }
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const assertObjectWithKeys = (
  input: unknown,
  expectedKeys: readonly string[]
): Record<string, unknown> => {
  if (!isObjectRecord(input)) {
    throw new WebMcpToolInputError("Tool input must be a JSON object.");
  }

  const unexpectedKey = Object.keys(input).find(
    (key) => !expectedKeys.includes(key)
  );
  if (unexpectedKey) {
    throw new WebMcpToolInputError(
      `Unexpected tool input property: ${unexpectedKey}.`
    );
  }

  return input;
};

const requiredText = (input: Record<string, unknown>, key: string): string => {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new WebMcpToolInputError(
      `Tool input property "${key}" must be a non-blank string.`
    );
  }
  return value.trim();
};

export const parseCheckIngredientsInput = (
  input: unknown
): CheckIngredientsToolInput => {
  const object = assertObjectWithKeys(input, ["ingredients"]);
  return { ingredients: requiredText(object, "ingredients") };
};

export const parseCheckProductInput = (
  input: unknown
): CheckProductToolInput => {
  const object = assertObjectWithKeys(input, ["barcode"]);
  return { barcode: requiredText(object, "barcode") };
};

export const parseEmptyInput = (input: unknown): EmptyToolInput => {
  assertObjectWithKeys(input, []);
  return {};
};

const mapIngredientsResult = (
  data: IngredientsCheckResult
): CheckIngredientsOutput => {
  if (data.status === FetchStatus.OK) {
    return data.result
      ? { result: data.result, status: "ok" }
      : { status: "error" };
  }
  if (data.status === FetchStatus.INVALID) {
    return { status: "invalid" };
  }
  if (data.status === FetchStatus.TIMEOUT) {
    return { status: "timeout" };
  }
  return { status: "error" };
};

const mapProductResult = (
  barcode: string,
  data: ProductFetchResult,
  saveRecentCheck: (entry: RecentCheck) => void
): CheckProductOutput => {
  if (data.status === FetchStatus.INVALID) {
    return { barcode, status: "invalid" };
  }
  if (data.status === FetchStatus.NOT_FOUND) {
    return { barcode, status: "not_found" };
  }
  if (data.status === FetchStatus.TIMEOUT) {
    return { barcode, status: "timeout" };
  }
  if (data.status !== FetchStatus.OK || !data.product || !data.sources) {
    return { barcode, status: "error" };
  }

  try {
    const product = normalizeProduct(data.product);
    const sources = normalizeSources(data.sources);
    saveRecentCheck({ ean: barcode, name: product.productname });
    return { barcode, product, sources, status: "ok" };
  } catch {
    return { barcode, status: "error" };
  }
};

export interface WebMcpToolDependencies {
  checkIngredients: typeof checkIngredients;
  fetchProduct: typeof fetchProduct;
  loadRecentChecks: typeof loadRecentChecks;
  rememberCheck: typeof rememberCheck;
  scanProduct: (options?: ToolExecutionOptions) => Promise<string>;
}

const defaultDependencies: WebMcpToolDependencies = {
  checkIngredients,
  fetchProduct,
  loadRecentChecks,
  rememberCheck,
  scanProduct: () => {
    throw new Error("The WebMCP scanner is not available.");
  },
};

const createCheckIngredientsTool = (
  dependencies: WebMcpToolDependencies
): WebMcpToolDescriptor<CheckIngredientsToolInput, CheckIngredientsOutput> => ({
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  description: "Check whether a product's ingredients are vegan.",
  execute: async (input) => {
    const { ingredients } = parseCheckIngredientsInput(input);
    const result = await dependencies.checkIngredients(ingredients);
    return mapIngredientsResult(result);
  },
  inputSchema: CHECK_INGREDIENTS_INPUT_SCHEMA,
  name: "check_ingredients",
});

const createCheckProductTool = (
  dependencies: WebMcpToolDependencies
): WebMcpToolDescriptor<CheckProductToolInput, CheckProductOutput> => ({
  annotations: { readOnlyHint: false, untrustedContentHint: true },
  description: "Check whether a product is vegan using its barcode.",
  execute: async (input) => {
    const { barcode } = parseCheckProductInput(input);
    const result = await dependencies.fetchProduct(barcode);
    return mapProductResult(barcode, result, dependencies.rememberCheck);
  },
  inputSchema: CHECK_PRODUCT_INPUT_SCHEMA,
  name: "check_product",
});

const createScanProductTool = (
  dependencies: WebMcpToolDependencies
): WebMcpToolDescriptor<ScanProductToolInput, ScanProductOutput> => ({
  annotations: { readOnlyHint: false, untrustedContentHint: true },
  description:
    "Scan a product barcode with the camera after human confirmation.",
  execute: async (input, options) => {
    parseEmptyInput(input);
    const barcode = await dependencies.scanProduct(options);
    const normalizedBarcode = requiredText({ barcode }, "barcode");
    const result = await dependencies.fetchProduct(normalizedBarcode);
    return mapProductResult(
      normalizedBarcode,
      result,
      dependencies.rememberCheck
    );
  },
  inputSchema: EMPTY_INPUT_SCHEMA,
  name: "scan_product",
});

const createHistoryTool = (
  dependencies: WebMcpToolDependencies
): WebMcpToolDescriptor<GetHistoryToolInput, HistoryOutput> => ({
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  description: "Return the products most recently checked with Veganify.",
  execute: (input) => {
    parseEmptyInput(input);
    try {
      return { entries: dependencies.loadRecentChecks() };
    } catch {
      return { entries: [] };
    }
  },
  inputSchema: EMPTY_INPUT_SCHEMA,
  name: "get_history",
});

export function createWebMcpTools(
  dependencies: Partial<WebMcpToolDependencies> = {}
): [
  WebMcpToolDescriptor<CheckIngredientsToolInput, CheckIngredientsOutput>,
  WebMcpToolDescriptor<CheckProductToolInput, CheckProductOutput>,
  WebMcpToolDescriptor<ScanProductToolInput, ScanProductOutput>,
  WebMcpToolDescriptor<GetHistoryToolInput, HistoryOutput>,
] {
  const resolvedDependencies: WebMcpToolDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };
  return [
    createCheckIngredientsTool(resolvedDependencies),
    createCheckProductTool(resolvedDependencies),
    createScanProductTool(resolvedDependencies),
    createHistoryTool(resolvedDependencies),
  ];
}
