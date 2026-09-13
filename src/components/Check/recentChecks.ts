export type { RecentCheck } from "./models/recent-check";

import type { RecentCheck } from "./models/recent-check";

const STORAGE_KEY = "recentChecks";
const MAX_ENTRIES = 5;

export function loadRecentChecks(): RecentCheck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is RecentCheck =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as RecentCheck).ean === "string" &&
        typeof (entry as RecentCheck).name === "string"
    );
  } catch {
    return [];
  }
}

export function clearRecentChecks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function rememberCheck(entry: RecentCheck): void {
  try {
    const next = [
      entry,
      ...loadRecentChecks().filter((r) => r.ean !== entry.ean),
    ].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode) — recents are a bonus, not a feature.
  }
}
