import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../api/cart.api'
import type { CartItem } from '../types/cart'

export function useCart() {
  const queryClient = useQueryClient()
  const [couponCode, setCouponCode] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('jungle_coupon') || '' : ''
  })
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null)

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 10 * 1000,
  })

  const quoteQuery = useQuery({
    queryKey: ['quote', couponCode, cartQuery.data],
    queryFn: () => cartApi.getQuote(couponCode, cartQuery.data),
    enabled: !!cartQuery.data,
    staleTime: 5 * 1000,
  })

  const addItemMutation = useMutation({
    mutationFn: ({ nftId, editionId, quantity }: { nftId: string; editionId: string; quantity: number }) =>
      cartApi.addItem(nftId, editionId, quantity),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateQuantity(itemId, quantity),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })

  const applyCoupon = async (code: string) => {
    try {
      const res = await cartApi.validateCoupon(code)
      setCouponCode(res.code)
      if (typeof window !== 'undefined') {
        localStorage.setItem('jungle_coupon', res.code)
      }
      setCouponFeedback({ message: res.message, isSuccess: true })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
      return true
    } catch (err: any) {
      setCouponFeedback({ message: err.message || 'Cupom inválido', isSuccess: false })
      return false
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jungle_coupon')
    }
    setCouponFeedback(null)
    queryClient.invalidateQueries({ queryKey: ['quote'] })
  }

  const safeItems: CartItem[] = Array.isArray(cartQuery.data) ? cartQuery.data : []
  const totalItemsCount = safeItems.reduce((acc, item) => acc + (Number(item?.quantity) || 0), 0)

  return {
    items: safeItems,
    isLoadingCart: cartQuery.isLoading,
    quote: quoteQuery.data ?? null,
    isLoadingQuote: quoteQuery.isLoading,
    couponCode,
    couponFeedback,
    totalItemsCount,
    addItem: addItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    isRemovingItem: removeItemMutation.isPending,
    applyCoupon,
    removeCoupon,
  }
}
