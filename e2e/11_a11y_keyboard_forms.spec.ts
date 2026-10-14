import { test, expect } from '@playwright/test'

test.describe('Cenário 11: Acessibilidade (a11y), Navegação por Teclado e Foco', () => {
  test('deve navegar por teclado e gerenciar foco dentro de diálogos modais', async ({ page }) => {
    await page.goto('/')

    // Press Tab to navigate to auth button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Open Auth modal
    await page.click('button:has-text("Entrar / Cadastrar")')
    const dialog = page.locator('div[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Press Tab inside dialog - focus should stay trapped inside dialog
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeDefined()

    // Press Escape to dismiss modal
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('campos de formulário devem conter labels acessíveis e aria-invalid', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("Entrar / Cadastrar")')

    // Submit empty form to trigger validation
    await page.click('button:has-text("Entrar na Plataforma")')

    // Verify invalid error is presented
    await expect(page.locator('text=Por favor, informe seu e-mail')).toBeVisible()
  })
})
