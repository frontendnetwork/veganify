import { afterEach, describe, expect, test } from "bun:test";

import type { ModelContext } from "@mcp-b/webmcp-types";

import { getModelContext } from "./model-context";

const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "document"
);
const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "navigator"
);

const context = {} as ModelContext;

const installBrowserGlobals = (
  documentContext?: ModelContext,
  navigatorContext?: ModelContext
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
    const navigatorContext = {} as ModelContext;
    installBrowserGlobals(context, navigatorContext);

    expect(getModelContext()).toBe(context);
  });

  test("falls back to the deprecated navigator context", () => {
    installBrowserGlobals(undefined, context);

    expect(getModelContext()).toBe(context);
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
