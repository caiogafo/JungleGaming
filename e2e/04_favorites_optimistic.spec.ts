import { test, expect } from '@playwright/test'

test.describe('Cenário 4: Favoritos com Atualização Otimista e Rollback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Authenticate user
    await page.click('button:has-text("Entrar / Cadastrar")')
    await page.click('button:has-text("Alex (VIP Hunter)")')
    await page.click('button:has-text("Entrar na Plataforma")')
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })
  })

  test('deve aplicar atualização otimista imediata ao favoritar um NFT', async ({ page }) => {
    // Locate the first NFT favorite button
    const favButton = page.locator('button[aria-label*="favoritos"]').first()
    await expect(favButton).toBeVisible()

    // Click to toggle favorite
    await favButton.click()

    // Button should immediately reflect active state without waiting for network
    await expect(favButton).toHaveClass(/bg-red-500/)
  })

  test('deve realizar rollback do estado otimista quando a mutation da API falhar', async ({ page }) => {
    // Open scenario toolbar and activate 500 error
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("Erro 500 API")')

    const favButton = page.locator('button[aria-label*="favoritos"]').first()

    // Attempt to toggle
    await favButton.click()

    // Due to 500 error, after onSettled / onError, state must roll back to original
    await expect(favButton).not.toHaveClass(/bg-red-500/, { timeout: 5000 })

    // Reset 500 error
    await page.click('button:has-text("Erro 500 API")')
  })
})
