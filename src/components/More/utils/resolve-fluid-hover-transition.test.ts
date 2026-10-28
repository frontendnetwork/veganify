import { describe, expect, test } from "bun:test";
import { spring } from "@/lib/springs";
import { resolveFluidHoverTransition } from "./resolve-fluid-hover-transition";

describe("resolveFluidHoverTransition", () => {
  test("snaps travel but keeps the opacity fade for reduced motion", () => {
    expect(resolveFluidHoverTransition(true)).toEqual({
      duration: 0,
      opacity: { duration: spring.fast.duration },
      type: "tween",
    });
  });

  test("uses the fast spring for pointer travel", () => {
    expect(resolveFluidHoverTransition(false)).toEqual({
      ...spring.fast,
      opacity: { duration: spring.fast.duration },
    });
  });
});
