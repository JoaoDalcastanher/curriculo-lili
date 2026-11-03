import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('modo-explorar').click()
})

test('abre o Explorar na Patagônia, com o cartão do lugar', async ({ page }) => {
  await expect(page.getByTestId('explorar-globo')).toBeVisible()
  await expect(page.getByTestId('explorar-cartao')).toHaveAttribute('data-place', 'patagonia')
  await expect(page.getByTestId('painel')).toBeHidden()
})

test('escolher um destino leva o Pingo até lá e mostra o cartão', async ({ page }) => {
  await page.getByTestId('ir-toquio').click()
  const card = page.getByTestId('explorar-cartao')
  await expect(card).toHaveAttribute('data-place', 'toquio')
  await expect(card).toContainText('Tóquio')
  await expect(card).toContainText('quadradinhos')
})

test('arrastar o globo move o Pingo pelo mundo', async ({ page }) => {
  const globe = page.getByTestId('explorar-globo')
  const before = await globe.getAttribute('data-center')
  const box = await globe.locator('svg.globe-svg').boundingBox()
  expect(box).not.toBeNull()
  if (!box) {
    return
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 - 150, box.y + box.height / 2 + 120, { steps: 8 })
  await page.mouse.up()
  await expect(globe).not.toHaveAttribute('data-center', before ?? '')
})

test('vai para o espaço e visita os planetas', async ({ page }) => {
  await page.getByRole('tab', { name: 'Espaço' }).click()
  await expect(page.getByTestId('explorar-espaco')).toBeVisible()
  await expect(page.getByTestId('explorar-cartao')).toHaveAttribute('data-place', 'lua')
  await page.getByTestId('ir-saturno').click()
  await expect(page.getByTestId('explorar-cartao')).toHaveAttribute('data-place', 'saturno')
})

test('volta para o jogo', async ({ page }) => {
  await page.getByTestId('modo-jogar').click()
  await expect(page.getByTestId('painel')).toBeVisible()
  await expect(page.getByTestId('explorar')).toBeHidden()
})
