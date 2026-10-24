import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.PRESSLINE_TEST_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("PRESSLINE_TEST_PORT must be an integer from 1024 to 65535.");
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
