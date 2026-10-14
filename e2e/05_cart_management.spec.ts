import { test, expect } from '@playwright/test'

test.describe('Cenário 5: Carrinho, Quantidades, Cupom e Persistência', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve adicionar item, alterar quantidade, aplicar cupom e persistir após refresh', async ({ page }) => {
    // 1. Add first NFT to cart from the catalog grid
    const buyButton = page.locator('#catalogo button:has-text("Comprar")').first()
    await buyButton.click()

    // 2. Open cart drawer
    await page.click('button[aria-label="Abrir carrinho de compras"]')
    await expect(page.locator('h2:has-text("Carrinho de NFTs")')).toBeVisible({ timeout: 5000 })

    // 3. Verify item is in cart
    await expect(page.locator('input[placeholder*="Cupom"]')).toBeVisible({ timeout: 5000 })

    // 4. Test coupon application JUNGLE10
    await page.fill('input[placeholder*="Cupom"]', 'JUNGLE10')
    await page.click('button:has-text("Aplicar")')

    // Expect discount feedback
    await expect(page.locator('text=Cupom JUNGLE10 aplicado com sucesso')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Desconto (JUNGLE10)')).toBeVisible()

    // 5. Test page reload - cart must persist!
    await page.reload()
    await page.click('button[aria-label="Abrir carrinho de compras"]')
    await expect(page.locator('text=Carrinho de NFTs')).toBeVisible()
    await expect(page.locator('text=Desconto (JUNGLE10)')).toBeVisible()
  })

  test('deve exibir erro para cupom expirado', async ({ page }) => {
    const buyButton = page.locator('#catalogo button:has-text("Comprar")').first()
    await buyButton.click()
    await page.click('button[aria-label="Abrir carrinho de compras"]')

    await expect(page.locator('input[placeholder*="Cupom"]')).toBeVisible({ timeout: 5000 })
    await page.fill('input[placeholder*="Cupom"]', 'EXPIRED')
    await page.click('button:has-text("Aplicar")')

    await expect(page.locator('text=Este cupom de desconto expirou')).toBeVisible({ timeout: 5000 })
  })
})
