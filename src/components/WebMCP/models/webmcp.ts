import type { WebMCP } from "@mcp-b/webmcp-types";

import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";
import type { RecentCheck } from "../../Check/models/recent-check";
import type { IngredientResult } from "../../IngredientsCheck/models/IngredientResult";

export interface ToolExecutionOptions {
  signal?: AbortSignal;
}

type WebMcpToolExecutor<TResult> = (
  input: unknown,
  options?: ToolExecutionOptions,
) => WebMCP.MaybePromise<TResult>;

export type WebMcpToolDescriptor<TResult> = Omit<
  WebMCP.ModelContextTool,
  "execute" | "inputSchema"
> & {
  inputSchema: object;
  execute: WebMcpToolExecutor<TResult>;
};

export type EmptyToolInput = Record<string, never>;

type CheckIngredientsInput = Record<string, unknown> & {
  ingredients: string;
};

type IngredientToolStatus = "ok" | "invalid" | "timeout" | "error";

export interface CheckIngredientsOutput {
  result?: IngredientResult;
  status: IngredientToolStatus;
}

type CheckProductInput = Record<string, unknown> & {
  barcode: string;
};

type ProductToolStatus = "ok" | "invalid" | "not_found" | "timeout" | "error";

export interface CheckProductOutput {
  barcode: string;
  product?: ProductResult;
  sources?: Sources;
  status: ProductToolStatus;
}

export type ScanProductOutput = CheckProductOutput;

export interface HistoryOutput {
  entries: RecentCheck[];
}

export type CheckIngredientsToolInput = CheckIngredientsInput;
export type CheckProductToolInput = CheckProductInput;

export type ToolDescriptor =
  | WebMcpToolDescriptor<CheckIngredientsOutput>
  | WebMcpToolDescriptor<CheckProductOutput>
  | WebMcpToolDescriptor<ScanProductOutput>
  | WebMcpToolDescriptor<HistoryOutput>;
