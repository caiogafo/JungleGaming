import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import type { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../../types/wallet'

function getSessionUser(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  const db = mockDb.get()
  return db.sessions[token]?.user.id || null
}

export const walletsHandlers = [
  // GET /api/wallets
  http.get('/api/wallets', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const wallets = db.userWallets[userId] || []
    return HttpResponse.json(wallets)
  }),

  // POST /api/wallets
  http.post('/api/wallets', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const body = (await request.json()) as CreateWalletPayload
    const { address, label, network, isPrimary } = body

    if (!address || !label) {
      return HttpResponse.json({ message: 'Endereço e apelido da carteira são obrigatórios' }, { status: 400 })
    }

    // Basic Ethereum address validation (0x + 40 hex chars)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return HttpResponse.json({ message: 'Formato de endereço blockchain inválido (esperado 0x... 42 caracteres)' }, { status: 400 })
    }

    const newWallet: Wallet = {
      id: `w_${Date.now()}`,
      userId,
      address,
      label,
      network: network || 'Ethereum',
      isPrimary: isPrimary || false,
      balanceEth: (Math.random() * 3 + 0.5).toFixed(6),
      status: 'connected',
      createdAt: new Date().toISOString(),
    }

    mockDb.update((d) => {
      if (!d.userWallets[userId]) d.userWallets[userId] = []
      if (newWallet.isPrimary) {
        // Demote previous primary wallets
        d.userWallets[userId].forEach((w) => (w.isPrimary = false))
      }
      d.userWallets[userId].push(newWallet)
    })

    return HttpResponse.json(newWallet, { status: 201 })
  }),

  // PUT /api/wallets/:id
  http.put('/api/wallets/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const { id } = params
    const body = (await request.json()) as UpdateWalletPayload
    let updated: Wallet | null = null

    mockDb.update((d) => {
      const wallets = d.userWallets[userId] || []
      const w = wallets.find((item) => item.id === id)
      if (w) {
        if (body.label !== undefined) w.label = body.label
        if (body.network !== undefined) w.network = body.network
        if (body.isPrimary !== undefined && body.isPrimary) {
          wallets.forEach((item) => (item.isPrimary = false))
          w.isPrimary = true
        }
        updated = w
      }
    })

    if (!updated) {
      return HttpResponse.json({ message: 'Carteira não encontrada' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  // DELETE /api/wallets/:id
  http.delete('/api/wallets/:id', async ({ request, params }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const { id } = params

    mockDb.update((d) => {
      if (d.userWallets[userId]) {
        d.userWallets[userId] = d.userWallets[userId].filter((w) => w.id !== id)
      }
    })

    return HttpResponse.json({ success: true, id })
  }),
]
