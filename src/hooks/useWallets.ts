import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletsApi } from '../api/wallets.api'
import { useAuth } from './useAuth'
import type { CreateWalletPayload, UpdateWalletPayload } from '../types/wallet'

export function useWallets() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const walletsQuery = useQuery({
    queryKey: ['wallets'],
    queryFn: walletsApi.list,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  })

  const createWalletMutation = useMutation({
    mutationFn: (payload: CreateWalletPayload) => walletsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  const updateWalletMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWalletPayload }) =>
      walletsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  const removeWalletMutation = useMutation({
    mutationFn: (id: string) => walletsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    wallets: walletsQuery.data ?? [],
    isLoading: walletsQuery.isLoading,
    primaryWallet: walletsQuery.data?.find((w) => w.isPrimary) ?? walletsQuery.data?.[0] ?? null,
    createWallet: createWalletMutation.mutateAsync,
    isCreatingWallet: createWalletMutation.isPending,
    updateWallet: updateWalletMutation.mutateAsync,
    removeWallet: removeWalletMutation.mutateAsync,
  }
}
