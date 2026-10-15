import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { cartApi } from '../api/cart.api'
import type { LoginCredentials, RegisterCredentials } from '../types/user'

export function useAuth() {
  const queryClient = useQueryClient()

  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: authApi.getSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      // Set session data immediately for instantaneous UI update
      queryClient.setQueryData(['session'], data)
      // Re-fetch session
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      // Migrate guest cart items to the authenticated user cart
      await cartApi.migrateGuestCart().catch(() => {})
      // Invalidate relevant user caches
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterCredentials) => authApi.register(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(['session'], data)
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      await cartApi.migrateGuestCart().catch(() => {})
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear sensitive cache data
      queryClient.removeQueries({ queryKey: ['favorites'] })
      queryClient.removeQueries({ queryKey: ['wallets'] })
      queryClient.removeQueries({ queryKey: ['orders'] })
      queryClient.removeQueries({ queryKey: ['profile'] })
      queryClient.setQueryData(['session'], null)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  return {
    user: sessionQuery.data?.user ?? null,
    session: sessionQuery.data ?? null,
    isAuthenticated: !!sessionQuery.data?.user,
    isLoadingSession: sessionQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
