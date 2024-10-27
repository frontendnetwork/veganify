import { test, expect } from "@playwright/test";

test("should relfect entered ingredients", async ({ page }) => {
  await page.goto("/de");
  await page.getByRole("link", { name: "ຐ Zutatencheck" }).nth(1).click();
  await page.getByPlaceholder("Zutaten kommagetrennt eingeben").click();
  await expect(
    page.getByPlaceholder("Zutaten kommagetrennt eingeben")
  ).toBeVisible();
  await page.getByPlaceholder("Zutaten kommagetrennt eingeben").click();
  await page
    .getByPlaceholder("Zutaten kommagetrennt eingeben")
    .fill("Duck, E101, Beet Roots, Carrot");
  await page.getByLabel("Absenden").click();
  await expect(page.getByText("Beet roots")).toBeVisible();
  await expect(page.getByText("Duck")).toBeVisible();
  await expect(page.getByText("E101")).toBeVisible();
  await expect(page.getByText("Carrot")).toBeVisible();
});

test("User should be able to input ingredients and get a result", async ({
  page,
}) => {
  await page.goto("/en/ingredients");

  const inputField = await page.$('textarea[id="ingredients"]');
  await inputField?.fill("Duck");
  const submitButton = await page.$('button[name="checkingredients"]');
  await submitButton?.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });
  const resultText = await page.textContent(".resultborder");
  expect(resultText).toContain("Duck");

  await page.route("**/v0/ingredients/*", (route) => {
    expect(route.request().url()).toBe(
      "https://api.veganify.app/v1/ingredients/Duck"
    );
    expect(route.request().method()).toBe("GET");
  });
});
