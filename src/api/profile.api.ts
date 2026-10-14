import { apiClient } from './client'
import type { User, UpdateProfilePayload, ChangePasswordPayload } from '../types/user'

export const profileApi = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/profile')
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<User>('/profile', payload)
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.put<{ success: boolean; message: string }>('/profile/password', payload)
    return data
  },
}
