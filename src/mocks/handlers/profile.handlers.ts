import { http, HttpResponse, delay } from 'msw'
import { mockDb } from '../db'
import type { UpdateProfilePayload, ChangePasswordPayload } from '../../types/user'

function getSessionUser(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  const db = mockDb.get()
  return db.sessions[token]?.user.id || null
}

export const profileHandlers = [
  // GET /api/profile
  http.get('/api/profile', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const user = db.users.find((u) => u.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  // PUT /api/profile
  http.put('/api/profile', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const body = (await request.json()) as UpdateProfilePayload
    const { name, username, bio, avatar, email, walletNickname, ensName, ensSuffix } = body

    if (!name || !username) {
      return HttpResponse.json({ message: 'Nome e nome de usuário são obrigatórios' }, { status: 400 })
    }

    let updatedUser: any = null

    mockDb.update((d) => {
      const user = d.users.find((u) => u.id === userId)
      if (user) {
        user.name = name
        user.username = username.replace(/^@/, '')
        if (email !== undefined) user.email = email
        if (bio !== undefined) user.bio = bio
        if (avatar !== undefined) user.avatar = avatar
        if (walletNickname !== undefined) user.walletNickname = walletNickname
        if (ensName !== undefined) user.ensName = ensName
        if (ensSuffix !== undefined) user.ensSuffix = ensSuffix
        updatedUser = user

        // Update active session user as well
        for (const token in d.sessions) {
          if (d.sessions[token].user.id === userId) {
            d.sessions[token].user = user
          }
        }
      }
    })

    return HttpResponse.json(updatedUser)
  }),

  // PUT /api/profile/password
  http.put('/api/profile/password', async ({ request }) => {
    const db = mockDb.get()
    await delay(db.scenarios.latencyMs)

    const userId = getSessionUser(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária' }, { status: 401 })
    }

    const body = (await request.json()) as ChangePasswordPayload
    if (!body.newPassword || body.newPassword.length < 6) {
      return HttpResponse.json({ message: 'A nova senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    return HttpResponse.json({ success: true, message: 'Senha atualizada com sucesso' })
  }),
]
