import { apiClient } from './client'
import type { NFT, NftFilterParams, NftListResponse } from '../types/nft'

export const nftsApi = {
  async list(params: NftFilterParams = {}): Promise<NftListResponse> {
    const { data } = await apiClient.get<NftListResponse>('/nfts', { params })
    return data
  },

  async getById(id: string): Promise<NFT> {
    const { data } = await apiClient.get<NFT>(`/nfts/${id}`)
    return data
  },

  async getSimilar(id: string): Promise<NFT[]> {
    const { data } = await apiClient.get<NFT[]>(`/nfts/${id}/similar`)
    return data
  },

  async simulatePriceUpdate(nftId: string, newPriceEth: string): Promise<{ success: boolean; nft: NFT }> {
    const { data } = await apiClient.post('/mock/simulate-nft-update', { nftId, newPriceEth })
    return data
  },
}
