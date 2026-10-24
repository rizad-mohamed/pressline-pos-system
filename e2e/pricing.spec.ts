import { test,expect } from "@playwright/test";
test("price version changes future quotes while saved order prices stay fixed",async({page})=>{
  await page.goto("/login");await page.getByRole("button",{name:/Demo Administrator/}).click();await page.goto("/pricing");await page.getByRole("button",{name:"Edit price catalogue",exact:true}).click();await page.getByLabel("A4 black & white (LKR)",{exact:true}).fill("20.00");await page.getByRole("button",{name:"Save new price version",exact:true}).click();await expect(page.getByText("Version 2",{exact:true})).toBeVisible();
  await page.goto("/orders/PL-1012");await expect(page.getByTestId("detail-total")).toContainText("1,230.00");await page.goto("/pos");await page.getByLabel("Order branch",{exact:true}).selectOption("b1");await expect(page.getByTestId("order-total")).toContainText("20.00");
});
