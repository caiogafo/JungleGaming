import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { nftsApi } from '../api/nfts.api'
import type { NftFilterParams } from '../types/nft'

export function useNfts(params: NftFilterParams = {}) {
  return useQuery({
    queryKey: ['nfts', params],
    queryFn: () => nftsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useNftDetail(id: string) {
  return useQuery({
    queryKey: ['nft', id],
    queryFn: () => nftsApi.getById(id),
    staleTime: 60 * 1000,
    retry: 1,
  })
}

export function useSimilarNfts(id: string) {
  return useQuery({
    queryKey: ['nfts', 'similar', id],
    queryFn: () => nftsApi.getSimilar(id),
    staleTime: 60 * 1000,
  })
}
