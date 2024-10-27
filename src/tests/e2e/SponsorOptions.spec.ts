import { test, expect } from "@playwright/test";

test("should display sponsoring options", async ({ page }) => {
  await page.goto("de");
  await page.getByRole("link", { name: " Mehr" }).nth(1).click();
  await expect(page.getByText("Kauf uns einen Kaffee")).toBeVisible();
  await page.getByText("Kauf uns einen Kaffee").click();
  await expect(page.getByText("Einmal via Ko-Fi")).toBeVisible();
  await page.getByText("-50€").click();
  await expect(
    page.getByRole("link", { name: " Sponsor on Ko-Fi" })
  ).toBeVisible();
  await page.getByText("Monatlich via GitHub").click();
  await expect(
    page.getByRole("link", { name: " Sponsor on GitHub" })
  ).toBeVisible();
  await page.getByText("Einmalig via PayPal").click();
  await expect(
    page.getByRole("link", { name: " Donate with PayPal" })
  ).toBeVisible();
  await page.getByRole("button", { name: "×" }).click();
});
