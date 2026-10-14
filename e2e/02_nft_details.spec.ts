import { test, expect } from '@playwright/test'

test.describe('Cenário 2: Acesso Direto ao Detalhe e Recurso Inexistente', () => {
  test('deve acessar diretamente a página de detalhes de um NFT válido', async ({ page }) => {
    await page.goto('/nft/nft_1')

    // Title and collections
    await expect(page.locator('h1:has-text("Emerald Varsity Ape #042")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Jungle Ape Yacht Club').first()).toBeVisible()

    // Editions and pricing
    await expect(page.locator('text=Standard Edition').first()).toBeVisible()
    await expect(page.locator('text=0.8500 ETH').first()).toBeVisible()
    await expect(page.locator('button:has-text("Comprar Agora")')).toBeEnabled()
  })

  test('deve respeitar a seleção de edição e limite de quantidade', async ({ page }) => {
    await page.goto('/nft/nft_1')
    await expect(page.locator('h1')).toBeVisible()

    // Switch to Holo Foil edition
    await page.click('button:has-text("Holo Foil Variant")')
    await expect(page.locator('text=1.4500 ETH').first()).toBeVisible()

    // Test increase quantity button
    const increaseBtn = page.locator('button[aria-label="Aumentar quantidade"]')
    await increaseBtn.click()
    await expect(page.locator('span:has-text("2")').first()).toBeVisible()
  })

  test('deve exibir feedback de 404 para identificador inexistente e permitir retorno', async ({ page }) => {
    await page.goto('/nft/nft_inexistente_999')

    await expect(page.locator('h2:has-text("NFT Não Encontrado")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Voltar ao Catálogo")')).toBeVisible()

    // Clicking button navigates back to /
    await page.click('button:has-text("Voltar ao Catálogo")')
    await expect(page).toHaveURL('http://localhost:4173/')
  })
})
