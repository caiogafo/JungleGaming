import { test, expect } from '@playwright/test'

test.describe('Regressão Visual dos Fluxos Principais (Desktop e Mobile)', () => {
  test('deve bater snapshot visual da página inicial do catálogo', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    // Ensure all images are loaded
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-catalog.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })

  test('deve bater snapshot visual da página de detalhes do NFT', async ({ page }) => {
    await page.goto('/nft/nft_1')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('nft-details.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })

  test('deve bater snapshot visual da página de carrinho com itens', async ({ page }) => {
    await page.goto('/')
    // Add item to cart
    await page.locator('button:has-text("Comprar")').first().click()
    await page.goto('/cart')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('cart-page.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })
})
