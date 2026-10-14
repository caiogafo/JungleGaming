import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api/orders.api'
import type { CreateOrderPayload } from '../types/order'

export function useOrders() {
  const queryClient = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
    staleTime: 30 * 1000,
  })

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.createOrder(payload),
    onSuccess: (newOrder) => {
      queryClient.setQueryData(['order', newOrder.id], newOrder)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
  })

  return {
    orders: ordersQuery.data ?? [],
    isLoadingOrders: ordersQuery.isLoading,
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    createOrderError: createOrderMutation.error,
  }
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
    staleTime: 60 * 1000,
    retry: 1,
  })
}
