"use client";

import { createContext, useContext } from "react";

type ShapeVariant = "pill" | "rounded";

interface ShapeClasses {
  bg: string;
  // Numeric counterparts of `bg` / `mergedBg`, in px. Needed where individual
  // corners are animated (e.g. the selected-background merge/split animation),
  // which requires per-corner numeric border-radii rather than a class.
  bgRadius: number;
  button: string;
  container: string;
  focusRing: string;
  input: string;
  item: string;
  mergedBg: string;
  mergedRadius: number;
  /** The variant these classes belong to — handy for conditionals. */
  variant: ShapeVariant;
}

const shapeMap: Record<ShapeVariant, ShapeClasses> = {
  pill: {
    bg: "rounded-[20px]",
    bgRadius: 20,
    button: "rounded-[20px]",
    container: "rounded-3xl",
    // +2px over `item` because the focus ring sits 2px outside the element
    // (top/left -2, width/height +4); this keeps the corners concentric so a
    // pill element gets a pill ring (matches the rounded-mode 8px→10px bump).
    focusRing: "rounded-[22px]",
    input: "rounded-[20px]",
    item: "rounded-[20px]",
    mergedBg: "rounded-2xl",
    mergedRadius: 16,
    variant: "pill",
  },
  rounded: {
    bg: "rounded-lg",
    bgRadius: 8,
    button: "rounded-lg",
    container: "rounded-xl",
    focusRing: "rounded-[10px]",
    input: "rounded-lg",
    item: "rounded-lg",
    mergedBg: "rounded-lg",
    mergedRadius: 8,
    variant: "rounded",
  },
};

interface ShapeContextValue {
  classes: ShapeClasses;
  setShape: (shape: ShapeVariant) => void;
  shape: ShapeVariant;
}

const ShapeContext = createContext<ShapeContextValue | null>(null);

// Rounded is the default on every path: the shipped :focus-visible fallback
// ring assumes its 8px radius. A consumer with no provider gets the corners
// the docs show.
function useShape(): ShapeClasses {
  const ctx = useContext(ShapeContext);
  if (!ctx) {
    return shapeMap.rounded;
  }
  return ctx.classes;
}

export { useShape };
