"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback } from "react";
import { Link } from "@/i18n/navigation";
import type { routing } from "@/i18n/routing";
import { spring } from "@/lib/springs";
import { useLanguageFluidHover } from "./hooks/use-language-fluid-hover";
import { resolveFluidHoverTransition } from "./utils/resolve-fluid-hover-transition";

type LanguageLocale = (typeof routing.locales)[number];

interface LanguageChoice {
  code: LanguageLocale;
  isCurrent: boolean;
  label: string;
}

interface LanguagePickerProps {
  currentLabel: string;
  isOpen: boolean;
  onLocaleChange: (locale: LanguageLocale) => void;
  options: readonly LanguageChoice[];
}

export function LanguagePicker({
  currentLabel,
  isOpen,
  onLocaleChange,
  options,
}: LanguagePickerProps) {
  const hover = useLanguageFluidHover(isOpen);

  return (
    <div
      className="relative isolate flex flex-col gap-1"
      data-fluid-hover-active-index={hover.activeIndex ?? undefined}
      onClick={hover.handlers.onClick}
      onFocusCapture={hover.handlers.onFocusCapture}
      onPointerDown={hover.handlers.onPointerDown}
      onPointerEnter={hover.handlers.onPointerEnter}
      onPointerLeave={hover.handlers.onPointerLeave}
      onPointerMove={hover.handlers.onPointerMove}
      ref={hover.containerRef}
    >
      <LanguageHoverHighlight rect={hover.activeRect} session={hover.session} />
      {options.map((option, index) => (
        <LanguageOptionLink
          active={hover.activeIndex === index}
          currentLabel={currentLabel}
          key={option.code}
          onLocaleChange={onLocaleChange}
          option={option}
        />
      ))}
    </div>
  );
}

function LanguageOptionLink({
  active,
  currentLabel,
  onLocaleChange,
  option,
}: {
  active: boolean;
  currentLabel: string;
  onLocaleChange: (locale: LanguageLocale) => void;
  option: LanguageChoice;
}) {
  const handleClick = useCallback(
    () => onLocaleChange(option.code),
    [onLocaleChange, option.code]
  );

  return (
    <Link
      className="relative z-10 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-medium text-ink text-sm"
      data-fluid-hover-active={active ? "" : undefined}
      data-language-option=""
      href="/more"
      locale={option.code}
      onClick={handleClick}
    >
      {option.label}
      {option.isCurrent ? (
        <>
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          <span className="sr-only-focusable">{currentLabel}</span>
        </>
      ) : null}
    </Link>
  );
}

function LanguageHoverHighlight({
  rect,
  session,
}: {
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  } | null;
  session: number;
}) {
  const transition = resolveFluidHoverTransition(useReducedMotion() ?? false);

  return (
    <AnimatePresence>
      {rect ? (
        <motion.div
          animate={{
            height: rect.height,
            opacity: 1,
            width: rect.width,
            x: rect.left,
            y: rect.top,
          }}
          className="pointer-events-none absolute top-0 left-0 z-0 rounded-lg bg-hover"
          data-slot="fluid-hover-highlight"
          exit={{ opacity: 0, transition: spring.fast.exit }}
          initial={{
            height: rect.height,
            opacity: 0,
            width: rect.width,
            x: rect.left,
            y: rect.top,
          }}
          key={session}
          transition={transition}
        />
      ) : null}
    </AnimatePresence>
  );
}
