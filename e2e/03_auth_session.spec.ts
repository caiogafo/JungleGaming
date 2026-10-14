import { test, expect } from '@playwright/test'

test.describe('Cenário 3: Autenticação, Cadastro, Conflito, Sessão e Logout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve realizar login, persistir após refresh e realizar logout', async ({ page }) => {
    // Open auth modal
    await page.click('button:has-text("Entrar / Cadastrar")')
    await expect(page.locator('h2:has-text("Acessar Conta Jungle")')).toBeVisible()

    // Use Quick fill button for Alex
    await page.click('button:has-text("Alex (VIP Hunter)")')
    await page.click('button:has-text("Entrar na Plataforma")')

    // Modal should close and user avatar should be displayed
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Caio Jungle Hunter')).toBeVisible()

    // Refresh page (F5) - session must survive
    await page.reload()
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })

    // Open user menu and click logout
    await page.click('button[aria-label="Menu do usuário"]')
    await page.click('button:has-text("Encerrar Sessão")')

    // User should be logged out
    await expect(page.locator('button:has-text("Entrar / Cadastrar")')).toBeVisible()
  })

  test('deve tratar conflito de cadastro quando o email já existe (409)', async ({ page }) => {
    await page.click('button:has-text("Entrar / Cadastrar")')
    await page.click('button:has-text("Cadastre-se aqui")')

    // Try to register with already existing email alex@junglegaming.io
    await page.fill('input[placeholder="Seu nome"]', 'Alex Duplicado')
    await page.fill('input[placeholder="ex: colecionador_jungle"]', 'alexdup')
    await page.fill('input[type="email"]', 'alex@junglegaming.io')
    await page.fill('input[type="password"]', 'senha123')

    await page.click('button:has-text("Criar Minha Conta")')

    // Expect conflict error feedback
    await expect(page.locator('text=E-mail já cadastrado na plataforma')).toBeVisible({ timeout: 5000 })
  })
})
