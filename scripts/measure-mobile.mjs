import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const phase = process.argv[2];
if (!["baseline", "final"].includes(phase))
  throw Error("Supply baseline or final phase");
const target = process.argv[3] ?? "mobile";
if (!["mobile", "optimization"].includes(target))
  throw Error("Measurement target must be mobile or optimization.");
const output =
  target === "optimization"
    ? "docs/verification/optimization"
    : "docs/visual-evidence/mobile";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: "Asia/Colombo",
});
const page = await context.newPage();
const external = [];
page.on("request", (request) => {
  if (
    !request.url().startsWith("http://127.0.0.1:3001") &&
    !request.url().startsWith("data:")
  )
    external.push(request.url());
});
await page.addInitScript(() => {
  window.__mobileLab = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__mobileLab.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (!e.hadRecentInput) window.__mobileLab.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});
await page.clock.setFixedTime(new Date("2026-10-25T06:30:00Z"));
await page.goto("http://127.0.0.1:3001/login");
await page.getByRole("button", { name: /Demo Administrator/ }).click();
await page.waitForURL("**/dashboard");
const cdp = await context.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 40,
  downloadThroughput: 1250000,
  uploadThroughput: 1250000,
});
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
const samples = [];
for (const route of [
  "dashboard",
  "pos",
  "reports",
  "dashboard",
  "pos",
  "reports",
]) {
  const started = performance.now();
  await page.goto(`http://127.0.0.1:3001/${route}`);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot();
  const metrics = await page.evaluate(() => ({ ...window.__mobileLab }));
  const sample = {
    route,
    headingAndFontsMs: Math.round(performance.now() - started),
    lcpMs: metrics.lcp,
    cls: metrics.cls,
  };
  if (route === "pos") {
    const interaction = performance.now();
    await page
      .getByRole("button", { name: "View order (1)", exact: true })
      .click();
    await page.getByRole("dialog").waitFor();
    sample.observedClickToDialogMs = Math.round(
      performance.now() - interaction,
    );
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  }
  samples.push(sample);
}
await browser.close();
const result = {
  phase,
  method:
    "Six account-primed local production navigations at 390x844; Chromium 4x CPU, 40ms latency, 1,250,000 bytes/s, HTTP cache disabled. Font/core assets may be warm. Playwright-observed navigation/heading/fonts/capture and dialog timings include automation overhead, not INP, cold startup or field performance.",
  samples,
  external,
};
await writeFile(
  `${output}/${phase}-runtime.json`,
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
