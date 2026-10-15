import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import type { LoginCredentials, RegisterCredentials, User } from '../../types/user'

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    if (db.scenarios.simulate500) {
      return HttpResponse.json({ message: 'Erro interno no servidor de autenticação' }, { status: 500 })
    }

    const body = (await request.json()) as LoginCredentials
    const { email } = body

    if (!email) {
      return HttpResponse.json({ message: 'E-mail é obrigatório' }, { status: 400 })
    }

    let user = db.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        u.username.toLowerCase() === email.toLowerCase()
    )

    // Auto-create or provision user if not yet in database
    if (!user) {
      const isContato = email.toLowerCase().includes('contato')
      const usernameClean = email.includes('@') ? email.split('@')[0] : email
      user = {
        id: isContato ? 'user_contato' : `user_${Date.now()}`,
        name: isContato ? 'Novo Sato' : usernameClean,
        username: isContato ? 'novosato' : usernameClean,
        email: email.includes('@') ? email : `${email}@email.com`,
        avatar: '/assets/avatars/collector_1.jpg',
        bio: 'Colecionador Web3 & early adopter.',
        createdAt: new Date().toISOString(),
      }

      mockDb.update((d) => {
        d.users.push(user!)
        d.userFavorites[user!.id] = []
        d.userCarts[user!.id] = []
        d.userWallets[user!.id] = [
          {
            id: `w_${Date.now()}`,
            userId: user!.id,
            address: '0x71C836466D380195A852277d337a85F756F304B1',
            label: 'MetaMask',
            network: 'Ethereum',
            isPrimary: true,
            balanceEth: '4.852000',
            status: 'connected',
            createdAt: new Date().toISOString(),
          },
        ]
      })
    } else {
      // Ensure user has at least one wallet configured
      if (!db.userWallets[user.id] || db.userWallets[user.id].length === 0) {
        mockDb.update((d) => {
          d.userWallets[user!.id] = [
            {
              id: `w_${Date.now()}`,
              userId: user!.id,
              address: '0x71C836466D380195A852277d337a85F756F304B1',
              label: 'MetaMask',
              network: 'Ethereum',
              isPrimary: true,
              balanceEth: '4.852000',
              status: 'connected',
              createdAt: new Date().toISOString(),
            },
          ]
        })
      }
    }

    const token = `jwt_token_${user.id}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    mockDb.update((d) => {
      d.sessions[token] = { token, user: user!, expiresAt }
    })

    return HttpResponse.json({
      token,
      user,
      expiresAt,
    })
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    if (db.scenarios.simulate500) {
      return HttpResponse.json({ message: 'Erro interno no servidor' }, { status: 500 })
    }

    const body = (await request.json()) as RegisterCredentials
    const { name, username, email } = body

    if (!username || !email) {
      return HttpResponse.json({ message: 'Nome de usuário e e-mail são obrigatórios' }, { status: 400 })
    }

    const finalName = name || username
    const cleanUsername = username.replace(/^@/, '')

    let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      // Atualiza usuário existente e autentica
      mockDb.update((d) => {
        const u = d.users.find((x) => x.id === user!.id)
        if (u) {
          u.name = finalName
          u.username = cleanUsername
        }
      })
      user = { ...user, name: finalName, username: cleanUsername }
    } else {
      user = {
        id: `user_${Date.now()}`,
        name: finalName,
        username: cleanUsername,
        email,
        avatar: '/assets/avatars/collector_1.jpg',
        bio: 'Novo colecionador no Jungle NFT Marketplace.',
        createdAt: new Date().toISOString(),
      }

      mockDb.update((d) => {
        d.users.push(user!)
        d.userFavorites[user!.id] = []
        d.userCarts[user!.id] = []
        d.userWallets[user!.id] = [
          {
            id: `w_${Date.now()}`,
            userId: user!.id,
            address: '0x71C836466D380195A852277d337a85F756F304B1',
            label: 'MetaMask',
            network: 'Ethereum',
            isPrimary: true,
            balanceEth: '4.852000',
            status: 'connected',
            createdAt: new Date().toISOString(),
          },
        ]
      })
    }

    const token = `jwt_token_${user.id}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    mockDb.update((d) => {
      d.sessions[token] = { token, user: user!, expiresAt }
    })

    return HttpResponse.json({ token, user, expiresAt }, { status: 201 })
  }),

  // GET /api/auth/session
  http.get('/api/auth/session', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !db.sessions[token]) {
      return HttpResponse.json({ message: 'Sessão não autenticada ou expirada' }, { status: 401 })
    }

    const session = db.sessions[token]
    if (new Date(session.expiresAt) < new Date()) {
      mockDb.update((d) => {
        delete d.sessions[token]
      })
      return HttpResponse.json({ message: 'Sessão expirada' }, { status: 401 })
    }

    return HttpResponse.json(session)
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (token) {
      mockDb.update((d) => {
        delete d.sessions[token]
      })
    }
    return HttpResponse.json({ success: true })
  }),
]
