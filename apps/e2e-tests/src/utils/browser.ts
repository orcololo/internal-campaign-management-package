import puppeteer, { Browser, Page } from "puppeteer";
import { testConfig } from "@/config/test.config";

export class BrowserManager {
  private static browser: Browser | null = null;

  static async launch(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: testConfig.headless,
        slowMo: testConfig.slowMo,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }
    return this.browser;
  }

  static async newPage(): Promise<Page> {
    const browser = await this.launch();
    const page = await browser.newPage();
    await page.setViewport(testConfig.viewport);
    return page;
  }

  static async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
