import { test, expect } from '@playwright/test'

test.describe('Cenário 1: Catálogo, Busca, Filtros Combinados e Histórico', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for initial catalog cards to render
    await expect(page.locator('h3:has-text("Emerald Varsity Ape")')).toBeVisible({ timeout: 10000 })
  })

  test('deve filtrar por busca de texto e atualizar a URL', async ({ page }) => {
    const searchInput = page.locator('#search-input')
    await searchInput.fill('Emerald')

    // Should filter to Emerald NFTs
    await expect(page.locator('h3:has-text("Emerald Varsity Ape #042")')).toBeVisible()
    await expect(page.locator('h3:has-text("Black Chimpanzee Executive #007")')).not.toBeVisible()

    // URL should contain search parameter
    expect(page.url()).toContain('search=Emerald')
  })

  test('deve combinar filtros de categoria e ordenação por preço', async ({ page }) => {
    // Select category "Jungle Apes"
    await page.click('button:has-text("Jungle Apes")')
    expect(page.url()).toContain('category=Apes')

    // Select sort by price ascending
    await page.selectOption('#sort-select', 'price_asc')
    expect(page.url()).toContain('sort=price_asc')

    // Verified filtered items are present
    await expect(page.locator('h3:has-text("Emerald Cadet Ape #089")')).toBeVisible()
  })

  test('deve restaurar estado completo ao navegar pelo histórico (Voltar / Avançar)', async ({ page }) => {
    // 1. Search for Cyber
    await page.locator('#search-input').fill('Cyber')
    await expect(page.locator('h3:has-text("Phantom Sage Ape #108")')).toBeVisible()

    // 2. Change category
    await page.click('button:has-text("Cyber Primates")')
    expect(page.url()).toContain('category=Cyber')

    // 3. Navigate back
    await page.goBack()
    // URL and state should reflect previous search without category
    expect(page.url()).not.toContain('category=Cyber')

    // 4. Navigate forward
    await page.goForward()
    expect(page.url()).toContain('category=Cyber')
  })
})
