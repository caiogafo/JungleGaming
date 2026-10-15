export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio?: string
  walletNickname?: string
  ensName?: string
  ensSuffix?: string
  createdAt: string
}

export interface AuthSession {
  token: string
  user: User
  expiresAt: string // ISO string
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterCredentials {
  name: string
  username: string
  email: string
  password?: string
}

export interface UpdateProfilePayload {
  name: string
  username: string
  email?: string
  bio?: string
  avatar?: string
  walletNickname?: string
  ensName?: string
  ensSuffix?: string
}

export interface ChangePasswordPayload {
  currentPassword?: string
  newPassword?: string
}
