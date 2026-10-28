import { afterEach, describe, expect, test } from "bun:test";

import type { WebMCP } from "@mcp-b/webmcp-types";

import { getModelContext } from "./model-context";

const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "document"
);
const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "navigator"
);

const context: WebMCP.ModelContext = Object.assign(new EventTarget(), {
  executeTool: async (): Promise<string> => "",
  getTools: async (): Promise<WebMCP.RegisteredTool[]> => [],
  ontoolchange: null,
  registerTool: (
    _tool: WebMCP.ModelContextTool,
    _options?: WebMCP.ModelContextRegisterToolOptions
  ): Promise<void> => Promise.resolve(),
});

const installBrowserGlobals = (
  documentContext?: WebMCP.ModelContext,
  navigatorContext?: WebMCP.ModelContext
): void => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: documentContext ? { modelContext: documentContext } : {},
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: navigatorContext ? { modelContext: navigatorContext } : {},
  });
};

afterEach(() => {
  if (originalDocumentDescriptor) {
    Object.defineProperty(globalThis, "document", originalDocumentDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, "document");
  }
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, "navigator", originalNavigatorDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, "navigator");
  }
});

describe("model context detection", () => {
  test("prefers the canonical document context", () => {
    const navigatorContext = {} as WebMCP.ModelContext;
    installBrowserGlobals(context, navigatorContext);

    expect(getModelContext()).toBe(context);
  });

  test("falls back to the deprecated navigator context", () => {
    installBrowserGlobals(undefined, context);

    expect(getModelContext()).toBe(context);
  });

  test("falls back to navigator when the document getter throws", () => {
    const throwingDocument = Object.defineProperty({}, "modelContext", {
      get: () => {
        throw new Error("document context is unavailable");
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: throwingDocument,
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { modelContext: context },
    });

    expect(getModelContext()).toBe(context);
  });

  test("returns undefined when the navigator getter throws", () => {
    const throwingNavigator = Object.defineProperty({}, "modelContext", {
      get: () => {
        throw new Error("navigator context is unavailable");
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {},
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: throwingNavigator,
    });

    expect(getModelContext()).toBeUndefined();
  });

  test("returns undefined when neither native context exists", () => {
    installBrowserGlobals();

    expect(getModelContext()).toBeUndefined();
  });

  test("guards environments without document or navigator", () => {
    Reflect.deleteProperty(globalThis, "document");
    Reflect.deleteProperty(globalThis, "navigator");

    expect(getModelContext()).toBeUndefined();
  });
});
