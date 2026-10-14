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
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação obrigatória para finalizar compra' }, { status: 401 })
    }

    if (db.scenarios.simulateOffline) {
      return HttpResponse.error()
    }

    if (db.scenarios.simulateTimeoutOnOrder) {
      // Simulate slow response that triggers client timeout, but order gets saved
      await delay(6000)
    }

    const idempotencyKey =
      request.headers.get('Idempotency-Key') || ((await request.clone().json()) as any)?.idempotencyKey

    if (!idempotencyKey) {
      return HttpResponse.json({ message: 'Chave de idempotência ausente' }, { status: 400 })
    }

    // Check if an order with this idempotencyKey already exists
    const existingOrder = db.orders.find((o) => o.idempotencyKey === idempotencyKey)
    if (existingOrder) {
      // If same key, return the existing order safely (idempotent replay)
      return HttpResponse.json(existingOrder, { status: 200 })
    }

    const body = (await request.json()) as CreateOrderPayload
    const { walletId, network, couponCode } = body

    const userCart = db.userCarts[userId] || []
    if (userCart.length === 0) {
      return HttpResponse.json({ message: 'Carrinho vazio. Adicione itens antes de finalizar.' }, { status: 400 })
    }

    // Validate stock and build immutable snapshots
    const itemsSnapshot: OrderItemSnapshot[] = []
    let subtotalEth = '0.000000'

    for (const item of userCart) {
      const nft = db.nfts.find((n) => n.id === item.nftId)
      const edition = nft?.editions.find((e) => e.id === item.editionId)

      if (!nft || !edition) {
        return HttpResponse.json({ message: `NFT ou edição não disponível: ${item.nft.name}` }, { status: 400 })
      }

      if (edition.availableSupply < item.quantity) {
        return HttpResponse.json(
          { message: `Estoque insuficiente para ${nft.name} (${edition.name}). Disponível: ${edition.availableSupply}` },
          { status: 409 }
        )
      }

      const itemTotal = mulEth(edition.priceEth, item.quantity)
      subtotalEth = addEth(subtotalEth, itemTotal)

      itemsSnapshot.push({
        nftId: nft.id,
        nftName: nft.name,
        nftImage: nft.image,
        editionId: edition.id,
        editionName: edition.name,
        quantity: item.quantity,
        unitPriceEth: edition.priceEth,
        subtotalEth: itemTotal,
      })
    }

    // Coupon calculation
    let discountEth = '0.000000'
    if (couponCode) {
      const coupon = db.coupons.find((c) => c.code === couponCode.toUpperCase())
      if (coupon && coupon.valid && new Date(coupon.expiresAt) > new Date()) {
        discountEth = applyDiscountEth(subtotalEth, coupon.discountPercentage)
      }
    }

    const networkFeeEth = '0.004200'
    const totalAfterDiscount = subEth(subtotalEth, discountEth)
    const totalEth = addEth(totalAfterDiscount, networkFeeEth)

    const wallet = db.userWallets[userId]?.find((w) => w.id === walletId)
    const walletAddress = wallet?.address || '0x71C836466D380195A852277d337a85F756F304B1'

    // Determine status (check scenario for simulated rejection)
    const isRejected = db.scenarios.simulateRejectOrder
    const orderStatus = isRejected ? 'rejected' : 'confirmed'
    const transactionHash = isRejected
      ? ''
      : '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId,
      idempotencyKey,
      status: orderStatus,
      transactionHash,
      items: itemsSnapshot,
      subtotalEth,
      couponCode,
      discountEth,
      networkFeeEth,
      totalEth,
      walletAddress,
      network: network || 'Ethereum',
      errorMessage: isRejected ? 'Transação recusada pela rede blockchain ou saldo insuficiente.' : undefined,
      createdAt: new Date().toISOString(),
      confirmedAt: isRejected ? undefined : new Date().toISOString(),
    }

    mockDb.update((d) => {
      d.orders.push(newOrder)

      if (!isRejected) {
        // Deduct edition stock
        for (const bought of itemsSnapshot) {
          const nft = d.nfts.find((n) => n.id === bought.nftId)
          const edition = nft?.editions.find((e) => e.id === bought.editionId)
          if (edition) {
            edition.availableSupply = Math.max(0, edition.availableSupply - bought.quantity)
          }
        }
        // Remove only purchased items from user's cart
        d.userCarts[userId] = []
      }
    })

    // Emit real-time socket event for order update
    setTimeout(() => {
      serverSocketEmitter.broadcastOrderUpdated({
        type: 'order.updated',
        eventId: `ev_ord_${Date.now()}`,
        orderId: newOrder.id,
        version: 1,
        timestamp: new Date().toISOString(),
        status: newOrder.status,
        transactionHash: newOrder.transactionHash,
        errorMessage: newOrder.errorMessage,
      })
    }, 100)

    if (isRejected) {
      return HttpResponse.json(
        { message: newOrder.errorMessage, order: newOrder },
        { status: 402 } // Payment Required / Rejected
      )
    }

    return HttpResponse.json(newOrder, { status: 201 })
  }),

  // GET /api/orders/:id
  http.get('/api/orders/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const { id } = params
    const order = db.orders.find((o) => o.id === id && o.userId === userId)

    if (!order) {
      return HttpResponse.json({ message: 'Pedido não encontrado' }, { status: 404 })
    }

    return HttpResponse.json(order)
  }),

  // GET /api/orders
  http.get('/api/orders', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const userOrders = db.orders.filter((o) => o.userId === userId)
    return HttpResponse.json(userOrders)
  }),
]
