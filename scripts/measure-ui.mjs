// Local-only production frontend lab. Start npm run start first; requires installed Playwright Chromium.
import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
const output = ".local/premium-performance";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const width of [1440, 390])
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 40,
      downloadThroughput: 1250000,
      uploadThroughput: 500000,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const external = [];
    page.on("request", (r) => {
      if (new URL(r.url()).origin !== "http://127.0.0.1:3000")
        external.push(r.url());
    });
    await context.addInitScript(() => {
      window.__presslineLab = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };
      for (const type of [
        "largest-contentful-paint",
        "layout-shift",
        "longtask",
      ])
        if (PerformanceObserver.supportedEntryTypes.includes(type))
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (type === "largest-contentful-paint")
                window.__presslineLab.lcp = e.startTime;
              if (type === "layout-shift" && !e.hadRecentInput)
                window.__presslineLab.cls += e.value;
              if (type === "longtask") {
                window.__presslineLab.longTasks++;
                window.__presslineLab.longTaskMs += e.duration;
              }
            }
          }).observe({ type, buffered: true });
    });
    await page.goto("http://127.0.0.1:3000/login");
    await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
    await page.waitForURL("**/dashboard");
    await page.goto("http://127.0.0.1:3000/pos");
    await page
      .getByRole("button", { name: "Configure Document printing", exact: true })
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const metrics = await page.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0];
      return {
        ...window.__presslineLab,
        domContentLoadedMs: n.domContentLoadedEventEnd,
        loadMs: n.loadEventEnd,
        transferBytes:
          n.transferSize +
          performance
            .getEntriesByType("resource")
            .reduce((v, r) => v + r.transferSize, 0),
        fontStatus: document.fonts.status,
      };
    });
    results.push({
      width,
      run,
      cpuSlowdown: 4,
      latencyMs: 40,
      downloadBytesPerSecond: 1250000,
      ...metrics,
      externalRequests: external.length,
    });
    console.log(JSON.stringify(results.at(-1)));
    await context.close();
  }
await writeFile(
  `${output}/production-pos-lab.json`,
  JSON.stringify(
    {
      scope:
        "Six account-primed POS navigations in local production Chromium. HTTP cache disabled; fonts/core assets may be warm after demo entry. Not cold startup, field CWV, INP or real-device performance.",
      browserVersion: browser.version(),
      results,
    },
    null,
    2,
  ),
);
await browser.close();
