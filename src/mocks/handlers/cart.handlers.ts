import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import { addEth, mulEth, applyDiscountEth, subEth } from '../../lib/eth'
import type { CartItem, CartQuote } from '../../types/cart'

function getSessionUser(request: Request): string {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return 'guest'
  const db = mockDb.get()
  return db.sessions[token]?.user.id || 'guest'
}

export const cartHandlers = [
  // GET /api/cart
  http.get('/api/cart', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userKey = getSessionUser(request)
    const items = db.userCarts[userKey] || []

    // Synchronize latest NFT price and availability from catalog into cart items
    const syncedItems: CartItem[] = items.map((item) => {
      const currentNft = db.nfts.find((n) => n.id === item.nftId)
      const currentEdition = currentNft?.editions.find((e) => e.id === item.editionId)
      return {
        ...item,
        nft: currentNft || item.nft,
        edition: currentEdition || item.edition,
        unitPriceEth: currentEdition?.priceEth || item.unitPriceEth,
      }
    })

    return HttpResponse.json(syncedItems)
  }),

  // POST /api/cart/items
  http.post('/api/cart/items', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userKey = getSessionUser(request)
    const body = (await request.json()) as { nftId: string; editionId: string; quantity: number }
    const { nftId, editionId, quantity } = body

    const nft = db.nfts.find((n) => n.id === nftId)
    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado' }, { status: 404 })
    }

    const edition = nft.editions.find((e) => e.id === editionId)
    if (!edition) {
      return HttpResponse.json({ message: 'Edição não encontrada' }, { status: 404 })
    }

    if (edition.availableSupply < quantity) {
      return HttpResponse.json(
        { message: `Quantidade solicitada (${quantity}) excede o estoque disponível (${edition.availableSupply})` },
        { status: 400 }
      )
    }

    const itemId = `${nftId}_${editionId}`
    let updatedCart: CartItem[] = []

    mockDb.update((d) => {
      if (!d.userCarts[userKey]) d.userCarts[userKey] = []
      const existingIdx = d.userCarts[userKey].findIndex((i) => i.id === itemId)

      if (existingIdx !== -1) {
        const newQty = d.userCarts[userKey][existingIdx].quantity + quantity
        if (newQty > edition.availableSupply) {
          throw new Error(`Limite de edições excedido. Estoque máximo: ${edition.availableSupply}`)
        }
        d.userCarts[userKey][existingIdx].quantity = newQty
      } else {
        d.userCarts[userKey].push({
          id: itemId,
          nftId,
          editionId,
          nft,
          edition,
          quantity,
          unitPriceEth: edition.priceEth,
          initialPriceEth: edition.priceEth,
        })
      }
      updatedCart = d.userCarts[userKey]
    })

    return HttpResponse.json(updatedCart)
  }),

  // PUT /api/cart/items/:id
  http.put('/api/cart/items/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userKey = getSessionUser(request)
    const itemId = String(params.id)
    const body = (await request.json()) as { quantity: number }
    const { quantity } = body

    if (quantity <= 0) {
      // Remove if <= 0
      mockDb.update((d) => {
        if (d.userCarts[userKey]) {
          d.userCarts[userKey] = d.userCarts[userKey].filter((i) => i.id !== itemId)
        }
      })
      return HttpResponse.json(mockDb.get().userCarts[userKey] || [])
    }

    let updatedCart: CartItem[] = []
    let errorMessage: string | null = null

    mockDb.update((d) => {
      const cart = d.userCarts[userKey] || []
      const item = cart.find((i) => i.id === itemId)
      if (!item) {
        errorMessage = 'Item não encontrado no carrinho'
        return
      }

      const currentNft = d.nfts.find((n) => n.id === item.nftId)
      const currentEdition = currentNft?.editions.find((e) => e.id === item.editionId)

      if (currentEdition && quantity > currentEdition.availableSupply) {
        errorMessage = `Quantidade solicitada (${quantity}) excede o limite disponível (${currentEdition.availableSupply})`
        return
      }

      item.quantity = quantity
      updatedCart = cart
    })

    if (errorMessage) {
      return HttpResponse.json({ message: errorMessage }, { status: 400 })
    }

    return HttpResponse.json(updatedCart)
  }),

  // DELETE /api/cart/items/:id
  http.delete('/api/cart/items/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userKey = getSessionUser(request)
    const itemId = String(params.id)

    mockDb.update((d) => {
      if (d.userCarts[userKey]) {
        d.userCarts[userKey] = d.userCarts[userKey].filter((i) => i.id !== itemId)
      }
    })

    return HttpResponse.json(mockDb.get().userCarts[userKey] || [])
  }),

  // POST /api/cart/migrate (Preserves guest cart when logging in)
  http.post('/api/cart/migrate', async ({ request }) => {
    const userKey = getSessionUser(request)
    if (userKey === 'guest') {
      return HttpResponse.json({ message: 'Usuário não autenticado' }, { status: 401 })
    }

    mockDb.update((d) => {
      const guestItems = d.userCarts['guest'] || []
      if (guestItems.length > 0) {
        if (!d.userCarts[userKey]) d.userCarts[userKey] = []
        for (const guestItem of guestItems) {
          const existing = d.userCarts[userKey].find((i) => i.id === guestItem.id)
          if (existing) {
            existing.quantity += guestItem.quantity
          } else {
            d.userCarts[userKey].push(guestItem)
          }
        }
        d.userCarts['guest'] = []
      }
    })

    return HttpResponse.json(mockDb.get().userCarts[userKey] || [])
  }),

  // POST /api/quote
  http.post('/api/quote', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const body = (await request.json()) as { items?: CartItem[]; couponCode?: string }
    const userKey = getSessionUser(request)
    const cartItems = body.items || db.userCarts[userKey] || []

    let subtotalEth = '0.000000'
    let hasPriceChanges = false
    let hasAvailabilityIssues = false

    const refreshedItems: CartItem[] = cartItems.map((item) => {
      const currentNft = db.nfts.find((n) => n.id === item.nftId)
      const currentEdition = currentNft?.editions.find((e) => e.id === item.editionId)

      const livePrice = currentEdition?.priceEth || item.unitPriceEth
      if (livePrice !== item.unitPriceEth || livePrice !== item.initialPriceEth) {
        hasPriceChanges = true
      }

      if (currentEdition && item.quantity > currentEdition.availableSupply) {
        hasAvailabilityIssues = true
      }

      const itemTotal = mulEth(livePrice, item.quantity)
      subtotalEth = addEth(subtotalEth, itemTotal)

      return {
        ...item,
        unitPriceEth: livePrice,
      }
    })

    // Coupon calculation
    let discountEth = '0.000000'
    const couponCode = body.couponCode?.trim().toUpperCase()

    if (couponCode) {
      const coupon = db.coupons.find((c) => c.code === couponCode)
      if (coupon && coupon.valid && new Date(coupon.expiresAt) > new Date()) {
        discountEth = applyDiscountEth(subtotalEth, coupon.discountPercentage)
      }
    }

    // Network Gas Fee: 0.016 ETH flat simulation (matching Figma exact quote)
    const networkFeeEth = cartItems.length > 0 ? '0.016000' : '0.000000'
    const totalAfterDiscount = subEth(subtotalEth, discountEth)
    const totalEth = addEth(totalAfterDiscount, networkFeeEth)

    const quote: CartQuote = {
      items: refreshedItems,
      subtotalEth,
      couponCode,
      discountEth,
      networkFeeEth,
      totalEth,
      hasPriceChanges,
      hasAvailabilityIssues,
      quoteTimestamp: new Date().toISOString(),
    }

    return HttpResponse.json(quote)
  }),

  // POST /api/coupons/validate
  http.post('/api/coupons/validate', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const body = (await request.json()) as { code: string }
    const code = body.code?.trim().toUpperCase()

    const coupon = db.coupons.find((c) => c.code === code)
    if (!coupon) {
      return HttpResponse.json({ message: 'Cupom de desconto inválido' }, { status: 404 })
    }

    if (!coupon.valid || new Date(coupon.expiresAt) <= new Date()) {
      return HttpResponse.json({ message: 'Este cupom de desconto expirou' }, { status: 400 })
    }

    return HttpResponse.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      message: `Cupom ${coupon.code} aplicado com sucesso! (${coupon.discountPercentage}% OFF)`,
    })
  }),
]
