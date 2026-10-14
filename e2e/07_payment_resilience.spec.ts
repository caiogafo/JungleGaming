import { test, expect } from '@playwright/test'

test.describe('Cenário 7: Resiliência de Pagamento, Rejeição e Idempotência', () => {
  test('deve tratar recusa de pagamento, exibir erro e preservar itens no carrinho', async ({ page }) => {
    await page.goto('/')

    // Login
    await page.click('button:has-text("Entrar / Cadastrar")')
    await page.click('button:has-text("Alex (VIP Hunter)")')
    await page.click('button:has-text("Entrar na Plataforma")')

    // Add item to cart
    await page.locator('#catalogo button:has-text("Comprar")').first().click()
    await page.click('button[aria-label="Abrir carrinho de compras"]')
    await page.click('button:has-text("Finalizar Pedido")')

    // Activate simulated payment rejection
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("Simular Pagamento Recusado")')

    // Agree to terms and submit order
    await page.check('#terms-check')
    await page.click('button:has-text("Confirmar e Finalizar Compra")')

    // Error feedback should be displayed
    await expect(page.locator('text=Transação recusada pela rede blockchain')).toBeVisible({ timeout: 5000 })

    // Return to cart - items MUST be preserved in failure scenario!
    await page.goto('/cart')
    await expect(page.locator('h1:has-text("Carrinho de NFTs")')).toBeVisible()
    await expect(page.locator('text=Subtotal')).toBeVisible()

    // Disable rejection scenario
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("Simular Pagamento Recusado")')
  })
})
