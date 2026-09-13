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
        <div className="skeleton-shimmer mx-auto mb-5 h-7 w-3/5 rounded-md" />
        <div className="skeleton-shimmer mb-4 h-16 rounded-xl" />
        {["vegetarian", "palmoil", "nutriscore"].map((row) => (
          <div
            className="flex items-center justify-between border-line border-t py-3"
            key={row}
          >
            <div className="skeleton-shimmer h-5 w-28 rounded" />
            <div className="skeleton-shimmer h-5 w-16 rounded" />
          </div>
        ))}
        <div className="skeleton-shimmer mt-4 h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
