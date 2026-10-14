import { apiClient } from './client'
import type { CartItem, CartQuote } from '../types/cart'

export const cartApi = {
  async getCart(): Promise<CartItem[]> {
    const { data } = await apiClient.get<CartItem[]>('/cart')
    return data
  },

  async addItem(nftId: string, editionId: string, quantity = 1): Promise<CartItem[]> {
    const { data } = await apiClient.post<CartItem[]>('/cart/items', {
      nftId,
      editionId,
      quantity,
    })
    return data
  },

  async updateQuantity(itemId: string, quantity: number): Promise<CartItem[]> {
    const { data } = await apiClient.put<CartItem[]>(`/cart/items/${itemId}`, { quantity })
    return data
  },

  async removeItem(itemId: string): Promise<CartItem[]> {
    const { data } = await apiClient.delete<CartItem[]>(`/cart/items/${itemId}`)
    return data
  },

  async migrateGuestCart(): Promise<CartItem[]> {
    const { data } = await apiClient.post<CartItem[]>('/cart/migrate')
    return data
  },

  async getQuote(couponCode?: string, items?: CartItem[]): Promise<CartQuote> {
    const { data } = await apiClient.post<CartQuote>('/quote', { couponCode, items })
    return data
  },

  async validateCoupon(code: string): Promise<{ code: string; discountPercentage: number; message: string }> {
    const { data } = await apiClient.post('/coupons/validate', { code })
    return data
  },
}
