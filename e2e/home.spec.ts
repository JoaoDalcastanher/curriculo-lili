import { expect, type Page, test } from "@playwright/test";

// Google Fonts is external; stub it so tests only depend on our own server.
async function stubFonts(page: Page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "" }),
  );
}

test.beforeEach(async ({ page }) => {
  await stubFonts(page);
});

test.describe("Página inicial", () => {
  test("apresenta a Gabrieli", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Gabrieli/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Gabrieli, Professora" }),
    ).toBeVisible();
  });

  test("a entrada animada termina com tudo visível", async ({ page }) => {
    await page.goto("/");
    const lastLetter = page.locator("[data-letter]").last();
    await expect(lastLetter).toHaveCSS("opacity", "1", { timeout: 5_000 });
    await expect(page.locator("[data-count='24']")).toHaveText("24", { timeout: 5_000 });
  });

  test("tem todas as seções", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Sobre", "Trajetória", "Projetos", "Formação", "Contato"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("hidrata sem erros no console", async ({ page }) => {
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

test.describe("Projetos", () => {
  test("filtra os projetos por tema", async ({ page }) => {
    await page.goto("/#projetos");
    const cards = page.locator("[data-card]");
    await expect(cards).toHaveCount(4);

    await page.getByRole("button", { name: "Leitura", exact: true }).click();
    await expect(page.getByRole("button", { name: "Leitura", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("[data-card]:visible")).toHaveCount(2);
    await expect(page.locator("[data-card][data-id='horta']")).toBeHidden();

    await page.getByRole("button", { name: "Todos", exact: true }).click();
    await expect(page.locator("[data-card]:visible")).toHaveCount(4);
  });

  test("abre e fecha o detalhe de um projeto", async ({ page }) => {
    await page.goto("/#projetos");
    await page.getByRole("button", { name: "Ver projeto Pequenos cientistas" }).click();
    const dialog = page.getByRole("dialog", { name: "Pequenos cientistas" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Como foi feito" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Ver projeto Pequenos cientistas" }),
    ).toBeFocused();
  });

  test("abre direto pelo link ?projeto=", async ({ page }) => {
    await page.goto("/?projeto=horta");
    const dialog = page.getByRole("dialog", { name: "Horta na escola" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Mãe de aluno do Pré II")).toBeVisible();
    await dialog.getByRole("button", { name: "Fechar" }).click();
    await expect(dialog).toBeHidden();
  });

  test("ignora projeto inexistente no link", async ({ page }) => {
    await page.goto("/?projeto=nao-existe");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("Menu no celular", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("abre o menu e navega para a seção", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Menu" });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.getByRole("button", { name: "Fechar" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page
      .getByRole("navigation", { name: "Menu" })
      .getByRole("link", { name: "Projetos" })
      .click();
    await expect(page).toHaveURL(/#projetos$/);
    await expect(page.getByRole("navigation", { name: "Menu" })).toBeHidden();
  });
});

test.describe("Movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("mostra tudo sem animação e o painel abre na hora", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/js-motion/);
    await expect(page.locator("[data-letter]").first()).toHaveCSS("opacity", "1");
    await page.getByRole("button", { name: "Ver projeto Horta na escola" }).click();
    const dialog = page.getByRole("dialog", { name: "Horta na escola" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
