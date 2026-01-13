export const testConfig = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:3001",
  headless: process.env.HEADLESS !== "false",
  slowMo: parseInt(process.env.SLOW_MO || "0", 10),
  defaultTimeout: 30000,
  viewport: {
    width: 1920,
    height: 1080,
  },
};
