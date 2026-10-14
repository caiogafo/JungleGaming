import { apiClient, AUTH_TOKEN_KEY } from './client'
import type { AuthSession, LoginCredentials, RegisterCredentials, User } from '../types/user'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/login', credentials)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    return data
  },

  async register(payload: RegisterCredentials): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/register', payload)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    return data
  },

  async getSession(): Promise<AuthSession | null> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null
    try {
      const { data } = await apiClient.get<AuthSession>('/auth/session')
      return data
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      return null
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      window.dispatchEvent(new CustomEvent('jungle:logout'))
    }
  },
}
