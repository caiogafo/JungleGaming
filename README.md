# Jungle Gaming — Kurio NFT Marketplace

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33.svg)](https://playwright.dev/)
[![MSW](https://img.shields.io/badge/MSW-2.12-FF6A00.svg)](https://mswjs.io/)

Solução de engenharia frontend desenvolvida para o **Frontend Challenge — Jungle Gaming**, implementando o marketplace completo da **Kurio** com fidelidade visual pixel-perfect às especificações do [Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1), tanto em Desktop (1440px) quanto em Mobile (390px).

A aplicação conta com arquitetura reativa moderna, simulação real de rede via **Mock Service Worker (MSW 2)** com suporte a WebSockets/Socket.IO, aritmética financeira de alta precisão em ETH (Wei com `BigInt`), sincronização de estado com a URL sem salto de rolagem, atualizações otimistas com rollback garantido, proteção de pagamento por idempotência e suíte completa de testes automatizados E2E no Playwright.

---

## 🚀 Acesso Rápido

- 🌐 **Deploy em Produção (Vercel)**: *(Configurado e sincronizado via branch `main`)*
- 🎨 **Figma Reference**: [Frontend Challenge (Node 0:1)](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
- 📐 **Documentação Arquitetural Detalhada**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 📋 **Especificação Original do Desafio**: [CHALLENGE.md](./CHALLENGE.md)

---

## 🔑 Credenciais para Avaliação

O marketplace vem pré-populado com dois perfis de usuário com históricos distintos no banco de dados simulado (`localStorage`):

| Perfil | E-mail | Senha | Características do Mock |
|---|---|---|---|
| **Alex (VIP Hunter)** | `alex@junglegaming.io` | `Password123!` | 2 carteiras vinculadas (Ethereum Mainnet primária e Polygon secundária), saldo 4.25 ETH, favoritos e histórico pré-salvos |
| **Sara (Crypto Whale)** | `sara@junglegaming.io` | `Password123!` | Perfil limpo para testes de primeiro onboarding e cadastro de novas carteiras |

> 💡 **Dica de Avaliação**: No modal de Login, botões de preenchimento rápido permitem alternar entre usuários com um único clique. Também é possível registrar novas contas livremente.

---

## 🛠️ Barra de Controle de Cenários (Scenario Control Bar)

Fixada no topo de todas as páginas da aplicação, há uma **barra interativa** desenhada para os avaliadores testarem e validarem em tempo real a resiliência e as funcionalidades avançadas:

1. **Simulador de Latência de Rede (0ms, 150ms, 400ms, 1200ms)**:
   - Permite auditar os **skeletons com efeito shimmer anti-CLS** e transições suaves de carregamento.
2. **Toggle de Erro 500 na API**:
   - Força falha no backend simulado para validar a **atualização otimista com rollback automático** ao favoritar NFTs (a interface reage instantaneamente e restaura o estado anterior suavemente caso ocorra falha, exibindo toast de notificação).
3. **Toggle de Timeout de Pedido (504 Gateway Timeout)**:
   - Simula timeout no envio do checkout para comprovar a proteção por chave de idempotência (`Idempotency-Key` UUID v4).
4. **Toggle de Recusa de Pagamento / Assinatura**:
   - Simula rejeição de assinatura pelo usuário ou falha de rede blockchain, confirmando a exibição de feedback de erro com **preservação integral dos itens no carrinho**.
5. **Disparar Alteração de Preço em Tempo Real (Socket.IO)**:
   - Emite um evento via WebSocket simulado (`price:update`), atualizando o card do NFT no catálogo, disparando toast global e exibindo badge de conflito e cotação revalidada caso o carrinho esteja aberto.
6. **Botão "Resetar Mocks"**:
   - Restaura o banco de dados simulado (`localStorage`) ao estado inicial em 1 clique.

---

## 📱 Fidelidade ao Figma & Design System

### 1. Telas do Figma Mapeadas com Precisão
- **Catálogo Principal (Desktop & Mobile)**:
  - Grid de NFTs com filtros por categoria, raridade e faixa de preço.
  - Sincronização em tempo real na URL com `resetScroll: false` (sem salto indesejado ao topo).
  - Banners Promocionais (*"Lançamentos gênesis de edição limitada"* e *"Arte digital selecionada e muito mais"*) com linhas decorativas curvas concêntricas (`strokeWidth` diferenciado entre a linha externa e interna) calibradas pelas coordenadas do Figma.
  - Seção editorial *"Diário da Cunhagem"* com 4 colunas responsivas de artigos e links de leitura.
  - Paginação completa no catálogo em desktop e mobile (`1 2 3 4 >`).
- **Detalhe do NFT (`/nft/:id`)**:
  - Miniaturas verticais, imagem principal com lightbox de zoom, seletor de edições e quantidade.
  - Abas de especificações técnicas e avaliações de colecionadores.
  - Seção *"Mais desta coleção"* com 5 colecionáveis recomendados e indicadores de páginação `○ ● ○` presentes tanto em desktop quanto em mobile.
  - Barra de compra sticky no mobile com ajuste de quantidade e botão de compra rápida.
- **Carrinho de Compras (`/cart`)**:
  - Resumo de itens com controles de quantidade coloridos (`-` marrom e `+` âmbar), cupom de desconto com cálculo de desconto automático (`JUNGLE10`), taxa de rede de 0.016 ETH e botão `Conectar e finalizar`.
  - Seção recomendada *"Colecionadores também viram"* com 5 cards e paginação centralizada `○ ● ○`.

### 2. Telas e Fluxos Complementares Desenvolvidos (Além do Figma)
Para entregar uma experiência completa de ponta a ponta, foram concebidas e construídas telas adicionais que mantêm rigorosamente o mesmo design system, paleta e tipografia:
- **Fluxo de Checkout Completo (`/checkout`)**:
  - Seleção de carteira conectada, identificação do colecionador, resumo com cupom ativo e acionamento seguro de compra.
- **Recibo de Compra Imutável (`/receipt/:id`)**:
  - Confirmação com snapshot congelado dos preços, hash de transação Ethereum (`0x...`), bloco e carteira pagadora.
- **Central do Perfil (`/profile`)**:
  - Gestão de dados pessoais, avatar customizável, abas de favoritos e gerenciamento de múltiplas carteiras (Principal e Secundária).
- **Modais Globais & Feedback**:
  - Drawer lateral do carrinho com cotação dinâmica.
  - Modal de autenticação com login e cadastro de novos usuários.
  - Página 404 personalizada e feedback visual de estados vazios (empty states).

---

## 📦 Stack Tecnológica

| Camada | Tecnologia | Decisão Técnica |
|---|---|---|
| **Framework & UI** | React 19 + TypeScript | Tipagem estrita com contratos compartilhados entre transporte e estado |
| **Roteamento** | TanStack Router | Type-safe routing com URL Search Params sincronizados na busca e paginação |
| **Estado Remoto** | TanStack Query v5 | Cache com stale-while-revalidate, rollback otimista e isolamento por sessão |
| **Cliente HTTP** | Axios | Interceptors de autenticação JWT simulada e injeção de headers de idempotência |
| **Tempo Real** | Socket.IO Client + `@mswjs/socket.io-binding` | Mock real de WebSocket via Service Worker com deduplicação de eventos |
| **Mocking** | Mock Service Worker (MSW 2.x) | Interceptação em nível de Service Worker no navegador, sem código fictício no React |
| **Estilização** | Tailwind CSS v3 + Radix UI | Paleta Kurio Dark Amber (`#140E0C`, `#291C19`, `#37271c`, `#D98A53`), tipografia monospace e sans |
| **Cálculo Financeiro** | BigInt Arithmetic (`src/lib/eth.ts`) | Aritmética decimal de precisão fixa em Wei ($10^{18}$), eliminando imprecisões de float IEEE 754 |
| **Testes E2E** | Playwright | 12 cenários de teste automatizados + regressão visual desktop (1440x900) e mobile (390x844) |

---

## 🏃 Como Executar Localmente

### Pré-requisitos
- **Node.js**: v20.x ou superior (testado em Node v22 e v24)
- **npm**: v10.x ou superior

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/caio-gafo/JungleGaming.git
cd JungleGaming
npm install
```

### 2. Rodar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:5173/](http://localhost:5173/).

### 3. Rodar Build de Produção e Preview
```bash
npm run build
npm run preview
```
O preview do build de produção estará disponível em [http://localhost:4173/](http://localhost:4173/).

---

## 🧪 Suíte de Testes Automatizados (Playwright)

A suíte cobre integralmente todos os cenários solicitados no desafio:

```bash
# Executar todos os testes E2E no Chrome Desktop
npx playwright test --project=chrome-desktop

# Executar testes em modo Mobile (390x844)
npx playwright test --project=chrome-mobile

# Visualizar o relatório interativo completo
npx playwright show-report
```

### Matriz de Cobertura dos Cenários de Avaliação

| # | Cenário de Avaliação | Arquivo de Teste | Status |
|---|---|---|:---:|
| 1 | **Catálogo, Busca, Filtros Combinados e Histórico** | [`e2e/01_catalog_filters.spec.ts`](./e2e/01_catalog_filters.spec.ts) | ✅ Coberto |
| 2 | **Acesso Direto ao Detalhe e Recurso Inexistente (404)** | [`e2e/02_nft_details.spec.ts`](./e2e/02_nft_details.spec.ts) | ✅ Coberto |
| 3 | **Autenticação, Cadastro, Conflito (409), Sessão e Logout** | [`e2e/03_auth_session.spec.ts`](./e2e/03_auth_session.spec.ts) | ✅ Coberto |
| 4 | **Favoritos com Atualização Otimista e Rollback no Erro 500** | [`e2e/04_favorites_optimistic.spec.ts`](./e2e/04_favorites_optimistic.spec.ts) | ✅ Coberto |
| 5 | **Carrinho, Quantidades, Cupom (`JUNGLE10` / `EXPIRED`) e Refresh** | [`e2e/05_cart_management.spec.ts`](./e2e/05_cart_management.spec.ts) | ✅ Coberto |
| 6 | **Compra Completa, do Catálogo ao Recibo Confirmado (Snapshot TX)** | [`e2e/06_checkout_purchase.spec.ts`](./e2e/06_checkout_purchase.spec.ts) | ✅ Coberto |
| 7 | **Resiliência de Pagamento, Rejeição e Idempotência (`Idempotency-Key`)** | [`e2e/07_payment_resilience.spec.ts`](./e2e/07_payment_resilience.spec.ts) | ✅ Coberto |
| 8 | **Edição de Perfil, Avatar e Gestão de Carteiras (Principal/Secundária)** | [`e2e/08_profile_wallets.spec.ts`](./e2e/08_profile_wallets.spec.ts) | ✅ Coberto |
| 9 | **Tempo Real (Socket.IO) com Conflito de Cotação no Carrinho** | [`e2e/09_realtime_socket.spec.ts`](./e2e/09_realtime_socket.spec.ts) | ✅ Coberto |
| 10 | **Ordenação Monotônica, Deduplicação e Reconexão Socket.IO** | [`e2e/10_socket_events_ordering.spec.ts`](./e2e/10_socket_events_ordering.spec.ts) | ✅ Coberto |
| 11 | **Acessibilidade (a11y), Navegação por Teclado, Foco e ARIA** | [`e2e/11_a11y_keyboard_forms.spec.ts`](./e2e/11_a11y_keyboard_forms.spec.ts) | ✅ Coberto |
| 12 | **Placeholders Shimmer Skeletons Anti-CLS durante Latência** | [`e2e/12_skeletons_loading.spec.ts`](./e2e/12_skeletons_loading.spec.ts) | ✅ Coberto |
| - | **Regressão Visual Desktop e Mobile** | [`e2e/visual_regression.spec.ts`](./e2e/visual_regression.spec.ts) | ✅ Coberto |

---

## 🏛️ Destaques de Arquitetura e Engenharia

### 1. Aritmética Financeira em ETH Sem Ponto Flutuante
Valores em criptoativos não podem sofrer imprecisões do formato `IEEE 754` (`0.1 + 0.2 !== 0.3`). Implementamos o módulo [`src/lib/eth.ts`](./src/lib/eth.ts), que converte valores para ponto fixo usando inteiros `BigInt` (precisão de 18 casas decimais — Wei). Todas as somas, descontos percentuais e taxas de rede são calculados com precisão matemática absoluta e formatados apenas para exibição visual.

### 2. Estado da URL com TanStack Router e Rolagem Preservada
Toda a parametrização do catálogo (busca por texto, filtro de categorias, filtro de raridade, ordenação por preço e número da página) é sincronizada bidirecionalmente com a URL (`/?search=ape&rarity=Lendário&sortBy=price_desc&page=1`). Usando `resetScroll: false` e `replace: true`, o usuário pode aplicar filtros e paginar sem que a página salte bruscamente para o topo.

### 3. Atualizações Otimistas com Rollback Garantido
Ao interagir com o botão de favoritos em qualquer card ou página de detalhe, o TanStack Query cancela consultas em andamento, faz um snapshot do estado anterior e aplica a alteração instantaneamente na tela. Se a mutação falhar (ou se o botão "Erro 500 API" na barra de cenários estiver ativado), o rollback restaura o estado anterior e uma notificação de erro é disparada.

### 4. Idempotência de Pagamento
Ao iniciar um pedido em [`src/hooks/useOrders.ts`](./src/hooks/useOrders.ts), a aplicação gera um UUID v4 no header `Idempotency-Key`. Se o usuário der múltiplos cliques no botão de compra ou se a conexão oscilar e for reenviada, o backend simulado reconhece a mesma transação e devolve a resposta do pedido original sem gerar duplicidade de cobrança.

### 5. WebSockets e Tempo Real Resiliente
Utilizamos `socket.io-client` integrado ao mock MSW através de `@mswjs/socket.io-binding`. O hook [`src/socket/useRealtimeSync.ts`](./src/socket/useRealtimeSync.ts) implementa:
- **Deduplicação de mensagens**: Chaveamento por `event_id` para evitar notificações duplicadas.
- **Ordenação por versão**: Rejeição de atualizações com `version` inferior ou igual à já aplicada.
- **Auto-reconciliação ao reconectar**: Invalidação automática dos caches do TanStack Query para sincronizar dados após queda de rede.

### 6. Recibo Imutável de Compra
A tela de confirmação de pedido ([`src/routes/receipt.$id.tsx`](./src/routes/receipt.$id.tsx)) exibe um snapshot congelado da transação no momento da compra (preços congelados, hash da transação, carteira pagadora e rede selecionada). Alterações posteriores de preço no catálogo não afetam o recibo histórico.

---

## 📄 Licença e Propriedade

Desenvolvido para o processo seletivo da **Jungle Gaming**.  
Código limpo, fortemente tipado e pronto para produção.
