"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Dialog as FluidDialog,
} from "./dialog";

/**
 * Veganify's dialog shape (open/title/description) on top of the Fluid
 * Functionalism dialog primitives. The built-in close button is replaced
 * with a translated one.
 */
export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}) {
  const t = useTranslations("Dialog");
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // These dialogs are controlled without a DialogTrigger, so focus return
  // needs our own tracking of the last-focused element before opening.
  useEffect(() => {
    if (open) {
      return;
    }
    const handleFocusIn = () => {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, [open]);

  const handleCloseAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
    returnFocusRef.current?.focus();
  }, []);

  return (
    <FluidDialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={contentClassName}
        onCloseAutoFocus={handleCloseAutoFocus}
        showCloseButton={false}
      >
        <div className="flex items-start justify-between gap-4 pr-8">
          <DialogTitle className="text-balance font-semibold text-lg">
            {title}
          </DialogTitle>
          <DialogClose
            aria-label={t("close")}
            className="fluid-hover absolute top-3 right-3 flex size-9 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink"
          >
            <X aria-hidden="true" className="size-5" />
          </DialogClose>
        </div>
        {description ? (
          <DialogDescription className="pt-1 text-muted text-sm">
            {description}
          </DialogDescription>
        ) : null}
        <div className="pt-4">{children}</div>
      </DialogContent>
    </FluidDialog>
  );
}
