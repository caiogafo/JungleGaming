import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import { addEth, mulEth, applyDiscountEth, subEth } from '../../lib/eth'
import { serverSocketEmitter } from '../socketMock'
import type { Order, OrderItemSnapshot, CreateOrderPayload } from '../../types/order'

function getSessionUser(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  const db = mockDb.get()
  return db.sessions[token]?.user.id || null
}

export const ordersHandlers = [
  // POST /api/orders (Idempotent order creation)
  http.post('/api/orders', async ({ request }) => {
    try {
      const db = mockDb.get()
      await delay(db.scenarios?.latencyMs ?? 150)

      const userId = getSessionUser(request) || 'guest'

      if (db.scenarios?.simulateOffline) {
        return HttpResponse.error()
      }

      if (db.scenarios?.simulateTimeoutOnOrder) {
        // Simulate slow response that triggers client timeout, but order gets saved
        await delay(6000)
      }

      let idempotencyKey = request.headers.get('Idempotency-Key')
      let body: CreateOrderPayload | null = null

      try {
        body = (await request.json()) as CreateOrderPayload
        if (!idempotencyKey && body?.idempotencyKey) {
          idempotencyKey = body.idempotencyKey
        }
      } catch {
        // body could not be parsed
      }

      if (!idempotencyKey) {
        return HttpResponse.json({ message: 'Chave de idempotência ausente' }, { status: 400 })
      }

      if (!body) {
        return HttpResponse.json({ message: 'Corpo da requisição inválido' }, { status: 400 })
      }

      // Check if an order with this idempotencyKey already exists
      const existingOrder = (db.orders || []).find((o) => o.idempotencyKey === idempotencyKey)
      if (existingOrder) {
        // If same key, return the existing order safely (idempotent replay)
        return HttpResponse.json(existingOrder, { status: 200 })
      }

      const {
        walletId,
        network,
        couponCode,
        walletName,
        walletAddress,
        customerName,
        customerEmail,
        username,
        notes,
      } = body

      // Buscar carrinho: se o carrinho do usuário estiver vazio, faz fallback para o de convidado
      let userCart = db.userCarts?.[userId] || []
      if (userCart.length === 0 && db.userCarts?.['guest']?.length) {
        userCart = db.userCarts['guest']
      }

      if (!userCart || userCart.length === 0) {
        return HttpResponse.json({ message: 'Carrinho vazio. Adicione itens antes de finalizar.' }, { status: 400 })
      }

      // Validate stock and build immutable snapshots
      const itemsSnapshot: OrderItemSnapshot[] = []
      let subtotalEth = '0.000000'

      for (const item of userCart) {
        const nft = (db.nfts || []).find((n) => n.id === item.nftId) || item.nft
        const edition = nft?.editions?.find((e) => e.id === item.editionId) || item.edition

        const itemNftName = nft?.name || item.nft?.name || item.nftId || 'NFT'
        const itemEditionName = edition?.name || item.edition?.name || 'Edição'
        const itemPrice = edition?.priceEth || item.unitPriceEth || '0.000000'

        if (!nft || !edition) {
          return HttpResponse.json({ message: `NFT ou edição não disponível: ${itemNftName}` }, { status: 400 })
        }

        if (edition.availableSupply !== undefined && edition.availableSupply < item.quantity) {
          return HttpResponse.json(
            { message: `Estoque insuficiente para ${itemNftName} (${itemEditionName}). Disponível: ${edition.availableSupply}` },
            { status: 409 }
          )
        }

        const itemTotal = mulEth(itemPrice, item.quantity)
        subtotalEth = addEth(subtotalEth, itemTotal)

        itemsSnapshot.push({
          nftId: nft.id,
          nftName: itemNftName,
          nftImage: nft.image || item.nft?.image || '/assets/nfts/emerald_ape_hero.jpg',
          editionId: edition.id,
          editionName: itemEditionName,
          quantity: item.quantity,
          unitPriceEth: itemPrice,
          subtotalEth: itemTotal,
          tokenId: nft.tokenId || item.nft?.tokenId || '0042',
        })
      }

      // Coupon calculation
      let discountEth = '0.000000'
      if (couponCode) {
        const coupon = (db.coupons || []).find((c) => c.code === couponCode.toUpperCase())
        if (coupon && coupon.valid && new Date(coupon.expiresAt) > new Date()) {
          discountEth = applyDiscountEth(subtotalEth, coupon.discountPercentage)
        }
      }

      const networkFeeEth = '0.004200'
      const totalAfterDiscount = subEth(subtotalEth, discountEth)
      const totalEth = addEth(totalAfterDiscount, networkFeeEth)

      const defaultWallet = db.userWallets?.[userId]?.find((w) => w.id === walletId)
      const resolvedWalletAddress =
        walletAddress || defaultWallet?.address || '0x71C836466D380195A852277d337a85F756F304B1'
      const resolvedWalletName = walletName || 'MetaMask'

      // Create initially as PENDING (ele vai ficar cerca de 2/3 segundos como pendente)
      const initialTxHash =
        '0x' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' +
        Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        userId,
        idempotencyKey,
        status: 'pending',
        transactionHash: initialTxHash,
        items: itemsSnapshot,
        subtotalEth,
        couponCode,
        discountEth,
        networkFeeEth,
        totalEth,
        walletAddress: resolvedWalletAddress,
        walletName: resolvedWalletName,
        network: network || 'Ethereum',
        customerName,
        customerEmail,
        username,
        notes,
        errorMessage: undefined,
        createdAt: new Date().toISOString(),
        confirmedAt: undefined,
      }

      mockDb.update((d) => {
        if (!Array.isArray(d.orders)) d.orders = []
        d.orders.push(newOrder)
        // Se usuário autenticado, sincroniza nome e username se fornecidos
        if (userId && userId !== 'guest' && Array.isArray(d.users)) {
          const u = d.users.find((user) => user.id === userId)
          if (u) {
            if (customerName) u.name = customerName
            if (username) u.username = username.replace(/^@/, '')
          }
        }
      })

      // Background transition after 2.5s (2 a 3 segundos)
      setTimeout(() => {
        try {
          const currentDb = mockDb.get()
          const isRejected = currentDb.scenarios?.simulateRejectOrder
          const finalStatus = isRejected ? 'rejected' : 'confirmed'
          const finalTxHash = isRejected
            ? ''
            : '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

          mockDb.update((d) => {
            if (!Array.isArray(d.orders)) return
            const ord = d.orders.find((o) => o.id === newOrder.id)
            if (ord && ord.status === 'pending') {
              ord.status = finalStatus
              ord.transactionHash = finalTxHash
              ord.confirmedAt = isRejected ? undefined : new Date().toISOString()
              ord.errorMessage = isRejected
                ? 'Transação recusada pela rede blockchain ou saldo insuficiente.'
                : undefined

              if (!isRejected) {
                // Deduct stock
                for (const bought of ord.items) {
                  const nft = (d.nfts || []).find((n) => n.id === bought.nftId)
                  const edition = nft?.editions?.find((e) => e.id === bought.editionId)
                  if (edition && edition.availableSupply !== undefined) {
                    edition.availableSupply = Math.max(0, edition.availableSupply - bought.quantity)
                  }
                }
                // Clear cart upon confirmed purchase
                if (d.userCarts) {
                  d.userCarts[userId] = []
                  if (d.userCarts['guest']) d.userCarts['guest'] = []
                }
              }
            }
          })

          // Broadcast Socket.IO event to all active clients
          serverSocketEmitter.broadcastOrderUpdated({
            type: 'order.updated',
            eventId: `ev_ord_${Date.now()}`,
            orderId: newOrder.id,
            version: 2,
            timestamp: new Date().toISOString(),
            status: finalStatus,
            transactionHash: finalTxHash,
            errorMessage: isRejected ? 'Transação recusada pela rede blockchain ou saldo insuficiente.' : undefined,
          })
        } catch (err) {
          console.warn('Erro ao atualizar status do pedido em segundo plano:', err)
        }
      }, 2500)

      return HttpResponse.json(newOrder, { status: 201 })
    } catch (err: any) {
      console.error('[MSW /api/orders error]:', err)
      return HttpResponse.json({ message: err?.message || 'Falha ao processar pedido' }, { status: 500 })
    }
  }),

  // GET /api/orders/:id
  http.get('/api/orders/:id', async ({ request, params }) => {
    try {
      const db = mockDb.get()
      await delay(db.scenarios?.latencyMs ?? 150)

      const userId = getSessionUser(request)
      const { id } = params
      const order = (db.orders || []).find(
        (o) => o.id === id && (!userId || o.userId === userId || o.userId === 'guest')
      )

      if (!order) {
        return HttpResponse.json({ message: 'Pedido não encontrado' }, { status: 404 })
      }

      return HttpResponse.json(order)
    } catch (err: any) {
      return HttpResponse.json({ message: err?.message || 'Erro ao carregar pedido' }, { status: 500 })
    }
  }),

  // GET /api/orders
  http.get('/api/orders', async ({ request }) => {
    try {
      const db = mockDb.get()
      await delay(db.scenarios?.latencyMs ?? 150)

      const userId = getSessionUser(request)
      if (!userId) {
        return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
      }

      const userOrders = (db.orders || []).filter((o) => o.userId === userId)
      return HttpResponse.json(userOrders)
    } catch (err: any) {
      return HttpResponse.json({ message: err?.message || 'Erro ao listar pedidos' }, { status: 500 })
    }
  }),
]
