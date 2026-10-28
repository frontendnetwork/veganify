"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { nearestLanguageIndex } from "../utils/nearest-language-index";

interface LanguageItemRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

const LANGUAGE_OPTION_SELECTOR = "a[data-language-option]";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useLanguageFluidHover(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [session, setSession] = useState(0);
  const [itemRects, setItemRects] = useState<LanguageItemRect[]>([]);
  const pointerTypeRef = useRef<string | null>(null);
  const pointerYRef = useRef(0);
  const pointerFrameRef = useRef<number | null>(null);
  const measurementFrameRef = useRef<number | null>(null);

  const getItems = useCallback((): HTMLAnchorElement[] => {
    const container = containerRef.current;
    return container
      ? Array.from(
          container.querySelectorAll<HTMLAnchorElement>(
            LANGUAGE_OPTION_SELECTOR
          )
        )
      : [];
  }, []);

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const nextRects = getItems().map((item) => {
      let top = item.offsetTop;
      let left = item.offsetLeft;
      let ancestor = item.offsetParent as HTMLElement | null;

      while (
        ancestor &&
        ancestor !== container &&
        container.contains(ancestor)
      ) {
        top += ancestor.offsetTop + ancestor.clientTop;
        left += ancestor.offsetLeft + ancestor.clientLeft;
        ancestor = ancestor.offsetParent as HTMLElement | null;
      }

      return {
        height: item.offsetHeight,
        left,
        top,
        width: item.offsetWidth,
      };
    });

    setItemRects((currentRects) => {
      const unchanged =
        currentRects.length === nextRects.length &&
        currentRects.every((rect, index) => {
          const nextRect = nextRects[index];
          return (
            rect.left === nextRect.left &&
            rect.top === nextRect.top &&
            rect.width === nextRect.width &&
            rect.height === nextRect.height
          );
        });
      return unchanged ? currentRects : nextRects;
    });
  }, [getItems]);

  const scheduleMeasure = useCallback(() => {
    if (measurementFrameRef.current !== null) {
      return;
    }

    measurementFrameRef.current = requestAnimationFrame(() => {
      measurementFrameRef.current = null;
      measureItems();
    });
  }, [measureItems]);

  const setActive = useCallback((nextIndex: number | null) => {
    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex
    );
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!(isOpen && container)) {
      return;
    }

    measureItems();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleMeasure);
    if (observer) {
      observer.observe(container);
      for (const item of getItems()) {
        observer.observe(item);
      }
    } else {
      window.addEventListener("resize", scheduleMeasure);
    }

    return () => {
      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("resize", scheduleMeasure);
      }
      if (measurementFrameRef.current !== null) {
        cancelAnimationFrame(measurementFrameRef.current);
        measurementFrameRef.current = null;
      }
    };
  }, [getItems, isOpen, measureItems, scheduleMeasure]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    pointerTypeRef.current = null;
    setActiveIndex(null);

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
  }, [isOpen]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
      if (measurementFrameRef.current !== null) {
        cancelAnimationFrame(measurementFrameRef.current);
      }
    },
    []
  );

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerTypeRef.current = event.pointerType;
      if (isOpen && event.pointerType === "mouse") {
        setSession((currentSession) => currentSession + 1);
      }
    },
    [isOpen]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerTypeRef.current = event.pointerType;
      if (!isOpen || event.pointerType !== "mouse") {
        setActive(null);
        return;
      }

      pointerYRef.current = event.clientY;
      if (pointerFrameRef.current !== null) {
        return;
      }

      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = null;
        const container = containerRef.current;
        if (!(container && isOpen)) {
          return;
        }

        const rects = getItems().map((item) => {
          const rect = item.getBoundingClientRect();
          return { height: rect.height, top: rect.top };
        });
        setActive(nearestLanguageIndex(rects, pointerYRef.current));
      });
    },
    [getItems, isOpen, setActive]
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerTypeRef.current = event.pointerType;
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
        pointerFrameRef.current = null;
      }
      setActive(null);
    },
    [setActive]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerTypeRef.current = event.pointerType;
      if (event.pointerType !== "mouse") {
        setActive(null);
      }
    },
    [setActive]
  );

  const handleFocusCapture = useCallback(() => {
    setActive(null);
  }, [setActive]);

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const nativeEvent = event.nativeEvent as MouseEvent & {
        pointerType?: string;
      };
      const pointerType = nativeEvent.pointerType ?? pointerTypeRef.current;
      if (
        !isOpen ||
        pointerType !== "mouse" ||
        event.detail === 0 ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element) ||
        event.target.closest(LANGUAGE_OPTION_SELECTOR)
      ) {
        return;
      }

      const items = getItems();
      const rects = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { height: rect.height, top: rect.top };
      });
      const nearestIndex = nearestLanguageIndex(rects, event.clientY);
      if (nearestIndex === null) {
        return;
      }

      setActive(nearestIndex);
      items[nearestIndex]?.click();
    },
    [getItems, isOpen, setActive]
  );

  return {
    activeIndex: isOpen ? activeIndex : null,
    activeRect:
      isOpen && activeIndex !== null ? (itemRects[activeIndex] ?? null) : null,
    containerRef,
    handlers: {
      onClick: handleClick,
      onFocusCapture: handleFocusCapture,
      onPointerDown: handlePointerDown,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerMove: handlePointerMove,
    },
    session,
  };
}
