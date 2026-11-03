import { expect, test } from '@playwright/test'
import { hops } from './helpers'

test.use({ reducedMotion: 'no-preference' })

test('o Pingo anda quadradinho por quadradinho e o postal abre assim que ele chega', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('campo-km').fill('3150')
  await page.getByTestId('nadar').click()

  await expect(page.getByTestId('hodometro')).toHaveClass(/is-on/)
  await expect(page.getByTestId('pinguim')).toHaveClass(/is-traveling/)
  await page.waitForTimeout(1500)
  const midway = await hops(page)
  expect(midway).toBeGreaterThan(0)
  expect(midway).toBeLessThan(21)

  await expect(page.getByTestId('postal')).toBeHidden()
  await expect.poll(() => hops(page), { timeout: 8000 }).toBe(21)
  await expect(page.getByTestId('postal')).toBeVisible({ timeout: 500 })
})
