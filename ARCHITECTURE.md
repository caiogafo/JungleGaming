# Arquitetura da Solução — Jungle NFT Marketplace

Documento técnico de especificação arquitetural, contratos, políticas de estado assíncrono, sincronização em tempo real e decisões de design para o **NFT Marketplace da Jungle Gaming**.

---

## 1. Visão Geral e Princípios Arquiteturais

A aplicação foi concebida segundo os princípios de **Clean Architecture**, **Single Source of Truth** e **Resiliência de Rede**:

* **URL como Fonte da Verdade:** Todos os estados de exploração (busca, filtros de categoria e raridade, ordenação, faixa de preço e paginação) residem exclusivamente nos *search params* da URL via **TanStack Router**. Sobrevivem a recarregamentos (`F5`), compartilhamento de links e histórico do navegador (`Back/Forward`).
* **Separação Estrita de Responsabilidades:** Componentes de UI não contêm lógica de transporte ou regras de negócio. O cliente HTTP (**Axios**) e o WebSocket (**Socket.IO**) são isolados em módulos de API tipados.
* **Integridade Numérica em Criptoativos:** Todos os valores em ETH trafegam como *decimal strings* e seus cálculos matemáticos (soma, subtração, multiplicação e descontos) utilizam aritmética de ponto fixo via `BigInt` (8 casas decimais de precisão), eliminando qualquer erro de arredondamento inerente ao padrão IEEE-754.
* **Idempotência de Pedidos:** Toda criação de pedido exige e envia um cabeçalho `Idempotency-Key` (RFC-7231). Múltiplos envios (cliques repetidos ou reenvios após timeout) recuperam o mesmo pedido sem duplicidade.

---

## 2. Diagrama de Arquitetura

```mermaid
graph TD
    UI[Interface do Usuário / Componentes shadcn] --> Router[TanStack Router: Rotas & Search Params]
    UI --> State[TanStack Query: Cache Remoto & Mutações]
    State --> API[Cliente Axios / REST Contracts]
    UI --> SocketHook[useRealtimeSync Hook]
    SocketHook --> SocketClient[Socket.IO Client Service]
    
    subgraph Camada de Rede (Mocks em Dev / Preview / Testes)
        API --> MSW[Service Worker MSW]
        SocketClient --> MSW_WS[MSW WebSocket Binding]
        MSW --> DB[(Mock Reactive DB: LocalStorage)]
        MSW_WS --> DB
    end
```

---

## 3. Gerenciamento de Estado & Cache (TanStack Query)

### 3.1 Política de Cache e Retries

| Query Key | `staleTime` | `gcTime` | Comportamento |
| :--- | :---: | :---: | :--- |
| `['session']` | 5 min | 15 min | Validada no bootstrap; descarte imediato em caso de 401. |
| `['nfts', params]` | 30 seg | 5 min | Utiliza `placeholderData: keepPreviousData` para transições suaves. |
| `['nft', id]` | 60 seg | 10 min | Invalidação imediata ao receber evento `nft.updated`. |
| `['cart']` | 10 seg | 5 min | Persistido por usuário (ou `guest`) e sincronizado com o estoque do catálogo. |
| `['quote']` | 5 seg | 2 min | Revalidação contínua de preços, taxas e cupons. |
| `['favorites']` | 60 seg | 10 min | Atualização otimista com rollback em caso de falha. |
| `['wallets']` | 30 seg | 5 min | Limpo imediatamente no logout do usuário. |

### 3.2 Atualização Otimista com Rollback (Item Obrigatório)

A mutação de favoritar/desfavoritar (`useFavorites`) implementa o ciclo completo de otimismo com rollback:
1. `onMutate`: Cancela queries em trânsito de `['favorites']`, captura o snapshot do cache anterior (`previousFavorites`) e injeta imediatamente o novo array de IDs na UI.
2. `onError`: Em caso de erro 4xx/5xx ou falha de conexão, restaura o snapshot `previousFavorites` no cache do TanStack Query.
3. `onSettled`: Invalida `['favorites']` e `['nfts']` para assegurar reconciliação final com o servidor.

---

## 4. Tempo Real com Socket.IO

### 4.1 Contratos de Eventos

#### `nft.updated`
Emitido sempre que o preço base, preço de edição ou estoque disponível de um NFT sofre alteração:
```typescript
interface NftUpdatedEvent {
  type: 'nft.updated'
  eventId: string      // UUID estável para deduplicação
  nftId: string        // Identificador do NFT afetado
  version: number      // Versão estritamente monotônica
  timestamp: string    // ISO Date
  changes: {
    basePriceEth?: string
    editionId?: string
    editionPriceEth?: string
    availableSupply?: number
  }
}
```

#### `order.updated`
Emitido na transição de estado de pedidos:
```typescript
interface OrderUpdatedEvent {
  type: 'order.updated'
  eventId: string
  orderId: string
  version: number
  timestamp: string
  status: 'pending' | 'confirmed' | 'rejected'
  transactionHash?: string
  errorMessage?: string
}
```

### 4.2 Resiliência, Deduplicação e Ordenação
1. **Deduplicação de Eventos:** O serviço `realtimeSocket` mantém um `Set<string>` com os `eventId`s processados. Cópias duplicadas são descartadas imediatamente.
2. **Prevenção de Regressão de Versão:** Um mapa em memória armazena a versão atual de cada recurso. Eventos com versão $\le$ versão atual são sumariamente ignorados, protegendo a interface contra respostas fora de ordem (*out-of-order*).
3. **Reconciliação pós-reconexão:** Ao restabelecer a conexão WebSocket (`connect`), são disparados callbacks que invalidam automaticamente as queries ativas do TanStack Query (`nfts`, `cart`, `orders`).
4. **Proteção de Checkout em Preço Desatualizado:** Quando um NFT no carrinho tem seu preço alterado via socket, a cotação sinaliza `hasPriceChanges: true`, gerando um aviso visual na interface e exigindo revalidação do usuário antes de finalizar o pedido.

---

## 5. Mocking e Camada de Rede (MSW)

* **Transporte HTTP:** Interceptação direta na camada de Service Worker do navegador (`/mockServiceWorker.js`), garantindo que chamadas `fetch` e `axios` operem com URLs normais (`/api/*`).
* **Transporte Socket.IO:** Utiliza `@mswjs/socket.io-binding` sobre `ws.link`, interceptando o handshake e os pacotes WebSocket do `socket.io-client`.
* **Persistência e Reset:** Os dados do mock são preservados no `localStorage` sob a chave `jungle_nft_mock_db_v1`. O botão **Resetar Mocks** restaura integralmente as fixtures de fábrica.
* **Barra de Controle de Cenários:** O componente `ScenarioControlBar` permite alternar:
  * Latência de rede (0ms, 150ms, 1200ms, 2500ms);
  * Simulação de erro HTTP 500 no backend;
  * Simulação de Timeout de criação de pedido;
  * Simulação de Pagamento Recusado (erro 402);
  * Disparo manual de evento Socket.IO em tempo real.

---

## 6. Sessão, Conta e Migração de Carrinho

* **Estado de Visitante vs. Autenticado:** Visitantes podem explorar o catálogo, favoritar localmente e montar o carrinho normalmente.
* **Migração de Carrinho:** Ao efetuar Login ou Cadastro, o endpoint `POST /api/cart/migrate` migra automaticamente todos os itens do carrinho de visitante para a conta do usuário logado, somando quantidades para itens repetidos.
* **Expiração de Sessão:** O interceptor Axios detecta respostas `401 Unauthorized`, remove o token e dispara o evento `jungle:auth-expired`, redirecionando fluxos protegidos.
* **Isolamento de Dados:** Ao realizar Logout, o cache do TanStack Query referente a dados privados (`favorites`, `wallets`, `orders`, `profile`) é limpo com `removeQueries()`.

---

## 7. Acessibilidade (a11y) e Performance (Lighthouse)

* **Navegação por Teclado:** Todos os botões, links, filtros e campos possuem indicador de foco visível (`focus-visible:ring-2 ring-amber-500`).
* **Controle de Foco:** Modais e drawers utilizam primitivas `@radix-ui/react-dialog` com *focus trap* e fechamento via tecla `Escape`.
* **Skeletons Shimmer Anti-CLS:** Componentes esqueleto (`NftCardSkeleton`, `NftDetailSkeleton`) replicam fielmente as dimensões e proporções dos elementos reais, prevenindo Cumulative Layout Shift. Respeitam `@media (prefers-reduced-motion: reduce)`.
* **Semântica HTML:** Estrutura com tags semânticas `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<footer>`, além de atributos ARIA (`aria-label`, `aria-live`, `aria-invalid`).
