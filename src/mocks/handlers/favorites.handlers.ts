import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'

function getUserIdFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  const db = mockDb.get()
  return db.sessions[token]?.user.id || null
}

export const favoritesHandlers = [
  // GET /api/favorites
  http.get('/api/favorites', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const favs = db.userFavorites[userId] || []
    return HttpResponse.json(favs)
  }),

  // POST /api/favorites/:id
  http.post('/api/favorites/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    if (db.scenarios.simulate500) {
      return HttpResponse.json({ message: 'Erro ao favoritar NFT' }, { status: 500 })
    }

    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const nftId = String(params.id)

    mockDb.update((d) => {
      if (!d.userFavorites[userId]) d.userFavorites[userId] = []
      if (!d.userFavorites[userId].includes(nftId)) {
        d.userFavorites[userId].push(nftId)
        const nft = d.nfts.find((n) => n.id === nftId)
        if (nft) nft.likesCount += 1
      }
    })

    return HttpResponse.json({ success: true, nftId })
  }),

  // DELETE /api/favorites/:id
  http.delete('/api/favorites/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    if (db.scenarios.simulate500) {
      return HttpResponse.json({ message: 'Erro ao remover favorito' }, { status: 500 })
    }

    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const nftId = String(params.id)

    mockDb.update((d) => {
      if (d.userFavorites[userId]) {
        d.userFavorites[userId] = d.userFavorites[userId].filter((id) => id !== nftId)
        const nft = d.nfts.find((n) => n.id === nftId)
        if (nft && nft.likesCount > 0) nft.likesCount -= 1
      }
    })

    return HttpResponse.json({ success: true, nftId })
  }),
]
