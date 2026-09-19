"use client";

import type { ModelContext } from "@mcp-b/webmcp-types";

export function getModelContext(): ModelContext | undefined {
  if (typeof document !== "undefined") {
    try {
      const documentContext = document.modelContext;
      if (documentContext) {
        return documentContext;
      }
    } catch {
      // A host getter may throw while a browser feature is unavailable.
    }
  }

  if (typeof navigator !== "undefined") {
    try {
      return navigator.modelContext;
    } catch {
      // A host getter may throw while a browser feature is unavailable.
    }
  }

  return undefined;
}
