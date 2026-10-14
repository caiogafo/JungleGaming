import { test, expect } from '@playwright/test'

test.describe('Cenário 6: Compra Completa, do Catálogo ao Recibo Confirmado', () => {
  test('deve executar o fluxo completo de ponta a ponta com sucesso', async ({ page }) => {
    await page.goto('/')

    // 1. Authenticate user
    await page.click('button:has-text("Entrar / Cadastrar")')
    await page.click('button:has-text("Alex (VIP Hunter)")')
    await page.click('button:has-text("Entrar na Plataforma")')
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })

    // 2. Add an item to cart
    const buyButton = page.locator('#catalogo button:has-text("Comprar")').first()
    await buyButton.click()

    // 3. Open cart and advance to checkout
    await page.click('button[aria-label="Abrir carrinho de compras"]')
    await page.click('button:has-text("Finalizar Pedido")')

    // 4. Verify checkout page loaded
    await expect(page).toHaveURL(/.*checkout/)
    await expect(page.locator('h1:has-text("Pagamento e Finalização")')).toBeVisible()

    // 5. Select network and agree to terms
    await page.selectOption('#network-select', 'Ethereum')
    await page.check('#terms-check')

    // 6. Submit order
    await page.click('button:has-text("Confirmar e Finalizar Compra")')

    // 7. Verify redirect to receipt page and confirmation snapshot
    await expect(page).toHaveURL(/.*receipt/)
    await expect(page.locator('h1:has-text("Compra Realizada com Sucesso!")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Hash da Transação (TX)')).toBeVisible()
    await expect(page.locator('button:has-text("Copiar Hash")')).toBeVisible()
  })
})
