// Motion tokens, taken verbatim from the Fluid Functionalism springs
// registry. Each tier's value is the ENTER transition — a critically
// damped spring, except the largest tier which keeps a little bounce. Its
// `.exit` is the matching EXIT transition — a plain tween, no bounce, one
// tier quicker — so a dismissal reads as crisp and final.
//
//   transition={spring.fast}                              // enter
//   exit={{ opacity: 0, transition: spring.fast.exit }}   // leave
//
// The bigger the thing that moves, the slower the spring. Never hand-write
// a duration — always reach for a tier. All springs respect the OS reduced
// motion setting via <MotionConfig reducedMotion="user"> in the layout.
export const spring = {
  fast: {
    bounce: 0,
    duration: 0.08,
    exit: { duration: 0.06 },
    type: "spring" as const,
  },
  moderate: {
    bounce: 0,
    duration: 0.16,
    exit: { duration: 0.12 },
    type: "spring" as const,
  },
  slow: {
    bounce: 0.12,
    duration: 0.24,
    exit: { duration: 0.16 },
    type: "spring" as const,
  },
} as const;

// Fallback delay (ms) for deferred-unmount timers that guard an exit tween.
export const exitFallbackMs = (tier: { exit: { duration: number } }) =>
  Math.round(tier.exit.duration * 1000) + 100;
