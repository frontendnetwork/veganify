import type { WebMCP } from "@mcp-b/webmcp-types";

import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";
import type { RecentCheck } from "../../Check/models/recent-check";
import type { IngredientResult } from "../../IngredientsCheck/models/IngredientResult";

export interface ToolExecutionOptions {
  signal?: AbortSignal;
}

export type WebMcpToolExecutor<TResult> = (
  input: unknown,
  options?: ToolExecutionOptions
) => WebMCP.MaybePromise<TResult>;

export type WebMcpToolDescriptor<TResult> = Omit<
  WebMCP.ModelContextTool,
  "execute" | "inputSchema"
> & {
  inputSchema: object;
  execute: WebMcpToolExecutor<TResult>;
};

export type WebMcpModelContext = Pick<WebMCP.ModelContext, "registerTool">;

export type EmptyToolInput = Record<string, never>;

export type CheckIngredientsInput = Record<string, unknown> & {
  ingredients: string;
};

export type IngredientToolStatus = "ok" | "invalid" | "timeout" | "error";

export interface CheckIngredientsOutput {
  result?: IngredientResult;
  status: IngredientToolStatus;
}

export type CheckProductInput = Record<string, unknown> & {
  barcode: string;
};

export type ProductToolStatus =
  | "ok"
  | "invalid"
  | "not_found"
  | "timeout"
  | "error";

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

export type ScanProductToolInput = EmptyToolInput;
export type CheckIngredientsToolInput = CheckIngredientsInput;
export type CheckProductToolInput = CheckProductInput;
export type GetHistoryToolInput = EmptyToolInput;

export type ToolDescriptor =
  | WebMcpToolDescriptor<CheckIngredientsOutput>
  | WebMcpToolDescriptor<CheckProductOutput>
  | WebMcpToolDescriptor<ScanProductOutput>
  | WebMcpToolDescriptor<HistoryOutput>;
