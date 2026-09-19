import { describe, expect, test } from "bun:test";

import type { RecentCheck } from "@/components/Check/models/recent-check";
import type { ProductFetchResult } from "@/components/Check/utils/product-actions";
import type { IngredientsCheckResult } from "@/components/IngredientsCheck/utils/actions";
import { FetchStatus } from "@/models/FetchStatus";
import type {
  CheckIngredientsToolInput,
  CheckProductToolInput,
  EmptyToolInput,
  ToolExecutionOptions,
} from "../models/webmcp";
import type { WebMcpToolDependencies } from "./tools";
import {
  CHECK_INGREDIENTS_INPUT_SCHEMA,
  CHECK_PRODUCT_INPUT_SCHEMA,
  createWebMcpTools,
  EMPTY_INPUT_SCHEMA,
  WebMcpToolInputError,
} from "./tools";

const createDependencies = () => {
  let ingredientResponse: IngredientsCheckResult = {
    result: {
      maybeNotVegan: [],
      notVegan: [],
      surelyVegan: ["apple"],
      unknown: [],
      vegan: true,
    },
    status: FetchStatus.OK,
  };
  let productResponse: ProductFetchResult = {
    product: {
      animaltestfree: undefined,
      grade: "B",
      nutriscore: "A",
      palmoil: false,
      productname: "Test product",
      vegan: true,
      vegetarian: true,
    },
    sources: {
      api: "open-food-facts",
      baseuri: "https://example.test",
      processed: true,
    },
    status: FetchStatus.OK,
  };
  let history: RecentCheck[] = [];
  let historyUnavailable = false;
  let scannedSignal: AbortSignal | undefined;
  const remembered: RecentCheck[] = [];

  const dependencies: WebMcpToolDependencies = {
    checkIngredients: async () => ingredientResponse,
    fetchProduct: async () => productResponse,
    loadRecentChecks: () => {
      if (historyUnavailable) {
        throw new Error("storage unavailable");
      }
      return history;
    },
    rememberCheck: (entry) => remembered.push(entry),
    scanProduct: (options?: ToolExecutionOptions) => {
      scannedSignal = options?.signal;
      return Promise.resolve("4000417025005");
    },
  };

  return {
    dependencies,
    get history() {
      return history;
    },
    get ingredientResponse() {
      return ingredientResponse;
    },
    get productResponse() {
      return productResponse;
    },
    remembered,
    get scannedSignal() {
      return scannedSignal;
    },
    setHistory(value: RecentCheck[]) {
      history = value;
    },
    setHistoryUnavailable(value: boolean) {
      historyUnavailable = value;
    },
    setIngredientResponse(value: IngredientsCheckResult) {
      ingredientResponse = value;
    },
    setProductResponse(value: ProductFetchResult) {
      productResponse = value;
    },
  };
};

describe("WebMCP tool contracts", () => {
  test("exposes four named tools with strict schemas and annotations", () => {
    const [ingredients, product, scan, history] = createWebMcpTools(
      createDependencies().dependencies
    );

    expect(ingredients.name).toBe("check_ingredients");
    expect(ingredients.inputSchema).toEqual(CHECK_INGREDIENTS_INPUT_SCHEMA);
    expect(ingredients.annotations).toEqual({
      readOnlyHint: true,
      untrustedContentHint: true,
    });
    expect(product.name).toBe("check_product");
    expect(product.inputSchema).toEqual(CHECK_PRODUCT_INPUT_SCHEMA);
    expect(product.annotations).toEqual({
      readOnlyHint: false,
      untrustedContentHint: true,
    });
    expect(scan.name).toBe("scan_product");
    expect(scan.inputSchema).toEqual(EMPTY_INPUT_SCHEMA);
    expect(scan.annotations).toEqual({
      readOnlyHint: false,
      untrustedContentHint: true,
    });
    expect(history.name).toBe("get_history");
    expect(history.inputSchema).toEqual(EMPTY_INPUT_SCHEMA);
    expect(history.annotations).toEqual({
      readOnlyHint: true,
      untrustedContentHint: true,
    });
    expect(CHECK_INGREDIENTS_INPUT_SCHEMA.additionalProperties).toBe(false);
    expect(CHECK_PRODUCT_INPUT_SCHEMA.additionalProperties).toBe(false);
    expect(EMPTY_INPUT_SCHEMA.additionalProperties).toBe(false);
  });

  test("maps ingredient action successes and failures to stable statuses", async () => {
    const state = createDependencies();
    const [tool] = createWebMcpTools(state.dependencies);

    await expect(tool.execute({ ingredients: "apple" })).resolves.toEqual({
      result: state.ingredientResponse.result,
      status: "ok",
    });

    for (const [status, expected] of [
      [FetchStatus.INVALID, "invalid"],
      [FetchStatus.TIMEOUT, "timeout"],
      [FetchStatus.SERVER_ERROR, "error"],
    ] as const) {
      state.setIngredientResponse({ status });
      // biome-ignore lint/performance/noAwaitInLoops: These statuses are intentionally checked sequentially.
      await expect(tool.execute({ ingredients: "apple" })).resolves.toEqual({
        status: expected,
      });
    }

    state.setIngredientResponse({ status: FetchStatus.OK });
    await expect(tool.execute({ ingredients: "apple" })).resolves.toEqual({
      status: "error",
    });
  });

  test("rejects malformed ingredient and product input at the boundary", async () => {
    const [ingredients, product] = createWebMcpTools(
      createDependencies().dependencies
    );
    const malformedIngredients: unknown[] = [
      null,
      [],
      "apple",
      {},
      { ingredients: "   " },
      { extra: true, ingredients: "apple" },
    ];
    for (const input of malformedIngredients) {
      // biome-ignore lint/performance/noAwaitInLoops: Each malformed boundary case is asserted independently.
      await expect(
        ingredients.execute(input as CheckIngredientsToolInput)
      ).rejects.toBeInstanceOf(WebMcpToolInputError);
    }

    const malformedProducts: unknown[] = [
      null,
      [],
      {},
      { barcode: " " },
      { barcode: "123", extra: false },
    ];
    for (const input of malformedProducts) {
      // biome-ignore lint/performance/noAwaitInLoops: Each malformed boundary case is asserted independently.
      await expect(
        product.execute(input as CheckProductToolInput)
      ).rejects.toBeInstanceOf(WebMcpToolInputError);
    }
  });

  test("maps every product status and saves only complete successes", async () => {
    const state = createDependencies();
    const [, tool] = createWebMcpTools(state.dependencies);

    await expect(tool.execute({ barcode: "4000417025005" })).resolves.toEqual({
      barcode: "4000417025005",
      product: {
        animaltestfree: "n/a",
        grade: "B",
        nutriscore: "A",
        palmoil: false,
        productname: "Test product",
        vegan: true,
        vegetarian: true,
      },
      sources: {
        api: "open-food-facts",
        baseuri: "https://example.test",
      },
      status: "ok",
    });
    expect(state.remembered).toEqual([
      { ean: "4000417025005", name: "Test product" },
    ]);

    for (const [status, expected] of [
      [FetchStatus.INVALID, "invalid"],
      [FetchStatus.NOT_FOUND, "not_found"],
      [FetchStatus.TIMEOUT, "timeout"],
      [FetchStatus.SERVER_ERROR, "error"],
    ] as const) {
      state.setProductResponse({ status });
      // biome-ignore lint/performance/noAwaitInLoops: These statuses are intentionally checked sequentially.
      await expect(tool.execute({ barcode: "4000417025005" })).resolves.toEqual(
        {
          barcode: "4000417025005",
          status: expected,
        }
      );
    }

    state.setProductResponse({ product: {} as never, status: FetchStatus.OK });
    await expect(tool.execute({ barcode: "4000417025005" })).resolves.toEqual({
      barcode: "4000417025005",
      status: "error",
    });
    expect(state.remembered).toHaveLength(1);
  });

  test("keeps the scanned barcode on lookup failures and forwards abort signals", async () => {
    const state = createDependencies();
    const [, , scan] = createWebMcpTools(state.dependencies);
    const controller = new AbortController();
    state.setProductResponse({ status: FetchStatus.NOT_FOUND });

    await expect(
      scan.execute({}, { signal: controller.signal })
    ).resolves.toEqual({
      barcode: "4000417025005",
      status: "not_found",
    });
    expect(state.scannedSignal).toBe(controller.signal);
  });

  test("reads current history and treats unavailable storage as empty", () => {
    const state = createDependencies();
    const [, , , historyTool] = createWebMcpTools(state.dependencies);
    const entries = [{ ean: "1", name: "One" }];
    state.setHistory(entries);
    expect(historyTool.execute({})).toEqual({ entries });

    state.setHistoryUnavailable(true);
    expect(historyTool.execute({})).toEqual({ entries: [] });
    expect(() =>
      historyTool.execute({ extra: true } as unknown as EmptyToolInput)
    ).toThrow(WebMcpToolInputError);
  });
});
