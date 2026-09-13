"use client";

import { createContext, useContext } from "react";

type SizeVariant = "default" | "compact";

interface SizeClasses {
  /** Bounded control height — buttons, inputs, select triggers, subtle tabs —
   *  AND list/menu rows (select options, dropdown, checkbox and radio rows).
   *  One token by design: a popup row lines up with the trigger that opened
   *  it because they share this height. */
  control: string;
  /** `control` as a number, for consumers that need raw pixels. */
  controlHeight: number;
  /** Gap between an icon / control glyph and its label, and between
   *  neighbouring controls in a row (toolbars, filter bars, button
   *  clusters). Density is spacing as much as control height, so the
   *  compact step halves it. */
  gap: string;
  /** Glyph size in px: leading/trailing icons inside controls, and the
   *  checkbox square / radio circle. */
  icon: number;
  /** Horizontal padding of list/menu rows, which sit inside a padded popup
   *  or group and need less inset than a bounded control. */
  itemPx: string;
  /** Horizontal padding of bounded controls (select trigger, inputs). */
  px: string;
  /** Tab trigger height inside a padded segmented list. Sized so
   *  `segmentPad` + `segmentItem` adds back up to the control height —
   *  the segmented control's outer box stays on the same ladder. */
  segmentItem: string;
  /** Padding of the segmented list around its tabs. */
  segmentPad: string;
  /** Body text inside controls. */
  text: string;
  /** The variant these classes belong to — handy for conditionals. */
  variant: SizeVariant;
}

const sizeMap: Record<SizeVariant, SizeClasses> = {
  // 28px — the compact height for dense surfaces: filter bars, toolbars,
  // table headers, sidebars. One step down in text (12px) and icon (14px)
  // so the whole control shrinks together, not just its box.
  compact: {
    control: "h-7",
    controlHeight: 28,
    gap: "gap-1",
    icon: 14,
    itemPx: "px-1.5",
    px: "px-2.5",
    segmentItem: "h-6",
    segmentPad: "p-0.5",
    text: "text-[12px]",
    variant: "compact",
  },
  // 36px — the default control height. Matches a 13px label with comfortable
  // breathing room and keeps controls a workable pointer target.
  default: {
    control: "h-9",
    controlHeight: 36,
    gap: "gap-2",
    icon: 16,
    itemPx: "px-2",
    px: "px-3",
    segmentItem: "h-7",
    segmentPad: "p-1",
    text: "text-[13px]",
    variant: "default",
  },
};

interface SizeContextValue {
  classes: SizeClasses;
  setSize: (size: SizeVariant) => void;
  size: SizeVariant;
}

const SizeContext = createContext<SizeContextValue | null>(null);

/** Resolve the active size variant: explicit prop > provider > "default". */
function useSizeVariant(override?: SizeVariant | null): SizeVariant {
  const ctx = useContext(SizeContext);
  return override ?? ctx?.size ?? "default";
}

/** Resolve size classes: explicit prop > provider > "default". */
function useSize(override?: SizeVariant | null): SizeClasses {
  return sizeMap[useSizeVariant(override)];
}

export type { SizeVariant };
export { useSize, useSizeVariant };
