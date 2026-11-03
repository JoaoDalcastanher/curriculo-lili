import { expect, type Page, test } from '@playwright/test'
import { hops, swim } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

async function chooseRoute(page: Page, from: string, to: string) {
  await page.getByTestId('saida').selectOption(from)
  await page.getByTestId('chegada').selectOption(to)
}

async function answerKm(page: Page): Promise<number> {
  return Number(await page.getByTestId('mapa').getAttribute('data-squares')) * 150
}

test('escolher saída e chegada mostra o cartão de partida com o selo do lugar', async ({ page }) => {
  await chooseRoute(page, 'malvinas', 'caminho-30')
  const departure = page.getByTestId('partida')
  await expect(departure).toBeVisible()
  await expect(departure.getByRole('heading')).toHaveText('Partindo das Ilhas Malvinas!')
  await expect(departure).toContainText('O Pingo vai nadar das Ilhas Malvinas até o Rio de Janeiro.')
  await expect(departure.locator('.postcard-stamp.is-place')).toBeVisible()
  await expect(departure.getByRole('button', { name: 'Vamos lá!' })).toBeFocused()
  await expect(page.getByTestId('rota')).toHaveText('Das Ilhas Malvinas até o Rio de Janeiro')

  await departure.getByRole('button', { name: 'Vamos lá!' }).click()
  await expect(departure).toBeHidden()
  await expect(page.getByTestId('campo-km')).toBeFocused()
  await expect(page.getByRole('img', { name: 'Mapa quadriculado de Ilhas Malvinas até Rio de Janeiro' })).toBeVisible()

  const text = await page.locator('body').innerText()
  expect(text).not.toContain(String(await answerKm(page)))
})

test('acerto numa rota nova: Parabéns genérico com a Pinga nas Malvinas', async ({ page }) => {
  await chooseRoute(page, 'patagonia', 'malvinas')
  await page.getByTestId('vamos').click()
  const km = await answerKm(page)
  await swim(page, String(km))
  const postcard = page.getByTestId('postal')
  await expect(postcard).toHaveAttribute('data-kind', 'acerto')
  await expect(postcard.getByRole('heading')).toHaveText('Parabéns! Na mosca!')
  await expect(postcard.getByTestId('lugar')).toHaveText('Ilhas Malvinas, Atlântico Sul')
  await expect(postcard).toContainText('O Pingo saiu da Patagônia e chegou nas Ilhas Malvinas!')
  await expect(postcard.getByTestId('conta')).toContainText(`× 150 km = ${km.toLocaleString('pt-BR')} km`)
  await expect(page.getByTestId('confete')).toBeAttached()
  expect(await hops(page)).toBe(km / 150)
})

test('na volta (Santa Catarina → Patagônia) o caminho da atividade vale os mesmos 21 quadradinhos', async ({ page }) => {
  await page.getByTestId('trocar').click()
  await expect(page.getByTestId('rota')).toHaveText('De Santa Catarina até a Patagônia')
  await expect(page.getByTestId('campo-km')).toHaveValue('')
  await page.getByTestId('vamos').click()
  await swim(page, '3150')
  await expect(page.getByTestId('postal')).toHaveAttribute('data-kind', 'acerto')
  await expect(page.getByTestId('postal').getByTestId('lugar')).toHaveText('Patagônia, Argentina')
})

test('rota longa: bolinhas de 10 em 10 quadradinhos no caminho', async ({ page }) => {
  await chooseRoute(page, 'patagonia', 'toquio')
  await page.getByTestId('vamos').click()
  const squares = Number(await page.getByTestId('mapa').getAttribute('data-squares'))
  expect(squares).toBeGreaterThan(40)
  await expect(page.getByTestId('marca-10')).toHaveCount(Math.floor((squares - 1) / 10))
  await expect(page.getByTestId('legenda')).toContainText('cada bolinha = 10 quadradinhos')
})

test('rota curta não tem bolinhas', async ({ page }) => {
  await chooseRoute(page, 'patagonia', 'malvinas')
  await page.getByTestId('vamos').click()
  await expect(page.getByTestId('marca-10')).toHaveCount(0)
})

test('não dá para sair e chegar no mesmo lugar', async ({ page }) => {
  await expect(page.getByTestId('chegada').locator('option[value="patagonia"]')).toHaveAttribute('disabled', '')
  await expect(page.getByTestId('saida').locator('option[value="santa-catarina"]')).toHaveAttribute('disabled', '')
  await expect(page.getByTestId('chegada').locator('option[value="malvinas"]')).not.toHaveAttribute('disabled', '')
})

test('passou do ponto numa rota nova: segue para os lugares do mundo', async ({ page }) => {
  await chooseRoute(page, 'patagonia', 'malvinas')
  await page.getByTestId('vamos').click()
  await swim(page, '30000')
  const postcard = page.getByTestId('postal')
  await expect(postcard).toHaveAttribute('data-kind', 'mundo')
  await expect(postcard.getByRole('heading')).toContainText('Poderia chegar até')
})

test('trocar de rota depois de acertar libera o jogo de novo', async ({ page }) => {
  await swim(page, '3150')
  await expect(page.getByTestId('campo-km')).toBeDisabled()
  await chooseRoute(page, 'patagonia', 'malvinas')
  await expect(page.getByTestId('postal')).toBeHidden()
  await page.getByTestId('vamos').click()
  await expect(page.getByTestId('campo-km')).toBeEnabled()
  await expect.poll(() => hops(page)).toBe(0)
})
