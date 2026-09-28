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

  test("mostra o retrato principal", async ({ page }) => {
    await page.goto("/");
    const portrait = page.getByRole("img", { name: /Gabrieli sorrindo/ });
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute("src", "/fotos/retrato-gabrieli.jpg");
  });

  test("a entrada animada termina com tudo visível", async ({ page }) => {
    await page.goto("/");
    const lastLetter = page.locator("[data-letter]").last();
    await expect(lastLetter).toHaveCSS("opacity", "1", { timeout: 5_000 });
    await expect(page.locator("[data-count='4']")).toHaveText("4", { timeout: 5_000 });
  });

  test("contatos: e-mail e Lattes", async ({ page }) => {
    await page.goto("/");
    const contact = page.getByRole("region", { name: "Contato" });
    await expect(contact.getByRole("link", { name: "E-mail" })).toHaveAttribute(
      "href",
      "mailto:gabrieliaparecidacunha123@gmail.com",
    );
    await expect(contact.getByRole("link", { name: "Currículo Lattes" })).toHaveAttribute(
      "href",
      "http://lattes.cnpq.br/0891095904029183",
    );
    await expect(contact.getByRole("link")).toHaveCount(2);
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

    await page.getByRole("button", { name: "Ciências", exact: true }).click();
    await expect(page.getByRole("button", { name: "Ciências", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("[data-card]:visible")).toHaveCount(1);
    await expect(page.locator("[data-card][data-id='eca']")).toBeHidden();

    await page.getByRole("button", { name: "Todos", exact: true }).click();
    await expect(page.locator("[data-card]:visible")).toHaveCount(4);
  });

  test("abre e fecha o detalhe de um projeto", async ({ page }) => {
    await page.goto("/#projetos");
    await page
      .getByRole("button", { name: "Ver projeto Revitalização do parque infantil" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Revitalização do parque infantil" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Autoria" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Ver projeto Revitalização do parque infantil" }),
    ).toBeFocused();
  });

  test("abre direto pelo link ?projeto=", async ({ page }) => {
    await page.goto("/?projeto=estagio");
    const dialog = page.getByRole("dialog", { name: "Vivências no Estágio Supervisionado I" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText("integração entre teoria e prática", { exact: false }).last(),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Fechar" }).click();
    await expect(dialog).toBeHidden();
  });

  test("mostra só dados reais: sem etapas, galeria ou depoimento vazios", async ({ page }) => {
    await page.goto("/?projeto=eca");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Referência" })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Como foi feito" })).toHaveCount(0);
    await expect(dialog.getByRole("heading", { name: "Galeria" })).toHaveCount(0);
    await expect(dialog.locator("figure")).toHaveCount(0);
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
    await page
      .getByRole("button", { name: "Ver projeto ECA — Estatuto da Criança e do Adolescente" })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "ECA — Estatuto da Criança e do Adolescente",
    });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
