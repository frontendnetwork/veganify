import { test, expect } from "@playwright/test";

test("language change should work", async ({ page }) => {
  await page.goto("/de/more");
  await page.getByText("Sprache").click();
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("link", { name: "Englisch" }).click(),
  ]);
  expect(page.url()).toMatch("/en/more");
});
