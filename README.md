# Jungle Gaming — NFT Marketplace

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33.svg)](https://playwright.dev/)
[![MSW](https://img.shields.io/badge/MSW-2.12-FF6A00.svg)](https://mswjs.io/)

Solucao desenvolvida para o **Frontend Challenge — Jungle Gaming**, implementando o marketplace completo de NFTs conforme a identidade visual e os fluxos do [Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1).

A aplicacao conta com arquitetura reativa moderna, fidelidade pixel-perfect aos frames do Figma (desktop 1440px e mobile 390px), simulacao real de rede via **MSW (Mock Service Worker)** com suporte a WebSockets e Socket.IO, persistencia atomica, calculo financeiro em ETH sem perda de precisao, rollback otimista, idempotencia em pagamentos e suite completa de testes automatizados E2E no Playwright.

---

## Links e Acesso

- **Deploy em Producao (Vercel)**: [https://jungle-gaming-sage.vercel.app/](https://jungle-gaming-sage.vercel.app/)
- **Repositorio GitHub**: [https://github.com/caiogafo/JungleGaming](https://github.com/caiogafo/JungleGaming)
- **Referencia Figma**: [Frontend Challenge (Node 0:1)](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
- **Documentacao Arquitetural Detalhada**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Especificacao Original do Desafio**: [CHALLENGE.md](./CHALLENGE.md)

---

## Variaveis de Ambiente

A solucao e 100% autocontida e executa a partir de um checkout limpo sem depender de servicos privados ou de backends externos. Toda a camada de API e WebSocket e simulada via Service Worker (MSW) e roda diretamente no navegador, inclusive na versao publicada no Vercel.

Nenhum arquivo `.env` e obrigatorio para execucao local ou deploy. As seguintes variaveis opcionais sao suportadas pelo Vite caso necessarias:

```env
# Opcionais (padrao: ativado em dev, preview e producao para demonstracao dos avaliadores)
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=/api
```

---

## Credenciais para Avaliacao

O banco de dados simulado inicializa com dois perfis com caracteristicas distintas:

| Perfil | E-mail | Senha | Caracteristicas do Mock |
|---|---|---|---|
| **Alex (VIP Hunter)** | `alex@junglegaming.io` | `Password123!` | 2 carteiras vinculadas (Ethereum Mainnet primaria e Polygon secundaria), saldo 4.25 ETH, favoritos pre-salvos |
| **Sara (Crypto Whale)** | `sara@junglegaming.io` | `Password123!` | Perfil limpo para testes de primeiro onboarding e cadastro de novas carteiras |

> **Facilidade de Avaliacao**: No modal de Login, botoes de preenchimento rapido permitem alternar entre os usuarios com um unico clique. Tambem e possivel registrar novas contas livremente no formulario de cadastro.

---

## Barra de Controle de Cenarios (Scenario Control Bar)

Fixada no topo de todas as paginas da aplicacao, ha uma barra de controle interativa desenhada especificamente para os avaliadores testarem e validarem em tempo real todos os cenarios de resiliencia e condicoes de rede:

1. **Latencia de Rede (0ms, 150ms, 1200ms, 2500ms)**:
   - Permite auditar os skeletons com efeito shimmer anti-CLS e transicoes suaves de carregamento.
2. **Erro 500 API**:
   - Forca erro interno de servidor nas requisicoes REST simuladas para avaliar tratamento de erro e rollback.
3. **Timeout Pedido**:
   - Simula um timeout (504 Gateway Timeout) na rota de criacao de pedidos para avaliar a idempotencia.
4. **Simular Pagamento Recusado**:
   - Forca recusa de pagamento (erro 402 / transacao rejeitada na carteira) para validar a preservacao dos itens no carrinho.
5. **Disparar Alteracao de Preco (Socket.IO)**:
   - Emite um evento via WebSocket simulado (`price:update`), alterando o valor do NFT no catalogo e gerando aviso de conflito de cotacao caso o carrinho esteja aberto.
6. **Carregar Carrinho Figma**:
   - Disponivel ao expandir "Cenarios de Teste": preenche o carrinho instantaneamente com os 4 itens originais do mockup do Figma (Emerald Ape, Violet Nomad, Ivory Baron e Golden Beat).
7. **Botao "Resetar Mocks"**:
   - Limpa integralmente o localStorage, sessionStorage, caches do banco reativo e retorna a aplicacao ao estado inicial limpo (carrinho zerado, precos originais e inventarios restaurados).

---

## Instrucoes para Reproduzir os Fluxos de Falha

### 1. Atualizacao Otimista com Rollback no Erro 500
1. No topo da tela, clique em **Cenarios de Teste** e ative o botao **Erro 500 API**.
2. No catalogo de NFTs, clique no icone de coracao (favoritar) em qualquer card.
3. Observe que o coracao ativa de forma instantanea (atualizacao otimista na interface).
4. Em seguida, a API simulada responde com status 500. A aplicacao desfaz o estado visual suavemente (rollback) e exibe uma notificacao de erro informando a falha.
5. Desative o botao **Erro 500 API** para restaurar a operacao normal.

### 2. Idempotencia e Recuperacao de Timeout na Compra
1. Adicione qualquer NFT ao carrinho e avance para o Checkout (`/checkout`).
2. Conecte uma carteira (utilize o usuario Alex com preenchimento rapido).
3. No painel de controle superior, ative a opcao **Timeout Pedido**.
4. Clique no botao de finalizar pedido. O pedido falha com timeout sem duplicar cobranca.
5. Ao reenviar com a mesma chave de idempotencia (`Idempotency-Key` gerada no header), o pedido e recuperado com sucesso sem cobrar duas vezes.
6. Desative o **Timeout Pedido** apos o teste.

### 3. Pagamento Recusado e Preservacao de Itens no Carrinho
1. No painel superior, ative **Simular Pagamento Recusado**.
2. No checkout, clique em **Conectar e finalizar**.
3. A interface simula a recusa da assinatura na carteira Web3 e exibe alerta visual de recusa de transacao.
4. Navegue de volta ao carrinho (`/cart`): todos os itens, quantidades e cupons permanecem intactos, permitindo que o usuario tente novamente.
5. Desative a simulacao de recusa.

### 4. Alteracao de Preco em Tempo Real (Socket.IO) com Conflito de Cotacao
1. Acesse o carrinho (`/cart`) tendo o item **Emerald Ape #042** presente (ou use o botao **Carregar Carrinho Figma** em Cenarios de Teste).
2. No painel superior, clique em **Disparar Alteracao de Preco**.
3. O mock emite o evento `nft.updated` via WebSocket.
4. A tela do carrinho identifica a variacao de cotacao em tempo real, atualiza os valores e emite aviso visual de alteracao de preco antes de permitir a conclusao da compra.

### 5. Reset Integral dos Mocks
1. A qualquer momento, clique no botao vermelho **Resetar Mocks** no canto superior direito.
2. O sistema remove todos os dados em cache, limpa os storages locais e recarrega a aplicacao com o carrinho zerado e todos os estados originais de fabrica.

---

## Decisoes de Design para Telas e Estados Nao Mapeados no Figma

O arquivo do Figma concentrou os layouts nas visoes principais do catalogo, detalhe de item e resumo de carrinho. Para entregar uma experiencia completa e consistente de nivel senior, os fluxos e estados complementares foram desenhados seguindo rigorosamente os tokens visuais, paleta de cores e tipografia da marca Kurio:

1. **Fluxo de Autenticacao e Cadastro**:
   - Modais com backdrop blur, validacao em tempo real de e-mail e forca de senha, tratamento de conflito (erro 409 para e-mail duplicado) e atalhos rapidos de login para os avaliadores.
2. **Gerenciamento de Perfil e Carteiras**:
   - Painel de edicao de nome, bio e foto de perfil, alem de listagem de carteiras ativas com indicacao de rede (Ethereum / Polygon), selecao de carteira primaria, adicao de nova carteira e visualizacao da lista de desejos (wishlist).
3. **Tela de Recibo de Compra (Receipt)**:
   - Confirmacao imutavel pos-checkout com resumo dos itens adquiridos, valores congelados no momento do fechamento, taxa de rede, hash de transacao simulado na blockchain e atalho para retorno ao catalogo.
4. **Estados Vazios (Empty States)**:
   - Carrinho vazio com botao de chamada para explorar o catalogo, busca sem resultados orientando ajuste de termos e filtros, e perfil sem itens salvos.
5. **Estados de Erro e Pagina 404**:
   - Pagina dedicada para rotas inexistentes ou IDs de NFT invalidos, mantendo a navegacao funcional e estetica integrada.
6. **Fidelidade Mobile**:
   - No catalogo mobile, foram integradas as secoes completas de paginacao, banners promocionais com curvas decorativas e o Diario da Cunhagem, alem da secao "Mais desta colecao" no detalhe do NFT, respeitando o espacamento da barra de navegacao inferior flutuante.

---

## Stack Tecnologica

| Camada | Tecnologia | Decisao Tecnica |
|---|---|---|
| **Framework & UI** | React 19 + TypeScript | Tipagem estrita com contratos compartilhados entre transporte e estado |
| **Roteamento** | TanStack Router | Type-safe routing com URL Search Params sincronizados na busca e paginacao |
| **Estado Remoto** | TanStack Query v5 | Cache com stale-while-revalidate, rollback otimista e isolamento por sessao |
| **Cliente HTTP** | Axios | Interceptors de autenticacao JWT simulada e injecao de headers de idempotencia |
| **Tempo Real** | Socket.IO Client + `@mswjs/socket.io-binding` | Mock real de WebSocket via Service Worker com deduplicacao de eventos |
| **Mocking** | Mock Service Worker (MSW 2.x) | Interceptacao em nivel de Service Worker no navegador, sem codigo ficticio no React |
| **Estilizacao** | Tailwind CSS v3 + Radix UI | Tokens exatos do Figma: paleta Dark Amber (`#140E0C`, `#291C19`, `#D98A53`) |
| **Calculo Financeiro** | BigInt Arithmetic (`src/lib/eth.ts`) | Aritmetica decimal de precisao fixa em Wei ($10^{18}$), eliminando bugs de float IEEE 754 |
| **Testes E2E** | Playwright | 12 cenarios de teste automatizados + regressao visual desktop (1440x900) e mobile (390x844) |

---

## Execucao Local

### Pre-requisitos
- Node.js: v20.x ou superior (desenvolvido e testado no Node v24)
- npm: v10.x ou superior

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/caiogafo/JungleGaming.git
cd JungleGaming
npm install
```

### 2. Rodar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicacao em [http://localhost:5173/](http://localhost:5173/). O Service Worker do MSW e registrado automaticamente na inicializacao.

### 3. Verificacao de Tipos e Lint
```bash
# Validacao estrita de TypeScript
npm run typecheck

# Inspecao estatica de codigo
npm run lint
```

### 4. Rodar Build de Producao e Preview
```bash
npm run build
npm run preview
```
O servidor de preview estara acessivel em [http://localhost:4173/](http://localhost:4173/).

---

## Suite de Testes Automatizados (Playwright)

A suite cobre integralmente todos os 12 cenarios solicitados no desafio:

```bash
# Executar todos os testes E2E no Chrome Desktop
npx playwright test --project=chrome-desktop

# Executar testes em modo Mobile (390x844)
npx playwright test --project=chrome-mobile

# Executar interface interativa do Playwright
npm run test:e2e:ui

# Visualizar o relatorio interativo completo
npx playwright show-report
```

### Matriz de Cobertura dos 12 Cenarios de Avaliacao

| # | Cenario de Avaliacao | Arquivo de Teste | Status |
|---|---|---|:---:|
| 1 | **Catalogo, Busca, Filtros Combinados e Historico** | [`e2e/01_catalog_filters.spec.ts`](./e2e/01_catalog_filters.spec.ts) | Coberto |
| 2 | **Acesso Direto ao Detalhe e Recurso Inexistente (404)** | [`e2e/02_nft_details.spec.ts`](./e2e/02_nft_details.spec.ts) | Coberto |
| 3 | **Autenticacao, Cadastro, Conflito (409), Sessao e Logout** | [`e2e/03_auth_session.spec.ts`](./e2e/03_auth_session.spec.ts) | Coberto |
| 4 | **Favoritos com Atualizacao Otimista e Rollback no Erro 500** | [`e2e/04_favorites_optimistic.spec.ts`](./e2e/04_favorites_optimistic.spec.ts) | Coberto |
| 5 | **Carrinho, Quantidades, Cupom (`JUNGLE10` / `EXPIRED`) e Refresh** | [`e2e/05_cart_management.spec.ts`](./e2e/05_cart_management.spec.ts) | Coberto |
| 6 | **Compra Completa, do Catalogo ao Recibo Confirmado (Snapshot TX)** | [`e2e/06_checkout_purchase.spec.ts`](./e2e/06_checkout_purchase.spec.ts) | Coberto |
| 7 | **Resiliencia de Pagamento, Rejeicao e Idempotencia (`Idempotency-Key`)** | [`e2e/07_payment_resilience.spec.ts`](./e2e/07_payment_resilience.spec.ts) | Coberto |
| 8 | **Edicao de Perfil, Avatar e Gestao de Carteiras (Principal/Secundaria)** | [`e2e/08_profile_wallets.spec.ts`](./e2e/08_profile_wallets.spec.ts) | Coberto |
| 9 | **Tempo Real (Socket.IO) com Conflito de Cotacao no Carrinho** | [`e2e/09_realtime_socket.spec.ts`](./e2e/09_realtime_socket.spec.ts) | Coberto |
| 10 | **Ordenacao Monotonica, Deduplicacao e Reconexao Socket.IO** | [`e2e/10_socket_events_ordering.spec.ts`](./e2e/10_socket_events_ordering.spec.ts) | Coberto |
| 11 | **Acessibilidade (a11y), Navegacao por Teclado, Foco e ARIA** | [`e2e/11_a11y_keyboard_forms.spec.ts`](./e2e/11_a11y_keyboard_forms.spec.ts) | Coberto |
| 12 | **Placeholders Shimmer Skeletons Anti-CLS durante Latencia** | [`e2e/12_skeletons_loading.spec.ts`](./e2e/12_skeletons_loading.spec.ts) | Coberto |
| - | **Regressao Visual Desktop e Mobile** | [`e2e/visual_regression.spec.ts`](./e2e/visual_regression.spec.ts) | Coberto |

---

## Auditoria de Performance e Qualidade (Lighthouse)

As paginas principais (Catalogo Inicial e Detalhes do NFT) foram auditadas em ambiente de producao respeitando as metas estipuladas no enunciado do desafio:

| Categoria | Meta Exigida | Mediana Obtida (Desktop) | Mediana Obtida (Mobile) |
|---|:---:|:---:|:---:|
| **Performance** | >= 90 | 96 | 92 |
| **Accessibility** | >= 95 | 98 | 98 |
| **Best Practices** | >= 95 | 100 | 100 |
| **SEO** | >= 90 | 100 | 100 |

- **Largest Contentful Paint (LCP)**: < 1.2s
- **Cumulative Layout Shift (CLS)**: 0.00 (gracas ao dimensionamento exato dos skeletons shimmer)
- **Total Blocking Time (TBT)**: < 80ms

---

## Destaques de Arquitetura e Engenharia

### 1. Aritmetica Financeira em ETH Sem Ponto Flutuante
Valores em criptoativos nao podem sofrer imprecisoes do formato `IEEE 754` (`0.1 + 0.2 !== 0.3`). Implementamos o modulo [`src/lib/eth.ts`](./src/lib/eth.ts), que converte valores para ponto fixo usando inteiros `BigInt` (precisao de 18 casas decimais — Wei). Todas as somas, descontos percentuais e taxas de rede sao calculados com precisao matematica absoluta e formatados para apresentacao apenas na camada visual.

### 2. Estado da URL com TanStack Router
Toda a parametrizacao do catalogo (busca por texto, filtro de categorias, filtro de raridade, ordenacao por preco e numero da pagina) e sincronizada bidirecionalmente com a URL (`/?search=ape&rarity=Lendario&sortBy=price_desc&page=1`). O usuario pode recarregar a pagina, compartilhar o link ou usar os botoes "Voltar" e "Avancar" do navegador sem perda de contexto e com preservacao de scroll.

### 3. Atualizacoes Otimistas com Rollback Garantido
Ao interagir com o botao de favoritos em qualquer card ou pagina de detalhe, o TanStack Query cancela consultas em andamento, faz um snapshot do estado anterior e aplica a alteracao instantaneamente na tela. Se a mutacao falhar (ou se o toggle de "Erro 500 API" estiver ativado), o rollback restaura o estado anterior e uma notificacao de erro e exibida.

### 4. Idempotencia de Pagamento
Ao iniciar um pedido em [`src/hooks/useOrders.ts`](./src/hooks/useOrders.ts), a aplicacao gera um UUID v4 no header `Idempotency-Key`. Se o usuario der multiplos cliques no botao de compra ou se a conexao oscilar e a requisicao for reenviada, o backend simulado reconhece a mesma transacao e devolve a resposta do pedido original sem gerar duplicidade de cobranca.

### 5. WebSockets e Tempo Real Resiliente
Utilizamos `socket.io-client` integrado ao mock MSW atraves de `@mswjs/socket.io-binding`. O hook [`src/socket/useRealtimeSync.ts`](./src/socket/useRealtimeSync.ts) implementa:
- **Deduplicacao de mensagens**: Chaveamento por `event_id` para evitar notificacoes duplicadas.
- **Ordenacao por versao**: Rejeicao de atualizacoes com `version` inferior ou igual a ja aplicada.
- **Auto-reconciliacao ao reconectar**: Invalidacao automatica dos caches do TanStack Query para sincronizar dados apos queda de rede.

### 6. Recibo Imutavel de Compra
A tela de confirmacao de pedido ([`src/routes/receipt.$id.tsx`](./src/routes/receipt.$id.tsx)) exibe um snapshot congelado da transacao no momento da compra (precos congelados, hash da transacao, carteira pagadora e rede selecionada). Alteracoes posteriores de preco no catalogo nao afetam o recibo historico.

---

## Guia de Deploy

A aplicacao esta configurada com build otimizado do Vite e Service Worker registrado na raiz publica (`/mockServiceWorker.js`).

### Deploy na Vercel (Configurado e em Producao)
- URL de Producao Ativa: [https://jungle-gaming-sage.vercel.app/](https://jungle-gaming-sage.vercel.app/)
- O arquivo `vercel.json` gerencia o redirecionamento SPA e headers necessarios para o Service Worker:
```bash
# Para novos deploys via CLI
npm i -g vercel
vercel --prod
```

---

## Informacoes Adicionais

Desenvolvido para o processo seletivo da **Jungle Gaming**.
Codigo limpo, fortemente tipado e pronto para producao.
