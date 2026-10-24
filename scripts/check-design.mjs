import { readFileSync } from "node:fs";

// WCAG relative luminance; this checks explicit token pairs, not whole-page conformity.
const css = readFileSync(
  new URL("../src/styles/brand.css", import.meta.url),
  "utf8",
);
const tokens = Object.fromEntries(
  [...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [
    match[1],
    match[2],
  ]),
);
function luminance(hex) {
  const values = hex
    .slice(1)
    .match(/../g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
const pairs = [
  ["foreground", "surface", 4.5],
  ["foreground", "background", 4.5],
  ["muted", "surface", 4.5],
  ["muted", "background", 4.5],
  ["muted", "surface-muted", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary-foreground", "primary-hover", 4.5],
  ["link", "primary-soft", 4.5],
  ["link", "surface", 4.5],
  ["rail-foreground", "rail", 4.5],
  ["rail-muted", "rail", 4.5],
  ["success", "success-soft", 4.5],
  ["warning", "warning-soft", 4.5],
  ["danger", "danger-soft", 4.5],
  ["on-danger", "danger", 4.5],
  ["info", "info-soft", 4.5],
  ["input-border", "surface", 3],
  ["input-border", "background", 3],
  ["ring", "surface", 3],
  ["ring", "background", 3],
  ["chart-1", "surface", 3],
  ["chart-2", "surface", 3],
];
const results = pairs.map(([foreground, background, minimum]) => {
  if (!tokens[foreground] || !tokens[background])
    throw new Error(`Missing token ${foreground}/${background}`);
  const values = [
    luminance(tokens[foreground]),
    luminance(tokens[background]),
  ].sort((a, b) => b - a);
  const contrast = (values[0] + 0.05) / (values[1] + 0.05);
  return {
    foreground,
    background,
    contrast: Number(contrast.toFixed(3)),
    minimum,
    pass: contrast >= minimum,
  };
});
console.table(results);
if (results.some((result) => !result.pass)) process.exitCode = 1;
else
  console.log(
    `All ${results.length} explicit text/control/chart token pairs pass their thresholds. Full accessibility requires workflow and manual review.`,
  );
