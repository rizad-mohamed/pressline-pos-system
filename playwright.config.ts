import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.PRESSLINE_TEST_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("PRESSLINE_TEST_PORT must be an integer from 1024 to 65535.");
const baseURL = `http://127.0.0.1:${port}`;
const browser = process.env.PRESSLINE_TEST_BROWSER ?? "chromium";
if (!["chromium", "firefox", "webkit", "all"].includes(browser))
  throw new Error(
    "PRESSLINE_TEST_BROWSER must be chromium, firefox, webkit or all.",
  );
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
    timezoneId: "Asia/Colombo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ].filter((project) => browser === "all" || project.name === browser),
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
