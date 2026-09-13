"use client";

import {
  Root as SwitchRoot,
  Thumb as SwitchThumb,
} from "@radix-ui/react-switch";
import { animate, motion, type Transition, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";

interface SwitchProps {
  "aria-label": string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  thumbTransition?: Transition;
}

// Track/thumb geometry from the Fluid Functionalism switch. The hover
// pill-extend and press squash give the thumb a fluid, physical feel.
const METRICS = {
  pillExtend: 2,
  pressExtend: 4,
  pressShrink: 4,
  thumbSize: 16,
  trackHeight: 20,
  trackWidth: 34,
} as const;

const THUMB_OFFSET = 2;
const DRAG_DEAD_ZONE = 2;

export function Switch({
  checked,
  onToggle,
  disabled = false,
  thumbTransition,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const hasMounted = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const thumbTravel = METRICS.trackWidth - METRICS.thumbSize - THUMB_OFFSET * 2;

  // Drag refs (not state to avoid re-renders during drag)
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const pointerStart = useRef<{ clientX: number; originX: number } | null>(
    null
  );

  const motionX = useMotionValue(
    checked ? THUMB_OFFSET + thumbTravel : THUMB_OFFSET
  );
  const mounted = hasMounted.current;

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  // Compute thumb shape
  let thumbWidth = METRICS.thumbSize;
  if (pressed) {
    thumbWidth = METRICS.thumbSize + METRICS.pressExtend;
  } else if (hovered) {
    thumbWidth = METRICS.thumbSize + METRICS.pillExtend;
  }
  const thumbHeight = pressed
    ? METRICS.thumbSize - METRICS.pressShrink
    : METRICS.thumbSize;
  const thumbY = pressed
    ? THUMB_OFFSET + METRICS.pressShrink / 2
    : THUMB_OFFSET;
  const extraWidth = thumbWidth - METRICS.thumbSize;
  const thumbX = checked
    ? THUMB_OFFSET + thumbTravel - extraWidth
    : THUMB_OFFSET;

  // Sync motionX when thumbX changes (hover/press/checked) and not dragging
  useEffect(() => {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is mutated by pointer callbacks below
    if (dragging.current) {
      return;
    }
    // biome-ignore lint/suspicious/noUnnecessaryConditions: set by the mount effect below
    if (hasMounted.current) {
      animate(motionX, thumbX, thumbTransition ?? spring.moderate);
    } else {
      motionX.set(thumbX);
    }
  }, [thumbX, motionX, thumbTransition]);

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") {
        setHovered(true);
      }
    },
    []
  );

  const handlePointerLeave = useCallback(() => setHovered(false), []);

  const handleClick = useCallback(() => {
    if (disabled || didDrag.current) {
      return;
    }
    onToggle();
  }, [disabled, onToggle]);

  const stopPropagation = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handleCheckedChange = useCallback(() => {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is mutated by the pointer drag handlers
    if (didDrag.current) {
      return;
    }
    onToggle();
  }, [onToggle]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      setPressed(true);
      dragging.current = false;
      didDrag.current = false;
      pointerStart.current = {
        clientX: event.clientX,
        originX: motionX.get(),
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [disabled, motionX]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerStart.current) {
        return;
      }
      const delta = event.clientX - pointerStart.current.clientX;

      // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is mutated by pointer callbacks below
      if (!dragging.current) {
        if (Math.abs(delta) < DRAG_DEAD_ZONE) {
          return;
        }
        dragging.current = true;
      }

      const dragMin = THUMB_OFFSET;
      const pressedThumbWidth = METRICS.thumbSize + METRICS.pressExtend;
      const dragMax = METRICS.trackWidth - THUMB_OFFSET - pressedThumbWidth;
      const rawX = pointerStart.current.originX + delta;
      motionX.set(Math.max(dragMin, Math.min(dragMax, rawX)));
    },
    [motionX]
  );

  const handlePointerUp = useCallback(() => {
    const start = pointerStart.current;
    if (!start) {
      return;
    }
    setPressed(false);

    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is mutated by pointer callbacks below
    if (dragging.current) {
      didDrag.current = true;
      dragging.current = false;

      const currentX = motionX.get();
      const dragMin = THUMB_OFFSET;
      const pressedThumbWidth = METRICS.thumbSize + METRICS.pressExtend;
      const dragMax = METRICS.trackWidth - THUMB_OFFSET - pressedThumbWidth;
      const midpoint = (dragMin + dragMax) / 2;

      const shouldBeOn = currentX > midpoint;

      if (shouldBeOn === checked) {
        const snapTarget = checked ? THUMB_OFFSET + thumbTravel : THUMB_OFFSET;
        animate(motionX, snapTarget, thumbTransition ?? spring.moderate);
      } else {
        onToggle();
      }

      requestAnimationFrame(() => {
        didDrag.current = false;
      });
    }

    pointerStart.current = null;
  }, [checked, onToggle, motionX, thumbTransition, thumbTravel]);

  const handlePointerCancel = useCallback(() => {
    const start = pointerStart.current;
    if (!start) {
      return;
    }
    setPressed(false);

    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is mutated by pointer callbacks below
    if (dragging.current) {
      dragging.current = false;
      const snapTarget = checked ? THUMB_OFFSET + thumbTravel : THUMB_OFFSET;
      animate(motionX, snapTarget, thumbTransition ?? spring.moderate);
    }

    pointerStart.current = null;
  }, [checked, motionX, thumbTransition, thumbTravel]);

  return (
    <div
      className={cn(
        "relative z-10 flex cursor-pointer touch-none select-none items-center",
        disabled && "pointer-events-none opacity-50"
      )}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      <SwitchRoot
        aria-label={ariaLabel}
        checked={checked}
        className={cn(
          "relative shrink-0 cursor-pointer rounded-full border outline-none",
          "transition-colors duration-80",
          checked
            ? "border-transparent bg-accent hover:bg-accent-hover"
            : "border-line-strong bg-surface-2 hover:bg-surface"
        )}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        onClick={stopPropagation}
        style={{ height: METRICS.trackHeight, width: METRICS.trackWidth }}
        tabIndex={0}
      >
        <SwitchThumb asChild>
          <motion.span
            animate={{
              height: thumbHeight,
              width: thumbWidth,
              y: thumbY,
            }}
            className="absolute top-0 left-0 block rounded-full bg-white shadow-sm"
            initial={false}
            style={{ x: motionX }}
            transition={
              // biome-ignore lint/suspicious/noUnnecessaryConditions: set by the mount effect above
              mounted ? (thumbTransition ?? spring.moderate) : { duration: 0 }
            }
          />
        </SwitchThumb>
      </SwitchRoot>
    </div>
  );
}
