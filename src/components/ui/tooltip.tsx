"use client";

import {
  Content as TooltipContent,
  Portal as TooltipPortal,
  Provider as TooltipProvider,
  Root as TooltipRoot,
  Trigger as TooltipTrigger,
} from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

/**
 * Keyboard- and pointer-accessible tooltip on Radix primitives.
 * Opens on focus as well as hover, with a Fluid Functionalism fast tier.
 */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  if (!label) {
    return children;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="bg-surface-2 text-ink shadow-elev-3 z-50 rounded-md px-2.5 py-1.5 text-sm"
            sideOffset={6}
          >
            {label}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
}
