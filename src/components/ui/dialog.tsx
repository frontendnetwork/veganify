"use client";

import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";

/**
 * Dialog on Radix primitives (focus trap, aria-modal, Escape, focus return),
 * animated on the Fluid Functionalism spring tiers: `slow` to enter, one
 * tier faster to exit. Bottom sheet on small screens, centered above that.
 */
export function Dialog({
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

  // Track the last focused element while closed, so closing returns focus to
  // the trigger even though these dialogs are controlled without
  // <DialogTrigger>.
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
    <DialogRoot onOpenChange={onOpenChange} open={open}>
      <AnimatePresence>
        {!!open && (
          <DialogPortal forceMount>
            <DialogOverlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-40 bg-black/50 motion-reduce:backdrop-blur-0"
                exit={{ opacity: 0, transition: spring.fast.exit }}
                initial={{ opacity: 0 }}
                transition={spring.fast}
              />
            </DialogOverlay>
            <DialogContent
              aria-modal="true"
              asChild
              forceMount
              onCloseAutoFocus={handleCloseAutoFocus}
            >
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "fixed z-50 flex max-h-[85dvh] w-full flex-col",
                  "inset-x-0 bottom-0 rounded-t-2xl",
                  "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
                  "bg-surface text-ink shadow-elev-4",
                  contentClassName
                )}
                exit={{
                  opacity: 0,
                  transition: spring.moderate.exit,
                  y: 24,
                }}
                initial={{ opacity: 0, y: 64 }}
                transition={spring.slow}
              >
                <div className="flex items-start justify-between gap-4 px-6 pt-6">
                  <DialogTitle className="text-balance font-semibold text-lg">
                    {title}
                  </DialogTitle>
                  <DialogClose
                    aria-label={t("close")}
                    className="fluid-hover -m-2 flex size-9 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </DialogClose>
                </div>
                {!!description && (
                  <DialogDescription className="px-6 pt-1 text-muted text-sm">
                    {description}
                  </DialogDescription>
                )}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-4 pb-6">
                  {children}
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </DialogRoot>
  );
}
