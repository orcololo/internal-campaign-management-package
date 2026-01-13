import { Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const screenshotsDir = path.join(__dirname, "../../screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${name}-${timestamp}.png`;
  await page.screenshot({
    path: path.join(screenshotsDir, filename),
    fullPage: true,
  });
}

export async function waitForSelector(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}

export async function clickAndWait(
  page: Page,
  selector: string,
  waitForNavigation = true
): Promise<void> {
  if (waitForNavigation) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(selector),
    ]);
  } else {
    await page.click(selector);
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fillForm(
  page: Page,
  formData: Record<string, string>
): Promise<void> {
  for (const [selector, value] of Object.entries(formData)) {
    await page.type(selector, value);
  }
}

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ]);
}

export async function waitForToast(
  page: Page,
  timeout = 5000
): Promise<string | null> {
  try {
    await page.waitForSelector(
      '[role="status"], .toast, [data-testid="toast"], [class*="sonner"]',
      { timeout }
    );
    const toast = await page.$(
      '[role="status"], .toast, [data-testid="toast"], [class*="sonner"]'
    );
    if (toast) {
      return await toast.evaluate((el) => el.textContent);
    }
  } catch {
    return null;
  }
  return null;
}

export async function clearAndType(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  await page.click(selector, { clickCount: 3 }); // Select all
  await page.keyboard.press("Backspace");
  await page.type(selector, value);
}

export async function selectOption(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
  
  if (tagName === "select") {
    await page.select(selector, value);
  } else {
    // For custom select components (like shadcn/ui)
    await page.click(selector);
    await delay(300);
    
    // Try to find and click the option
    const optionSelectors = [
      `[role="option"][data-value="${value}"]`,
      `[role="option"]:has-text("${value}")`,
      `li:has-text("${value}")`,
    ];
    
    for (const optionSelector of optionSelectors) {
      const option = await page.$(optionSelector);
      if (option) {
        await option.click();
        return;
      }
    }
    
    // Fallback: use keyboard navigation
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  }
}

export async function checkCheckbox(
  page: Page,
  selector: string,
  shouldCheck = true
): Promise<void> {
  const checkbox = await page.$(selector);
  if (!checkbox) {
    throw new Error(`Checkbox not found: ${selector}`);
  }

  const isChecked = await checkbox.evaluate((el: any) => el.checked);
  
  if (shouldCheck && !isChecked) {
    await checkbox.click();
  } else if (!shouldCheck && isChecked) {
    await checkbox.click();
  }
}

export async function waitForNavigation(
  page: Page,
  urlPattern?: string | RegExp,
  timeout = 10000
): Promise<void> {
  if (urlPattern) {
    // Poll for URL match
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const url = page.url();
      const matches = typeof urlPattern === "string" 
        ? url.includes(urlPattern)
        : urlPattern.test(url);
      
      if (matches) return;
      await delay(100);
    }
    throw new Error(`Timeout waiting for URL pattern: ${urlPattern}`);
  } else {
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout });
  }
}

export async function getValidationErrors(page: Page): Promise<string[]> {
  const errorSelectors = [
    '[class*="error"]',
    '[role="alert"]',
    '.text-red-500',
    '[class*="text-destructive"]',
    '[data-testid="error-message"]',
  ];

  const errors: string[] = [];
  
  for (const selector of errorSelectors) {
    const elements = await page.$$(selector);
    for (const element of elements) {
      const text = await element.evaluate((el) => el.textContent);
      if (text && text.trim()) {
        errors.push(text.trim());
      }
    }
  }

  return errors;
}
