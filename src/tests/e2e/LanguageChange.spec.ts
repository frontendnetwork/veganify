import { expect, test } from "@playwright/test";

test("language change should work", async ({ page }) => {
  await page.goto("/de/more");
  await page.getByText("Sprache").click();
  await page.getByRole("link", { name: "Englisch" }).click();
  await expect(page).toHaveURL(/\/en\/more$/);
});

test("language hover fills gaps and routes a gap click to the nearest locale", async ({
  page,
}) => {
  await page.goto("/en/more");
  await page.getByRole("button", { name: "Language" }).click();
  await expect(page.getByRole("dialog")).toHaveCSS("opacity", "1");

  const english = page.getByRole("link", { name: "English (current)" });
  const german = page.getByRole("link", { name: "German" });
  const list = german.locator("..");
  const englishBounds = await english.boundingBox();
  const germanBounds = await german.boundingBox();

  if (!(englishBounds && germanBounds)) {
    throw new Error("Language options are not visible");
  }

  const gap = germanBounds.y - (englishBounds.y + englishBounds.height);
  expect(gap).toBeGreaterThan(0);

  const pointerX = englishBounds.x + englishBounds.width / 2;
  const gapY = englishBounds.y + englishBounds.height + gap * 0.75;
  expect(gap).toBeLessThan(8);
  await page.mouse.move(pointerX, gapY);
  await expect(list).toHaveAttribute("data-fluid-hover-active-index", "1");
  expect(
    await page.evaluate(
      ({ x, y }) =>
        Boolean(
          document.elementFromPoint(x, y)?.closest("a[data-language-option]")
        ),
      { x: pointerX, y: gapY }
    )
  ).toBe(false);
  await page.evaluate(
    ({ x, y }) => {
      document.elementFromPoint(x, y)?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          button: 0,
          cancelable: true,
          clientX: x,
          clientY: y,
          ctrlKey: true,
          detail: 1,
        })
      );
    },
    { x: pointerX, y: gapY }
  );
  await expect(page).toHaveURL(/\/en\/more$/);

  await page.mouse.click(pointerX, gapY);
  await expect(page).toHaveURL(/\/de\/more$/);
});

test("modified locale links preserve native new-tab behavior", async ({
  context,
  page,
}) => {
  await page.goto("/en/more");
  await page.getByRole("button", { name: "Language" }).click();
  const german = page.getByRole("link", { name: "German" });
  const modifier = process.platform === "darwin" ? "Meta" : "Control";
  const popupPromise = context.waitForEvent("page");
  await german.click({ modifiers: [modifier] });
  const popup = await popupPromise;

  await expect(page).toHaveURL(/\/en\/more$/);
  await expect(popup).toHaveURL(/\/de\/more$/);
  await popup.close();
});

test("clears pointer hover on close and keeps keyboard focus visible", async ({
  page,
}) => {
  await page.goto("/en/more");
  const trigger = page.getByRole("button", { name: "Language" });
  await trigger.click();

  const english = page.getByRole("link", { name: "English (current)" });
  const german = page.getByRole("link", { name: "German" });
  const list = german.locator("..");
  await german.hover();
  await expect(list).toHaveAttribute("data-fluid-hover-active-index", "1");

  await page.getByRole("button", { name: "Close" }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  expect(await list.getAttribute("data-fluid-hover-active-index")).toBeNull();

  await page.keyboard.press("Tab");
  await expect(english).toBeFocused();
  expect(
    await english.evaluate((node) => getComputedStyle(node).outlineStyle)
  ).toBe("solid");
});

test("re-measures language hover after responsive reflow with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/en/more");
  await page.getByRole("button", { name: "Language" }).click();

  const english = page.getByRole("link", { name: "English (current)" });
  const german = page.getByRole("link", { name: "German" });
  const list = german.locator("..");
  const highlight = page.locator('[data-slot="fluid-hover-highlight"]').last();
  await english.hover();
  await expect(list).toHaveAttribute("data-fluid-hover-active-index", "0");
  await german.hover();
  await expect(list).toHaveAttribute("data-fluid-hover-active-index", "1");
  const snappedToGerman = await page.evaluate(async () => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve())
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve())
    );
    const highlightElement = document.querySelector<HTMLElement>(
      '[data-slot="fluid-hover-highlight"]'
    );
    const [, germanOption] = document.querySelectorAll<HTMLElement>(
      "a[data-language-option]"
    );
    if (!(highlightElement && germanOption)) {
      return false;
    }
    const highlightBounds = highlightElement.getBoundingClientRect();
    const rowBounds = germanOption.getBoundingClientRect();
    return (
      Math.abs(highlightBounds.x - rowBounds.x) < 1.5 &&
      Math.abs(highlightBounds.y - rowBounds.y) < 1.5
    );
  });
  expect(snappedToGerman).toBe(true);

  await page.setViewportSize({ height: 900, width: 1280 });
  const germanBounds = await german.boundingBox();
  if (!germanBounds) {
    throw new Error("German language option is not visible");
  }
  await page.mouse.move(
    germanBounds.x + germanBounds.width / 2,
    germanBounds.y + germanBounds.height / 2
  );
  await expect(list).toHaveAttribute("data-fluid-hover-active-index", "1");
  await expect
    .poll(async () => {
      const highlightBounds = await highlight.boundingBox();
      const rowBounds = await german.boundingBox();
      return (
        !!highlightBounds &&
        !!rowBounds &&
        Math.abs(highlightBounds.x - rowBounds.x) < 1.5 &&
        Math.abs(highlightBounds.y - rowBounds.y) < 1.5 &&
        Math.abs(highlightBounds.width - rowBounds.width) < 1.5 &&
        Math.abs(highlightBounds.height - rowBounds.height) < 1.5
      );
    })
    .toBe(true);
});
