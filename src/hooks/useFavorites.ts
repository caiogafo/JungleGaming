import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesApi } from '../api/favorites.api'
import { useAuth } from './useAuth'

export function useFavorites() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.list,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })

  // Optimistic Toggle Mutation with Rollback!
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const isFav = favoritesQuery.data?.includes(nftId)
      if (isFav) {
        return favoritesApi.remove(nftId)
      } else {
        return favoritesApi.add(nftId)
      }
    },
    // When mutate is called:
    onMutate: async (nftId: string) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites'] })

      // 2. Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<string[]>(['favorites']) || []

      // 3. Optimistically update to the new value
      const isFav = previousFavorites.includes(nftId)
      const nextFavorites = isFav
        ? previousFavorites.filter((id) => id !== nftId)
        : [...previousFavorites, nftId]

      queryClient.setQueryData(['favorites'], nextFavorites)

      // 4. Return context object with snapshot value
      return { previousFavorites }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _nftId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
      }
    },
    // Always refetch after error or success to guarantee synchronization
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
  })

  const isFavorite = (nftId: string) => {
    return favoritesQuery.data?.includes(nftId) ?? false
  }

  return {
    favoriteIds: favoritesQuery.data ?? [],
    isLoading: favoritesQuery.isLoading,
    isFavorite,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    isToggling: toggleFavoriteMutation.isPending,
  }
}
