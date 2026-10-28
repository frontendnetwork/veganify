import type { Transition } from "motion/react";
import { spring } from "@/lib/springs";

export function resolveFluidHoverTransition(reduceMotion: boolean): Transition {
  const opacity = { duration: spring.fast.duration };
  return reduceMotion
    ? { duration: 0, opacity, type: "tween" }
    : { ...spring.fast, opacity };
}
