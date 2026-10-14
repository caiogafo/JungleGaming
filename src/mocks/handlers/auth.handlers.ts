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

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return HttpResponse.json({ message: 'Credenciais inválidas. Usuário não encontrado.' }, { status: 401 })
    }

    const token = `jwt_token_${user.id}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    mockDb.update((d) => {
      d.sessions[token] = { token, user, expiresAt }
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

    if (!name || !username || !email) {
      return HttpResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return HttpResponse.json({ message: 'E-mail já cadastrado na plataforma' }, { status: 409 })
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      username,
      email,
      avatar: '/assets/avatars/collector_1.jpg',
      bio: 'Novo colecionador no Jungle NFT Marketplace.',
      createdAt: new Date().toISOString(),
    }

    const token = `jwt_token_${newUser.id}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    mockDb.update((d) => {
      d.users.push(newUser)
      d.sessions[token] = { token, user: newUser, expiresAt }
      d.userFavorites[newUser.id] = []
      d.userCarts[newUser.id] = []
      d.userWallets[newUser.id] = [
        {
          id: `w_${Date.now()}`,
          userId: newUser.id,
          address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          label: 'Carteira Principal',
          network: 'Ethereum',
          isPrimary: true,
          balanceEth: '2.500000',
          status: 'connected',
          createdAt: new Date().toISOString(),
        },
      ]
    })

    return HttpResponse.json({ token, user: newUser, expiresAt }, { status: 201 })
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
