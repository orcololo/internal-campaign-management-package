import { Page } from "puppeteer";
import { BrowserManager } from "@/utils/browser";
import { testConfig } from "@/config/test.config";
import { takeScreenshot } from "@/utils/helpers";

describe("Example E2E Tests", () => {
  let page: Page;
  let servicesAvailable = false;

  beforeAll(async () => {
    page = await BrowserManager.newPage();

    // Check if frontend is available
    try {
      const response = await page.goto(testConfig.baseUrl, {
        timeout: 3000,
        waitUntil: "domcontentloaded",
      });
      servicesAvailable = response?.ok() ?? false;
    } catch (error) {
      servicesAvailable = false;
      console.warn(`\n⚠️  Frontend not available at ${testConfig.baseUrl}`);
      console.warn("Start with: cd apps/web && pnpm dev\n");
    }
  });

  afterAll(async () => {
    await page.close();
    await BrowserManager.close();
  });

  it("should load the homepage", async () => {
    if (!servicesAvailable) {
      console.warn("⚠️  Skipping - services not available");
      return;
    }

    await page.goto(testConfig.baseUrl, { waitUntil: "networkidle0" });

    const title = await page.title();
    expect(title).toBeTruthy();

    await takeScreenshot(page, "homepage");
  });

  it("should have proper viewport dimensions", async () => {
    const viewport = page.viewport();
    expect(viewport).toMatchObject(testConfig.viewport);
  });
});
