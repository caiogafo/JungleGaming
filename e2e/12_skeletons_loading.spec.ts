import { test, expect } from '@playwright/test'

test.describe('Cenário 12: Skeletons com Shimmer Effect durante Carregamento', () => {
  test('deve renderizar placeholders shimmer durante carregamento com latência simulada', async ({ page }) => {
    await page.goto('/')

    // Set network latency to 1200ms
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("1200ms")')

    // Navigate to NFT detail
    await page.goto('/nft/nft_1')

    // Expect shimmer skeleton elements while waiting for API
    const skeleton = page.locator('.skeleton-shimmer').first()
    await expect(skeleton).toBeVisible()

    // Eventually content loads smoothly
    await expect(page.locator('h1:has-text("Emerald Varsity Ape #042")')).toBeVisible({ timeout: 10000 })

    // Restore latency to normal
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("150ms")')
  })
})
