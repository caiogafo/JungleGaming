import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '../api/profile.api'
import { useAuth } from './useAuth'
import type { UpdateProfilePayload, ChangePasswordPayload } from '../types/user'

export function useProfile() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
  })

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  }
}
