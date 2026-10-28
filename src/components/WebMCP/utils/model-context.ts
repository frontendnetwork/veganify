"use client";

import type { WebMCP } from "@mcp-b/webmcp-types";

type NavigatorWithLegacyModelContext = Navigator & {
  readonly modelContext?: WebMCP.ModelContext;
};

export function getModelContext(): WebMCP.ModelContext | undefined {
  if (typeof document !== "undefined") {
    try {
      const documentContext: WebMCP.ModelContext | undefined =
        document.modelContext;
      if (documentContext) {
        return documentContext;
      }
    } catch {
      // A host getter may throw while a browser feature is unavailable.
    }
  }

  if (typeof navigator !== "undefined") {
    try {
      return (navigator as NavigatorWithLegacyModelContext).modelContext;
    } catch {
      // A host getter may throw while a browser feature is unavailable.
    }
  }

  return undefined;
}
