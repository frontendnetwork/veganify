import type {
  JsonSchemaForInference,
  MaybePromise,
  ModelContext,
  ModelContextTool,
  WebMcpToolAnnotations,
  WebMcpToolInput,
} from "@mcp-b/webmcp-types";

import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";
import type { RecentCheck } from "../../Check/models/recent-check";
import type { IngredientResult } from "../../IngredientsCheck/models/IngredientResult";

export interface ToolExecutionOptions {
  signal?: AbortSignal;
}

export type WebMcpToolExecutor<TInput extends WebMcpToolInput, TResult> = (
  input: TInput,
  options?: ToolExecutionOptions
) => MaybePromise<TResult>;

export type WebMcpToolDescriptor<
  TInput extends WebMcpToolInput,
  TResult,
> = Omit<ModelContextTool<TInput, TResult>, "execute" | "inputSchema"> & {
  inputSchema: JsonSchemaForInference;
  annotations?: WebMcpToolAnnotations;
  execute: WebMcpToolExecutor<TInput, TResult>;
};

export type WebMcpModelContext = Pick<ModelContext, "registerTool">;

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
  | WebMcpToolDescriptor<CheckIngredientsToolInput, CheckIngredientsOutput>
  | WebMcpToolDescriptor<CheckProductToolInput, CheckProductOutput>
  | WebMcpToolDescriptor<ScanProductToolInput, ScanProductOutput>
  | WebMcpToolDescriptor<GetHistoryToolInput, HistoryOutput>;
