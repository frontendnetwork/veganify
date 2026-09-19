import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { loadRecentChecks, rememberCheck } from "./recentChecks";

const originalStorageDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage"
);

interface TestStorage {
  data: Map<string, string>;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

const installStorage = (initial: Record<string, string> = {}): TestStorage => {
  const storage: TestStorage = {
    data: new Map(Object.entries(initial)),
    getItem(key) {
      return this.data.get(key) ?? null;
    },
    removeItem(key) {
      this.data.delete(key);
    },
    setItem(key, value) {
      this.data.set(key, value);
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
  return storage;
};

beforeEach(() => {
  installStorage();
});

afterEach(() => {
  if (originalStorageDescriptor) {
    Object.defineProperty(
      globalThis,
      "localStorage",
      originalStorageDescriptor
    );
  } else {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
});

describe("recentChecks", () => {
  test("returns an empty list for empty storage", () => {
    expect(loadRecentChecks()).toEqual([]);
  });

  test("keeps only entries with the existing shape", () => {
    installStorage({
      recentChecks: JSON.stringify([
        { ean: "12345678", name: "Valid" },
        { ean: "missing-name" },
        { ean: 12_345_678, name: "wrong ean type" },
        null,
      ]),
    });

    expect(loadRecentChecks()).toEqual([{ ean: "12345678", name: "Valid" }]);
  });

  test("returns an empty list for corrupt JSON and unavailable storage", () => {
    installStorage({ recentChecks: "{" });
    expect(loadRecentChecks()).toEqual([]);

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("storage unavailable");
      },
    });
    expect(loadRecentChecks()).toEqual([]);
  });

  test("preserves the five-entry newest-first behavior", () => {
    const storage = installStorage({
      recentChecks: JSON.stringify([
        { ean: "1", name: "One" },
        { ean: "2", name: "Two" },
        { ean: "3", name: "Three" },
        { ean: "4", name: "Four" },
        { ean: "5", name: "Five" },
      ]),
    });

    rememberCheck({ ean: "3", name: "Updated three" });
    rememberCheck({ ean: "6", name: "Six" });

    expect(JSON.parse(storage.data.get("recentChecks") ?? "null")).toEqual([
      { ean: "6", name: "Six" },
      { ean: "3", name: "Updated three" },
      { ean: "1", name: "One" },
      { ean: "2", name: "Two" },
      { ean: "4", name: "Four" },
    ]);
  });

  test("ignores write failures", () => {
    const storage = installStorage();
    storage.removeItem = () => {
      throw new Error("remove failed");
    };
    storage.setItem = () => {
      throw new Error("write failed");
    };

    expect(() => rememberCheck({ ean: "1", name: "One" })).not.toThrow();
  });
});
