import { expect, type Page, test } from "@playwright/test";

interface WebMcpTestState {
  cameraRequests: number;
  scanResult?: { error?: string; status: string };
  tools: string[];
}

const getTestState = async (page: Page): Promise<WebMcpTestState> =>
  page.evaluate(() => {
    const state = (window as unknown as { __webmcpTest?: WebMcpTestState })
      .__webmcpTest;
    if (!state) {
      throw new Error("WebMCP test state was not installed");
    }
    return state;
  });

test("registers native tools and requires consent before camera access", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state: WebMcpTestState = {
      cameraRequests: 0,
      tools: [],
    };
    const registeredTools = new Map<
      string,
      { execute: (input: Record<string, never>) => Promise<unknown> }
    >();
    const modelContext = {
      registerTool: (
        tool: {
          name: string;
          execute: (input: Record<string, never>) => Promise<unknown>;
        },
        options?: { signal?: AbortSignal }
      ) => {
        registeredTools.set(tool.name, tool);
        state.tools = [...registeredTools.keys()];
        options?.signal?.addEventListener("abort", () => {
          registeredTools.delete(tool.name);
          state.tools = [...registeredTools.keys()];
        });
        return Promise.resolve();
      },
    };

    Object.defineProperty(window, "__webmcpTest", {
      configurable: true,
      value: state,
    });
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: modelContext,
    });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: () => {
          state.cameraRequests += 1;
          return Promise.reject(new Error("camera access should be explicit"));
        },
      },
    });

    Object.defineProperty(state, "startScan", {
      configurable: true,
      value: () => {
        const tool = registeredTools.get("scan_product");
        if (!tool) {
          throw new Error("scan_product was not registered");
        }
        tool.execute({}).then(
          () => {
            state.scanResult = { status: "resolved" };
          },
          (error: unknown) => {
            state.scanResult = {
              error: error instanceof Error ? error.name : "UnknownError",
              status: "rejected",
            };
          }
        );
      },
    });
  });

  await page.goto("/en");
  await expect
    .poll(async () => (await getTestState(page)).tools)
    .toEqual([
      "check_ingredients",
      "check_product",
      "scan_product",
      "get_history",
    ]);

  await page.evaluate(() => {
    const state = (
      window as unknown as {
        __webmcpTest: WebMcpTestState & { startScan: () => void };
      }
    ).__webmcpTest;
    state.startScan();
  });
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await getTestState(page)).cameraRequests).toBe(0);

  await page.getByRole("button", { name: "Cancel" }).click();
  await expect
    .poll(async () => (await getTestState(page)).scanResult?.error)
    .toBe("ScanCancelledError");
  expect((await getTestState(page)).cameraRequests).toBe(0);

  await page.evaluate(() => {
    const state = (
      window as unknown as {
        __webmcpTest: WebMcpTestState & { startScan: () => void };
      }
    ).__webmcpTest;
    state.scanResult = undefined;
    state.startScan();
  });
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Open camera" }).click();
  await expect
    .poll(async () => (await getTestState(page)).cameraRequests)
    .toBeGreaterThanOrEqual(1);
});
