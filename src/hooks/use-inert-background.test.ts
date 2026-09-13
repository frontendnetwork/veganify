import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

// bun's test runner does not apply a DOM environment automatically; give the
// module under test a real document via happy-dom before importing it.
const testWindow = new Window();
globalThis.document = testWindow.document as unknown as Document;

import {
  acquireInertBackground,
  releaseInertBackground,
} from "./use-inert-background";

const nextMicrotask = async (): Promise<void> => {
  await Promise.resolve();
};

interface Fixture {
  background: HTMLDivElement;
  dialogHost: HTMLDivElement;
  script: HTMLScriptElement;
}

let fixture: Fixture | null = null;

describe("use-inert-background primitives", () => {
  beforeEach(() => {
    const dialogHost = document.createElement("div");
    dialogHost.setAttribute("role", "dialog");
    const background = document.createElement("div");
    const script = document.createElement("script");
    document.body.append(background, script, dialogHost);
    fixture = { background, dialogHost, script };
  });

  afterEach(() => {
    const current = fixture;
    fixture = null;
    if (current) {
      current.background.remove();
      current.dialogHost.remove();
      current.script.remove();
    }
  });

  test("inerts background but not dialogs or scripts", async () => {
    const { background, dialogHost, script } = fixture as Fixture;

    acquireInertBackground();
    await nextMicrotask();

    expect(background.hasAttribute("inert")).toBe(true);
    expect(dialogHost.hasAttribute("inert")).toBe(false);
    expect(script.hasAttribute("inert")).toBe(false);

    releaseInertBackground();
    expect(background.hasAttribute("inert")).toBe(false);
  });

  test("keeps background inerted until the last nested release", async () => {
    const { background } = fixture as Fixture;

    acquireInertBackground();
    await nextMicrotask();

    acquireInertBackground();
    releaseInertBackground();
    expect(background.hasAttribute("inert")).toBe(true);

    releaseInertBackground();
    expect(background.hasAttribute("inert")).toBe(false);
  });

  test("release before the collect microtask leaves nothing inerted", async () => {
    const { background } = fixture as Fixture;

    acquireInertBackground();
    releaseInertBackground();
    await nextMicrotask();

    expect(background.hasAttribute("inert")).toBe(false);
  });

  test("acquire after a full release collects again", async () => {
    const { background } = fixture as Fixture;

    acquireInertBackground();
    await nextMicrotask();
    releaseInertBackground();

    acquireInertBackground();
    await nextMicrotask();
    expect(background.hasAttribute("inert")).toBe(true);

    releaseInertBackground();
    expect(background.hasAttribute("inert")).toBe(false);
  });
});
