import { test, expect } from '@playwright/test'

test.describe('Cenário 8: Edição de Perfil, Avatar e Gestão de Carteiras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Login
    await page.click('button:has-text("Entrar / Cadastrar")')
    await page.click('button:has-text("Alex (VIP Hunter)")')
    await page.click('button:has-text("Entrar na Plataforma")')
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })
  })

  test('deve atualizar dados do colecionador e avatar', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.locator('h1:has-text("Painel do Colecionador")')).toBeVisible({ timeout: 5000 })

    // Change avatar
    await page.click('button:has-text("Avatar 2")')

    // Save profile changes
    await page.click('button:has-text("Salvar Alterações")')
    await expect(page.locator('text=Dados do colecionador salvos com sucesso!')).toBeVisible({ timeout: 5000 })
  })

  test('deve cadastrar nova carteira e validar formato do endereço', async ({ page }) => {
    await page.goto('/wallets')
    await expect(page.locator('h1:has-text("Carteiras Web3 Conectadas")')).toBeVisible({ timeout: 5000 })

    // Test invalid address validation
    await page.fill('input[placeholder*="Minha MetaMask"]', 'Carteira Teste')
    await page.fill('input[placeholder*="0x71C"]', 'endereco_invalido')
    await page.click('button:has-text("Adicionar Carteira")')

    await expect(page.locator('text=Endereço inválido')).toBeVisible()

    // Test valid 0x + 40 hex char address
    const validAddress = '0x1234567890123456789012345678901234567890'
    await page.fill('input[placeholder*="0x71C"]', validAddress)
    await page.click('button:has-text("Adicionar Carteira")')

    await expect(page.locator('text=Carteira cadastrada com sucesso!')).toBeVisible({ timeout: 5000 })
    await expect(page.locator(`text=${validAddress}`)).toBeVisible()
  })
})
