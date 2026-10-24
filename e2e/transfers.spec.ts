import { test,expect } from "@playwright/test";
test("transfer rejects same branch and excess quantity then updates both inventory balances",async({page})=>{
  await page.goto("/login");await page.getByRole("button",{name:/Demo Administrator/}).click();await page.goto("/transfers");await page.getByRole("button",{name:"New transfer",exact:true}).click();
  await page.getByLabel("Transfer material").selectOption("paper-a4");await page.getByLabel("Source branch").selectOption("b1");await page.getByLabel("Destination branch").selectOption("b1");await page.getByRole("button",{name:"Complete demo transfer",exact:true}).click();await expect(page.getByText("Choose a destination different from the source branch.")).toBeVisible();
  await page.getByLabel("Destination branch").selectOption("b2");await page.getByLabel("Transfer quantity (sheets)").fill("7000");await page.getByRole("button",{name:"Complete demo transfer",exact:true}).click();await expect(page.getByText("Only 6800 sheets are available at the source branch.")).toBeVisible();
  await page.getByLabel("Transfer quantity (sheets)").fill("20");await page.getByLabel("Transfer note (optional)").fill("Demo replenishment");await page.getByRole("button",{name:"Complete demo transfer",exact:true}).click();await expect(page.getByRole("dialog",{name:"Transfer branch stock"})).toHaveCount(0);
  await page.goto("/inventory");const row=page.getByRole("row").filter({has:page.getByRole("button",{name:"A4 copy paper · 80 gsm",exact:true})});await expect(row).toContainText("6,780");await expect(row).toContainText("4,220");
  await expect(page.getByText(/Demo replenishment/)).toHaveCount(2);
});
