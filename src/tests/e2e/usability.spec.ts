import { test, expect } from "@playwright/test";

test("User should be able to input a barcode and get a result", async ({
  page,
}) => {
  await page.goto("/en");

  const inputField = await page.$('input[name="barcode"]');
  await inputField?.fill("4066600204404");
  const submitButton = await page.$('button[name="submit"]');
  await submitButton?.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});
