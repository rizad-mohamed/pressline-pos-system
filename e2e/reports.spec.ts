import { test,expect } from "@playwright/test";
test("reports respond to payments, branch scope, periods and invalid custom dates",async({page})=>{
  await page.goto("/login");await page.getByRole("button",{name:/Demo Administrator/}).click();await page.goto("/reports");
  const initial=Number((await page.getByTestId("report-collected").innerText()).replace(/[^0-9.]/g,""));const orderValue=await page.getByTestId("report-value").innerText();
  await page.goto("/orders/PL-1012");await page.getByRole("button",{name:"Record payment",exact:true}).click();await page.getByLabel("Payment amount (LKR)").fill("100");await page.getByRole("button",{name:"Record simulated payment",exact:true}).click();await expect(page.getByTestId("detail-paid")).toContainText("100.00");
  await page.goto("/reports");expect(Number((await page.getByTestId("report-collected").innerText()).replace(/[^0-9.]/g,""))).toBe(initial+100);await expect(page.getByTestId("report-value")).toHaveText(orderValue);
  await page.getByLabel("Workspace branch").selectOption("b2");await expect(page.getByRole("row").filter({has:page.getByRole("cell",{name:"Branch 1",exact:true})})).toHaveCount(0);
  await page.getByLabel("Report period").selectOption("weekly");await page.getByRole("button",{name:"Apply period",exact:true}).click();await expect(page.getByTestId("report-range")).toBeVisible();
  await page.getByLabel("Report period").selectOption("monthly");await page.getByRole("button",{name:"Apply period",exact:true}).click();
  await page.getByLabel("Report period").selectOption("custom");await page.getByLabel("Start date",{exact:true}).fill("2026-10-25");await page.getByLabel("End date",{exact:true}).fill("2026-10-01");await page.getByRole("button",{name:"Apply period",exact:true}).click();await expect(page.getByText("Start date must be on or before end date.",{exact:true})).toBeVisible();
});
