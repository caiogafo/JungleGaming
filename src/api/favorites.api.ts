import { apiClient } from './client'

export const favoritesApi = {
  async list(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>('/favorites')
    return data
  },

  async add(nftId: string): Promise<{ success: boolean; nftId: string }> {
    const { data } = await apiClient.post<{ success: boolean; nftId: string }>(`/favorites/${nftId}`)
    return data
  },

  async remove(nftId: string): Promise<{ success: boolean; nftId: string }> {
    const { data } = await apiClient.delete<{ success: boolean; nftId: string }>(`/favorites/${nftId}`)
    return data
  },
}
