import { describe, expect, test } from "bun:test";
import { nearestLanguageIndex } from "./nearest-language-index";

const rects = [
  { height: 40, top: 100 },
  { height: 40, top: 144 },
  { height: 40, top: 188 },
];

describe("nearestLanguageIndex", () => {
  test("returns null for an empty list", () => {
    expect(nearestLanguageIndex([], 120)).toBeNull();
  });

  test("prefers the row containing the pointer", () => {
    expect(nearestLanguageIndex(rects, 120)).toBe(0);
    expect(nearestLanguageIndex(rects, 150)).toBe(1);
    expect(nearestLanguageIndex(rects, 228)).toBe(2);
  });

  test("chooses the nearest row in a gap", () => {
    expect(nearestLanguageIndex(rects, 142)).toBe(0);
    expect(nearestLanguageIndex(rects, 143)).toBe(1);
  });

  test("keeps the first row when distances tie", () => {
    expect(nearestLanguageIndex(rects.slice(0, 2), 142)).toBe(0);
  });

  test("clamps points above and below the list to the nearest edge row", () => {
    expect(nearestLanguageIndex(rects, 0)).toBe(0);
    expect(nearestLanguageIndex(rects, 500)).toBe(2);
  });
});
