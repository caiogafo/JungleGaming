import type { OrderStatus } from './order'

export interface NftUpdatedEvent {
  type: 'nft.updated'
  eventId: string
  nftId: string
  version: number
  timestamp: string
  changes: {
    basePriceEth?: string
    editionId?: string
    editionPriceEth?: string
    availableSupply?: number
  }
}

export interface OrderUpdatedEvent {
  type: 'order.updated'
  eventId: string
  orderId: string
  version: number
  timestamp: string
  status: OrderStatus
  transactionHash?: string
  errorMessage?: string
}

export type RealtimeEvent = NftUpdatedEvent | OrderUpdatedEvent
