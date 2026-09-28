import { expect, test } from "@playwright/test";

test.describe("Página inicial", () => {
  test("mostra a apresentação da Lili", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Lili/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Lili");
  });

  test("tem todas as seções", async ({ page }) => {
    await page.goto("/");
    for (const id of ["sobre", "trajetoria", "formacao", "contato"]) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Formação" })).toBeVisible();
  });

  test("o botão de trajetória leva até a seção", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Conheça minha trajetória" }).click();
    await expect(page).toHaveURL(/#trajetoria$/);
    await expect(page.locator("section#trajetoria")).toBeInViewport();
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("hidrata sem erros no console", async ({ page }) => {
    // Google Fonts is external; stub it so the test only sees errors from our own code.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
      route.fulfill({ status: 200, contentType: "text/css", body: "" }),
    );
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});
