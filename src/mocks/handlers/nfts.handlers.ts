import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import { compareEth } from '../../lib/eth'
import { serverSocketEmitter } from '../socketMock'
import type { NFT } from '../../types/nft'

export const nftsHandlers = [
  // GET /api/nfts
  http.get('/api/nfts', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    if (db.scenarios.simulate500) {
      return HttpResponse.json({ message: 'Erro interno ao consultar catálogo' }, { status: 500 })
    }

    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase().trim() || ''
    const category = url.searchParams.get('category') || 'All'
    const rarity = url.searchParams.get('rarity') || 'All'
    const minPrice = url.searchParams.get('minPrice') || ''
    const maxPrice = url.searchParams.get('maxPrice') || ''
    const sort = url.searchParams.get('sort') || 'recent'
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const pageSize = Math.max(1, parseInt(url.searchParams.get('pageSize') || '6', 10))

    let filtered = [...db.nfts]

    // Search query
    if (search) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(search) ||
          nft.collection.toLowerCase().includes(search) ||
          nft.description.toLowerCase().includes(search)
      )
    }

    // Category filter
    if (category && category !== 'All') {
      filtered = filtered.filter((nft) => nft.category === category)
    }

    // Rarity filter
    if (rarity && rarity !== 'All') {
      filtered = filtered.filter((nft) => nft.rarity === rarity)
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter((nft) => compareEth(nft.basePriceEth, minPrice) >= 0)
    }
    if (maxPrice) {
      filtered = filtered.filter((nft) => compareEth(nft.basePriceEth, maxPrice) <= 0)
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'price_asc') return compareEth(a.basePriceEth, b.basePriceEth)
      if (sort === 'price_desc') return compareEth(b.basePriceEth, a.basePriceEth)
      if (sort === 'popular') return b.likesCount - a.likesCount
      // Default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const startIndex = (page - 1) * pageSize
    const items = filtered.slice(startIndex, startIndex + pageSize)

    return HttpResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages,
    })
  }),

  // GET /api/nfts/:id
  http.get('/api/nfts/:id', async ({ params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const { id } = params
    const nft = db.nfts.find((item) => item.id === id)

    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado no catálogo' }, { status: 404 })
    }

    return HttpResponse.json(nft)
  }),

  // GET /api/nfts/:id/similar
  http.get('/api/nfts/:id/similar', async ({ params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const { id } = params
    const target = db.nfts.find((item) => item.id === id)

    const similar = db.nfts
      .filter((item) => item.id !== id && (item.category === target?.category || item.collection === target?.collection))
      .slice(0, 4)

    return HttpResponse.json(similar)
  }),

  // POST /api/mock/simulate-nft-update (Testing / trigger helper to fire real-time socket events)
  http.post('/api/mock/simulate-nft-update', async ({ request }) => {
    const body = (await request.json()) as { nftId: string; newPriceEth?: string; availableSupply?: number }
    const { nftId, newPriceEth, availableSupply } = body

    let updatedNft: NFT | undefined

    mockDb.update((d) => {
      const idx = d.nfts.findIndex((n) => n.id === nftId)
      if (idx !== -1) {
        const item = d.nfts[idx]
        item.version += 1
        if (newPriceEth) {
          item.basePriceEth = newPriceEth
          if (item.editions[0]) {
            item.editions[0].priceEth = newPriceEth
          }
        }
        if (availableSupply !== undefined && item.editions[0]) {
          item.editions[0].availableSupply = availableSupply
        }
        updatedNft = item
      }
    })

    if (updatedNft) {
      // Broadcast over the Socket.IO mock network
      serverSocketEmitter.broadcastNftUpdated({
        type: 'nft.updated',
        eventId: `ev_${Date.now()}`,
        nftId: updatedNft.id,
        version: updatedNft.version,
        timestamp: new Date().toISOString(),
        changes: {
          basePriceEth: updatedNft.basePriceEth,
          editionId: updatedNft.editions[0]?.id,
          editionPriceEth: updatedNft.editions[0]?.priceEth,
          availableSupply: updatedNft.editions[0]?.availableSupply,
        },
      })
      return HttpResponse.json({ success: true, nft: updatedNft })
    }

    return HttpResponse.json({ message: 'NFT não encontrado' }, { status: 404 })
  }),
]
