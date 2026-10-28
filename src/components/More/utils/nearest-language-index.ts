export interface VerticalItemRect {
  height: number;
  top: number;
}

/** Picks a containing language row, or the row whose center is nearest. */
export function nearestLanguageIndex(
  rects: readonly VerticalItemRect[],
  pointerY: number
): number | null {
  let closestIndex: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const [index, rect] of rects.entries()) {
    if (pointerY >= rect.top && pointerY <= rect.top + rect.height) {
      return index;
    }

    const distance = Math.abs(pointerY - (rect.top + rect.height / 2));
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}
