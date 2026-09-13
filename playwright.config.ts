import { defineConfig } from "@playwright/test";

// Default to localhost for local development, use staging URL for CI
const baseURL = process.env.CI
  ? "https://staging.veganify.app"
  : "http://localhost:3000";

export default defineConfig({
  testMatch: ["**/*.spec.ts"],
  use: {
    baseURL,
  },
  webServer: process.env.CI
    ? undefined
    : {
        command: "bun run dev",
        reuseExistingServer: true,
        url: "http://localhost:3000",
      },
});
