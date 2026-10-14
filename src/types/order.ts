import type { BlockchainNetwork } from './wallet'

export type OrderStatus = 'pending' | 'confirmed' | 'rejected'

export interface OrderItemSnapshot {
  nftId: string
  nftName: string
  nftImage: string
  editionId: string
  editionName: string
  quantity: number
  unitPriceEth: string
  subtotalEth: string
}

export interface Order {
  id: string
  userId: string
  idempotencyKey: string
  status: OrderStatus
  transactionHash: string
  items: OrderItemSnapshot[]
  subtotalEth: string
  couponCode?: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  walletAddress: string
  network: BlockchainNetwork
  errorMessage?: string
  createdAt: string
  confirmedAt?: string
}

export interface CreateOrderPayload {
  idempotencyKey: string
  walletId: string
  network: BlockchainNetwork
  couponCode?: string
}
