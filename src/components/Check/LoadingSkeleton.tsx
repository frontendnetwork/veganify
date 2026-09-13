"use client";

/**
 * Content skeleton mirroring the result layout. The shimmer is decorative
 * and suppressed under reduced motion; the live region in the orchestrator
 * carries the "searching" announcement for assistive tech.
 */
export function LoadingSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-elev-2 sm:p-6">
        <div className="mx-auto mb-5 h-7 w-3/5 rounded-md bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer" />
        <div className="mb-4 h-16 rounded-xl bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer" />
        {["vegetarian", "palmoil", "nutriscore"].map((row) => (
          <div
            className="flex items-center justify-between border-line border-t py-3"
            key={row}
          >
            <div className="h-5 w-28 rounded bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer" />
            <div className="h-5 w-16 rounded bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer" />
          </div>
        ))}
        <div className="mt-4 h-11 w-full rounded-lg bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-surface-2 motion-safe:animate-shimmer" />
      </div>
    </div>
  );
}
