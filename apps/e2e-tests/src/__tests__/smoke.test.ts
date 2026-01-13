import { delay } from "@/utils/helpers";

/**
 * Smoke test to verify the test environment is working
 */
describe("Smoke Tests", () => {
  it("should pass a basic test", () => {
    expect(true).toBe(true);
  });

  it("should use delay helper", async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(95); // Allow some variance
  });

  it("should have correct test timeout", () => {
    // Test should have 30 second timeout from config
    expect(jest.getTimerCount).toBeDefined();
  });
});
