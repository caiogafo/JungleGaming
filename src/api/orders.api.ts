import { apiClient } from './client'
import type { Order, CreateOrderPayload } from '../types/order'

export const ordersApi = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<Order>('/orders', payload, {
      headers: {
        'Idempotency-Key': payload.idempotencyKey,
      },
    })
    return data
  },

  async getById(id: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`/orders/${id}`)
    return data
  },

  async list(): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>('/orders')
    return data
  },
}
