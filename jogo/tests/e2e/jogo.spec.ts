import { expect, test } from '@playwright/test'
import { hops, swim } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('mostra o mapa, a legenda e o Pingo na Patagônia sem revelar a resposta', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'A viagem do Pingo' })).toBeVisible()
  await expect(page.getByTestId('legenda')).toHaveText('1 quadradinho = 150 km')
  expect(await hops(page)).toBe(0)

  const text = await page.locator('body').innerText()
  expect(text).not.toContain('3150')
  expect(text).not.toContain('3.150')
  expect(text).not.toContain('Tentativas')
  expect(text).not.toContain('Siga o caminho')
})

test('toda resposta vira um cartão-postal do mesmo jeito', async ({ page }) => {
  for (const km of ['1000', '3000', '3300', '6000']) {
    await swim(page, km)
    const postcard = page.getByTestId('postal')
    await expect(postcard.getByTestId('lugar')).not.toBeEmpty()
    await expect(postcard.getByRole('heading')).toBeVisible()
    await expect(postcard.getByRole('button', { name: 'Tentar de novo' })).toBeVisible()
    await postcard.getByRole('button', { name: 'Tentar de novo' }).click()
    await expect(postcard).toBeHidden()
  }
})

test('distância curta: para no meio do mar, no quadradinho certo', async ({ page }) => {
  await swim(page, '1000')
  const postcard = page.getByTestId('postal')
  await expect(postcard).toHaveAttribute('data-kind', 'curto')
  await expect(postcard.getByTestId('lugar')).toHaveText('Quadradinho G6')
  await expect(postcard.getByRole('heading')).toHaveText('Ainda falta nadar bastante…')

  await postcard.getByRole('button', { name: 'Tentar de novo' }).click()
  await expect.poll(() => hops(page)).toBe(0)
  await expect(page.getByTestId('campo-km')).toBeFocused()
})

test('cumprimenta a Argentina como no vídeo', async ({ page }) => {
  await swim(page, '900')
  await page.getByRole('button', { name: 'Ver o mapa' }).click()
  await expect(page.getByTestId('balao')).toHaveText('Oi, Argentina!')
})

test('acerto: confete, conta e jogar de novo', async ({ page }) => {
  await swim(page, '3.150')
  const postcard = page.getByTestId('postal')
  await expect(postcard).toHaveAttribute('data-kind', 'acerto')
  await expect(postcard.getByTestId('lugar')).toHaveText('Santa Catarina, Brasil')
  await expect(postcard.getByTestId('conta')).toHaveText('21 × 150 km = 3.150 km')
  await expect(page.getByTestId('confete')).toBeAttached()
  await expect(postcard.getByRole('heading')).toContainText('Parabéns')
  await expect(page.getByTestId('campo-km')).toBeDisabled()
  expect(await hops(page)).toBe(21)

  await postcard.getByRole('button', { name: 'Ver o mapa' }).click()
  await expect(page.getByTestId('balao')).toHaveText('Cheguei em Santa Catarina!')
  await expect(page.getByText('Parabéns!', { exact: true })).toHaveCount(0)

  await page.getByTestId('recomecar').click()
  await expect(page.getByTestId('campo-km')).toBeEnabled()
  await expect(page.getByTestId('campo-km')).toHaveValue('')
  await expect.poll(() => hops(page)).toBe(0)
})

test('passou do ponto: vai direto para o globo e nada pela costa do Brasil', async ({ page }) => {
  await page.getByTestId('campo-km').fill('6000')
  await page.getByTestId('nadar').click()
  await expect(page.getByTestId('globo')).toHaveAttribute('data-scene', 'mundo')
  expect(await hops(page)).toBe(0)
  const postcard = page.getByTestId('postal')
  await expect(postcard).toBeVisible({ timeout: 15_000 })
  await expect(postcard.getByTestId('lugar')).toHaveText('Salvador, Bahia')
  await postcard.getByRole('button', { name: 'Ver o globo' }).click()
  await expect(page.getByTestId('rastro-globo')).toBeVisible()
})

test('passou raspando de Santa Catarina: já é no globo', async ({ page }) => {
  await swim(page, '3300')
  await expect(page.getByTestId('globo')).toBeAttached()
  await expect(page.getByTestId('postal')).toHaveAttribute('data-kind', 'quase-longe')
  await expect(page.getByTestId('postal').getByTestId('lugar')).toHaveText('Litoral do Paraná')
  expect(await hops(page)).toBe(0)
})

test('depois da África: globo com "poderia chegar até…"', async ({ page }) => {
  await swim(page, '22000')
  await expect(page.getByTestId('globo')).toHaveAttribute('data-scene', 'mundo')
  const postcard = page.getByTestId('postal')
  await expect(postcard).toHaveAttribute('data-kind', 'mundo')
  await expect(postcard.getByRole('heading')).toContainText('Poderia chegar até')
  expect(await postcard.getByTestId('alcance').locator('li').count()).toBeGreaterThan(3)

  await postcard.getByRole('button', { name: 'Ver o globo' }).click()
  await expect(page.getByTestId('rastro-globo')).toBeVisible()
})

test('distância absurda: globo com as voltas na Terra', async ({ page }) => {
  await swim(page, '200375')
  await expect(page.getByTestId('postal').getByRole('heading')).toHaveText('Daria 5 voltas na Terra!')
  await page.getByRole('button', { name: 'Ver as voltas' }).click()
  await expect(page.getByTestId('contador-voltas')).toContainText('5 voltas')
  await expect(page.getByTestId('volta')).toHaveCount(5)
})

test('mais longe ainda: vai para o espaço', async ({ page }) => {
  await swim(page, '400 000 km')
  await expect(page.getByTestId('espaco')).toHaveAttribute('data-body', 'lua')
  await expect(page.getByTestId('postal').getByTestId('lugar')).toHaveText('Lua')
})

test('entrada inválida mostra erro', async ({ page }) => {
  await page.getByTestId('campo-km').fill('muito')
  await page.getByTestId('nadar').click()
  await expect(page.getByRole('alert')).toHaveText('Digite só números, tipo 1200.')
  await expect(page.getByTestId('postal')).toBeHidden()
})

test('o mapa inteiro cabe na tela, sem rolagem lateral', async ({ page }) => {
  const box = await page.getByTestId('mapa').boundingBox()
  const viewport = page.viewportSize()
  expect(box).not.toBeNull()
  expect(viewport).not.toBeNull()
  if (!box || !viewport) {
    return
  }
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
})

test('longe do mapa: começa direto no globo', async ({ page }) => {
  await page.getByTestId('campo-km').fill('22000')
  await page.getByTestId('nadar').click()
  await expect(page.getByTestId('globo')).toBeVisible()
  expect(await hops(page)).toBe(0)
})

test('o selo do cartão-postal mostra o cenário inteiro e aparece sem cortar', async ({ page }) => {
  await swim(page, '1000')
  const stamp = page.getByTestId('postal').locator('.postcard-stamp')
  await expect(stamp).toBeInViewport({ ratio: 1 })
  const scene = await stamp.locator('.postcard-horizon').boundingBox()
  const frame = await stamp.boundingBox()
  expect(scene).not.toBeNull()
  expect(frame).not.toBeNull()
  if (!scene || !frame) {
    return
  }
  expect(scene.width).toBeGreaterThan(frame.width * 0.9)
})
