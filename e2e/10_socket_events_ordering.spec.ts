import { test, expect } from '@playwright/test'

test.describe('Cenário 10: Ordenação, Deduplicação e Reconexão de Eventos Socket.IO', () => {
  test('deve tolerar múltiplos disparos de eventos sem duplicar notificações', async ({ page }) => {
    await page.goto('/')

    // Trigger price change twice rapidly
    await page.click('button:has-text("Cenários de Teste")')
    await page.click('button:has-text("Disparar Alteração de Preço")')
    await page.click('button:has-text("Disparar Alteração de Preço")')

    // Alert should appear cleanly without UI crash
    await expect(page.locator('text=Tempo Real (Socket.IO)')).toBeVisible()

    // Dismiss alert
    await page.click('button[aria-label="Dispensar aviso"]')
    await expect(page.locator('text=Tempo Real (Socket.IO)')).not.toBeVisible()
  })
})
