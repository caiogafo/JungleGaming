import { apiClient } from './client'
import type { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../types/wallet'

export const walletsApi = {
  async list(): Promise<Wallet[]> {
    const { data } = await apiClient.get<Wallet[]>('/wallets')
    return data
  },

  async create(payload: CreateWalletPayload): Promise<Wallet> {
    const { data } = await apiClient.post<Wallet>('/wallets', payload)
    return data
  },

  async update(id: string, payload: UpdateWalletPayload): Promise<Wallet> {
    const { data } = await apiClient.put<Wallet>(`/wallets/${id}`, payload)
    return data
  },

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    const { data } = await apiClient.delete<{ success: boolean; id: string }>(`/wallets/${id}`)
    return data
  },
}
