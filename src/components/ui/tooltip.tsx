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
            className="z-50 rounded-md bg-surface-2 px-2.5 py-1.5 text-ink text-sm shadow-elev-3"
            sideOffset={6}
          >
            {label}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
}
