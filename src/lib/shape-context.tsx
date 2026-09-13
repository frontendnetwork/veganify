"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

// Rounded is the default on every path: the site demos render under
// <ShapeProvider defaultShape="rounded">, the shipped :focus-visible fallback
// ring assumes its 8px radius, and the preset generators only emit a provider
// for pill. A consumer with no provider gets the corners the docs show.
function useShape(): ShapeClasses {
  const ctx = useContext(ShapeContext);
  if (!ctx) {
    return shapeMap.rounded;
  }
  return ctx.classes;
}

function useShapeContext() {
  const ctx = useContext(ShapeContext);
  if (!ctx) {
    throw new Error("useShapeContext must be used within a ShapeProvider");
  }
  return ctx;
}

function ShapeProvider({
  children,
  defaultShape = "rounded",
}: {
  children: ReactNode;
  defaultShape?: ShapeVariant;
}) {
  const [shape, setShapeState] = useState<ShapeVariant>(defaultShape);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Run a state change under the `.transitioning` guard (added + reflow-flushed
  // first so the 180ms border-radius cross-fade applies). Clearing the previous
  // timeout first keeps a double-press from removing the class mid-fade.
  const transitionShape = useCallback((callback: () => void) => {
    const root = document.documentElement;
    root.classList.add("transitioning");
    void root.offsetHeight;
    callback();
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(
      () => root.classList.remove("transitioning"),
      200
    );
  }, []);

  const setShape = useCallback(
    (next: ShapeVariant) => {
      transitionShape(() => setShapeState(next));
    },
    [transitionShape]
  );

  // Publish the current element radius as a CSS custom property so plain-CSS
  // consumers that can't read React context stay in sync with the shape
  // system — e.g. the @layer base :focus-visible fallback ring in
  // globals.css. Set on <html> so portalled content sees it too.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shape-input-radius",
      `${shapeMap[shape].bgRadius}px`
    );
  }, [shape]);

  const value = useMemo(
    () => ({ classes: shapeMap[shape], setShape, shape }),
    [shape, setShape]
  );

  return (
    <ShapeContext.Provider value={value}>{children}</ShapeContext.Provider>
  );
}

export type { ShapeClasses, ShapeVariant };
export { ShapeProvider, shapeMap, useShape, useShapeContext };
