import { expect, type Page } from '@playwright/test'

/** Digita a distância, manda nadar e espera o cartão-postal. */
export async function swim(page: Page, km: string) {
  await page.getByTestId('campo-km').fill(km)
  await page.getByTestId('nadar').click()
  await expect(page.getByTestId('postal')).toBeVisible({ timeout: 15_000 })
}

export async function hops(page: Page): Promise<number> {
  return Number(await page.getByTestId('pinguim').getAttribute('data-hops'))
}
