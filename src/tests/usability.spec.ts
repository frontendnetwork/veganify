import { test, expect } from "@playwright/test";

test("User should be able to input a barcode and get a result", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/en");

  const inputField = await page.$('input[name="barcode"]');
  await inputField?.type("4066600204404");
  const submitButton = await page.$('button[name="submit"]');
  await submitButton?.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});

test("User should be able to input ingredients and get a result", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/en/ingredients");

  const inputField = await page.$('textarea[id="ingredients"]');
  await inputField?.type("Duck");
  const submitButton = await page.$('button[name="checkingredients"]');
  await submitButton?.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });
  const resultText = await page.textContent(".resultborder");
  expect(resultText).toContain("Duck");

  await page.route("**/v0/ingredients/*", (route) => {
    expect(route.request().url()).toBe(
      "https://api.veganify.app/v0/ingredients/Duck"
    );
    expect(route.request().method()).toBe("GET");
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        code: "OK",
        status: "200",
        message: "Success",
        data: {
          vegan: "false",
          flagged: ["duck"],
        },
      }),
    });
  });
});

test("User should be able to input a barcode via the URL parameter `ean` ", async ({
  page,
}) => {
  await page.route("**/v0/product/*", (route) => {
    expect(route.request().url()).toMatch(
      /^https:\/\/(api|staging\.api)\.veganify\.app\/v0\/product\/4066600204404$/
    );
    expect(route.request().method()).toBe("POST");
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: 200,
        product: {
          productname: "Paulaner Spezi Zero",
          vegan: "true",
          vegetarian: "true",
          animaltestfree: "n/a",
          palmoil: "false",
          nutriscore: "c",
          grade: "B",
        },
        sources: {
          processed: "false",
          api: "OpenFoodFacts",
          baseuri: "https://world.openfoodfacts.org",
        },
      }),
    });
  });

  await page.goto("http://localhost:3000/en?ean=4066600204404");
  const inputField = await page.waitForSelector('input[name="barcode"]');
  const inputValue = await inputField.inputValue();
  expect(inputValue).toBe("4066600204404");

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});
