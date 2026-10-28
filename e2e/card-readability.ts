import { expect, type Locator } from "@playwright/test";

/** Labels, status words and currency amounts must fit without arbitrary breaks. */
export async function expectReadableCards(table: Locator) {
  const fragments = await table.evaluate((root) => {
    const context = document.createElement("canvas").getContext("2d")!;
    const failures: string[] = [];
    function check(element: Element, text: string, pseudo?: string) {
      const style = getComputedStyle(element, pseudo);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const width =
        element.getBoundingClientRect().width -
        (pseudo
          ? 0
          : parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
      const spacing = parseFloat(style.letterSpacing) || 0;
      for (const word of text.trim().split(/\s+/)) {
        const required =
          context.measureText(word).width +
          Math.max(0, word.length - 1) * spacing;
        if (required > width + 1)
          failures.push(
            `${word}: needs ${required.toFixed(1)}px, has ${width.toFixed(1)}px`,
          );
      }
    }
    for (const cell of root.querySelectorAll("td[data-label]")) {
      if (getComputedStyle(cell, "::before").display !== "none")
        check(cell, cell.getAttribute("data-label") ?? "", "::before");
    }
    for (const value of root.querySelectorAll(".badge, .money"))
      check(value, value.textContent ?? "");
    return failures;
  });
  expect(
    fragments,
    "card labels, statuses and amounts remain readable",
  ).toEqual([]);
}
