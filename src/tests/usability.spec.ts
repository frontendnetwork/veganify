import { test, expect } from "@playwright/test";

test("User should be able to load page and change language", async ({
  page,
}) => {
  await page.goto("http://localhost:1030/en");
  await page.click("text=More");
  await expect(page).toHaveURL("http://localhost:1030/more");
  await page.click("text=Language");
  await page.click("text=German");
  await expect(page).toHaveURL("http://localhost:1030/de/more");
});

test("User should be able to input a barcode and get a result", async ({
  page,
}) => {
  await page.goto("http://localhost:1030/en");

  const inputField = await page.$('input[name="barcode"]');
  await inputField.type("4066600204404");
  const submitButton = await page.$('button[name="submit"]');
  await submitButton.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});

test("User should be able to input ingredients and get a result", async ({
  page,
}) => {
  await page.goto("http://localhost:1030/en/ingredients");

  const inputField = await page.$('textarea[id="ingredients"]');
  await inputField.type("Duck");
  const submitButton = await page.$('button[name="checkingredients"]');
  await submitButton.click();

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });
  const resultText = await page.textContent(".resultborder");
  expect(resultText).toContain("Duck");

  await page.route("**/v0/ingredients/*", (route) => {
    expect(route.request().url()).toBe(
      "https://api.vegancheck.me/v0/ingredients/Duck"
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

test("User should be able to switch on OLED mode in darkmode, in lightmode, user should get an error", async ({
  page,
}) => {
  await page.goto("http://localhost:1030/en/more");

  // Locate the switch input and click on it
  const switchInput = await page.$("#oled-switch");
  await switchInput.click();

  // Wait for either the "animated shake" class (error) or the background color to change
  await Promise.any([
    page.waitForSelector(".switch.animated.shake", { timeout: 5000 }),
    page.waitForFunction(
      () => {
        const bodyStyles = window.getComputedStyle(document.body);
        return bodyStyles.backgroundColor === "#000";
      },
      { timeout: 5000 }
    ),
  ]);
  // Check if the switch triggered the expected result
  const bodyStyles = await page.evaluate(() => {
    return window.getComputedStyle(document.body);
  });
  if (bodyStyles.backgroundColor === "#000") {
    // Dark mode was activated
    expect(bodyStyles.color).toBe("#141414");
  } else {
    // Light mode was activated
    const switchClasses = await switchInput.evaluate((input) =>
      Array.from(input.classList)
    );
    expect(switchClasses).toEqual(
      expect.arrayContaining(["animated", "shake"])
    );
  }
});

test("User should be able to input a barcode via the URL parameter `ean` ", async ({
  page,
}) => {
  await page.route("**/v0/product/*", (route) => {
    expect(route.request().url()).toBe(
      "https://api.vegancheck.me/v0/product/4066600204404"
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

  await page.goto("http://localhost:1030/en?ean=4066600204404");

  const inputField = await page.waitForSelector('input[name="barcode"]', {
    visible: true,
  });
  const inputValue = await inputField.evaluate((el) => el.value);
  expect(inputValue).toBe("4066600204404");

  await page.waitForSelector(".loading_skeleton", { state: "hidden" });

  const resultText = await page.textContent("#result");
  expect(resultText).toContain("Paulaner Spezi Zero");
});
