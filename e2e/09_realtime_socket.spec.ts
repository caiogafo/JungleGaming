import { test, expect } from '@playwright/test'

test.describe('Cenário 9: Tempo Real (Socket.IO) com Conflito de Cotação', () => {
  test('deve detectar alteração de preço em tempo real no carrinho e exibir alerta', async ({ page }) => {
    await page.goto('/')

    // Add Emerald Ape to cart
    await page.locator('#catalogo button:has-text("Comprar")').first().click()
    await expect(page.locator('button[aria-label="Abrir carrinho de compras"] span')).toBeVisible({ timeout: 5000 })

    // Trigger simulated price change via Scenario toolbar
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("Disparar Alteração de Preço")')

    // Expect real-time alert banner to appear
    await expect(page.locator('text=Tempo Real (Socket.IO)')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Atenção: O NFT #nft_1 teve atualizações')).toBeVisible()

    // Dismiss notice
    await page.click('button[aria-label="Dispensar aviso"]')
    await expect(page.locator('text=Tempo Real (Socket.IO)')).not.toBeVisible()
  })
})
