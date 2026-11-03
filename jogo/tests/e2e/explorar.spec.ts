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

test('arrastar o Pingo leva ele pelo mundo (ele segue o dedo)', async ({ page }) => {
  const globe = page.getByTestId('explorar-globo')
  const pingo = page.getByTestId('explorar-pingo')
  const box = await pingo.boundingBox()
  expect(box).not.toBeNull()
  if (!box) {
    return
  }
  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  // Para a direita e para cima: rumo ao Atlântico, mais ao norte.
  await page.mouse.move(startX + 60, startY - 60, { steps: 8 })
  await page.waitForTimeout(100)
  const [lat, lon] = ((await globe.getAttribute('data-pingo')) ?? '').split(',').map(Number)
  await page.mouse.up()
  const [startLat, startLon] = [-42.7, -65]
  expect(lat).toBeGreaterThan(startLat)
  expect(lon).toBeGreaterThan(startLon)
})

test('soltar o Pingo perto de um lugar abre o cartão de lá', async ({ page }) => {
  const pingo = page.getByTestId('explorar-pingo')
  const target = page.getByTestId('pino-santa-catarina')
  const from = await pingo.boundingBox()
  const to = await target.boundingBox()
  expect(from).not.toBeNull()
  expect(to).not.toBeNull()
  if (!from || !to) {
    return
  }
  const id = await target.getAttribute('data-place-id')
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 10 })
  await page.mouse.up()
  await expect(page.getByTestId('explorar-cartao')).toHaveAttribute('data-place', id ?? '')
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

test('clicar no selo abre o cartão-postal do lugar', async ({ page }) => {
  await page.getByTestId('ir-alasca').click()
  await page.getByTestId('abrir-postal').click()
  const postcard = page.getByRole('dialog', { name: /Anchorage/ })
  await expect(postcard).toBeVisible()
  await expect(postcard).toBeInViewport()
  await expect(postcard).toContainText('Cartão-postal de Anchorage')
  await expect(postcard.getByRole('button', { name: 'Fechar' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(postcard).toBeHidden()

  await page.getByTestId('abrir-postal').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).click()
  await expect(page.getByTestId('explorar-postal')).toBeHidden()
})

test('as Ilhas Malvinas estão no Explorar, com a Pinga', async ({ page }) => {
  await page.getByTestId('ir-malvinas').click()
  const card = page.getByTestId('explorar-cartao')
  await expect(card).toHaveAttribute('data-place', 'malvinas')
  await expect(card).toContainText('Levou o maior peixe do mar até a toca da Pinga.')
  await expect(card.locator('.postcard-stamp.is-place')).toBeVisible()
})
