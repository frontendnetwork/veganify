"use client";

import { useEffect } from "react";

/**
 * Reference-counted `inert` on background content while a modal dialog is
 * open. Radix hides siblings with `aria-hidden`, but they stay focusable;
 * `inert` removes them from the tab order and interaction for real.
 *
 * Collection is deferred a microtask so the caller's portal (and any dialog
 * opened in the same tick) is mounted before we decide what counts as
 * "background".
 */

const inertedElements: HTMLElement[] = [];
let depth = 0;
let collectScheduled = false;

const isForeground = (element: Element): boolean =>
  element.tagName === "SCRIPT" ||
  element.getAttribute("role") === "dialog" ||
  element.hasAttribute("data-radix-focus-guard") ||
  element.querySelector('[role="dialog"]') !== null;

const releaseElements = (): void => {
  for (const element of inertedElements) {
    element.removeAttribute("inert");
  }
  inertedElements.length = 0;
};

const collect = (): void => {
  collectScheduled = false;
  if (depth === 0) {
    return;
  }
  releaseElements();
  for (const element of document.body.children) {
    if (!isForeground(element)) {
      element.setAttribute("inert", "");
      inertedElements.push(element as HTMLElement);
    }
  }
};

export function acquireInertBackground(): void {
  depth += 1;
  if (!collectScheduled) {
    collectScheduled = true;
    queueMicrotask(collect);
  }
}

export function releaseInertBackground(): void {
  depth = Math.max(0, depth - 1);
  if (depth > 0) {
    return;
  }
  releaseElements();
}

export function useInertBackground(open: boolean): void {
  useEffect(() => {
    if (!open) {
      return;
    }
    acquireInertBackground();
    return () => releaseInertBackground();
  }, [open]);
}
