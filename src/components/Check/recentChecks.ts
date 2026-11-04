import type { RecentCheck as RecentCheckModel } from "./models/recent-check";

export type { RecentCheck } from "./models/recent-check";

const STORAGE_KEY = "recentChecks";
const MAX_ENTRIES = 5;

export function loadRecentChecks(): RecentCheckModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is RecentCheckModel =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as RecentCheckModel).ean === "string" &&
        typeof (entry as RecentCheckModel).name === "string"
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

export function rememberCheck(entry: RecentCheckModel): void {
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
