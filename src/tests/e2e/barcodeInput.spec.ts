import { test, expect } from "@playwright/test";

test("should give out product information after entering barcode", async ({
  page,
}) => {
  await page.goto("/de");
  await expect(page.getByPlaceholder("Barcode eingeben")).toBeVisible();
  await page.getByPlaceholder("Barcode eingeben").click();
  await page.getByPlaceholder("Barcode eingeben").fill("4066600204404");
  await page.getByLabel("Absenden").click();
  await expect(page.getByText("Vegan")).toBeVisible();
});

test("User should be able to input a barcode via the URL parameter `ean` ", async ({
  page,
}) => {
  await page.route("**/v0/product/*", (route) => {
    expect(route.request().url()).toMatch(
      /^https:\/\/(api|staging\.api)\.veganify\.app\/v0\/product\/4066600204404$/
    );
    expect(route.request().method()).toBe("POST");
  });

  await page.goto("/en?ean=4066600204404");
  const inputField = await page.waitForSelector('input[name="barcode"]');
  const inputValue = await inputField.inputValue();
  expect(inputValue).toBe("4066600204404");

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});
