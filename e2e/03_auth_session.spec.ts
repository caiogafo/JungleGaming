import { test, expect } from '@playwright/test'

test.describe('Cenário 3: Autenticação, PopUp Entrar / Criar Conta e Preenchimento Automático no Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve abrir o PopUp de autenticação, alternar abas e verificar elementos visuais do Figma', async ({ page }) => {
    // 1. Clicar em Entrar no navbar
    const entrarNavButton = page.locator('header button:has-text("Entrar")')
    await expect(entrarNavButton).toBeVisible()
    await entrarNavButton.click()

    // 2. Verificar Abas Centradas: Entrar | Criar conta
    const abaEntrar = page.locator('button:has-text("Entrar")').nth(1) // primeira dentro do modal
    const abaCriarConta = page.locator('button:has-text("Criar conta")')
    await expect(abaEntrar).toBeVisible()
    await expect(abaCriarConta).toBeVisible()

    // 3. Subtítulo e campos da aba Entrar
    await expect(page.locator('text=Entre para gerenciar sua carteira, coleção e perfil de criador.')).toBeVisible()
    await expect(page.locator('input[placeholder="contato@email.com"]')).toBeVisible()
    await expect(page.locator('input[placeholder="************"]')).toBeVisible()
    await expect(page.locator('button:has-text("Esqueceu a senha?")')).toBeVisible()
    await expect(page.locator('form button:has-text("Entrar")')).toBeVisible()

    // Redes Sociais
    await expect(page.locator('text=Ou continue com')).toBeVisible()
    await expect(page.locator('button:has-text("Continuar com Google")')).toBeVisible()
    await expect(page.locator('button:has-text("Continuar com Facebook")')).toBeVisible()

    // 4. Alternar para a aba Criar conta
    await abaCriarConta.click()

    // Verificar subtítulo e campos da aba Criar conta
    await expect(page.locator('text=Crie seu perfil de colecionador e conecte uma carteira quando quiser.')).toBeVisible()
    await expect(page.locator('input[placeholder="Nome de usuário"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Digite seu e-mail"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Senha"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Confirmar senha"]')).toBeVisible()
    await expect(page.locator('form button:has-text("Criar conta")')).toBeVisible()
  })

  test('deve realizar login com contato@email.com e preencher automaticamente os dados no checkout', async ({ page }) => {
    // 1. Adicionar item ao carrinho primeiro para ter itens no checkout
    const buyButton = page.locator('#catalogo button:has-text("Comprar")').first()
    await buyButton.click()

    // 2. Clicar em Entrar no topo
    await page.click('header button:has-text("Entrar")')

    // 3. Preencher login
    await page.fill('input[placeholder="contato@email.com"]', 'contato@email.com')
    await page.fill('input[placeholder="************"]', 'senha123')
    await page.click('form button:has-text("Entrar")')

    // 4. Verificar se usuário está autenticado no cabeçalho
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Novo Sato')).toBeVisible()

    // 5. Navegar para a tela de compra / checkout
    await page.goto('/checkout')

    // 6. Verificar que os campos de perfil do colecionador foram preenchidos automaticamente
    await expect(page.locator('input[placeholder="Ex: Novo Sato"]')).toHaveValue('Novo Sato')
    await expect(page.locator('input[placeholder="Ex: @novosato"]')).toHaveValue('@novosato')
    await expect(page.locator('input[placeholder="Ex: colecionador@kurio.art"]')).toHaveValue('contato@email.com')
    await expect(page.locator('select').first()).toHaveValue('Ethereum')
    await expect(page.locator('input[placeholder="Endereço 0x da carteira"]')).toHaveValue('0x71C836466D380195A852277d337a85F756F304B1')
    await expect(page.locator('select').nth(2)).toHaveValue('.eth')
  })

  test('deve criar conta com novo usuário e preencher seus dados automaticamente no checkout', async ({ page }) => {
    // 1. Adicionar item ao carrinho
    const buyButton = page.locator('#catalogo button:has-text("Comprar")').first()
    await buyButton.click()

    // 2. Clicar em Entrar e alternar para Criar conta
    await page.click('header button:has-text("Entrar")')
    await page.click('button:has-text("Criar conta")')

    // 3. Preencher formulário de criação de conta
    const uniqueUser = `hunter_${Date.now()}`
    const uniqueEmail = `${uniqueUser}@teste.com`

    await page.fill('input[placeholder="Nome de usuário"]', uniqueUser)
    await page.fill('input[placeholder="Digite seu e-mail"]', uniqueEmail)
    await page.fill('input[placeholder="Senha"]', 'teste123')
    await page.fill('input[placeholder="Confirmar senha"]', 'teste123')
    await page.click('form button:has-text("Criar conta")')

    // 4. Modal fecha e usuário autentica
    await expect(page.locator('button[aria-label="Menu do usuário"]')).toBeVisible({ timeout: 5000 })

    // 5. Ir para /checkout
    await page.goto('/checkout')

    // 6. Dados devem estar preenchidos com o novo usuário criado
    await expect(page.locator('input[placeholder="Ex: Novo Sato"]')).toHaveValue(uniqueUser)
    await expect(page.locator('input[placeholder="Ex: @novosato"]')).toHaveValue(`@${uniqueUser}`)
    await expect(page.locator('input[placeholder="Ex: colecionador@kurio.art"]')).toHaveValue(uniqueEmail)
    await expect(page.locator('select').first()).toHaveValue('Ethereum')
    await expect(page.locator('input[placeholder="Endereço 0x da carteira"]')).not.toHaveValue('')
  })
})
