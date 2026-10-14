import type { NFT, NftEdition } from './nft'

export interface CartItem {
  id: string // unique item id (nftId + '_' + editionId)
  nftId: string
  editionId: string
  nft: NFT
  edition: NftEdition
  quantity: number
  unitPriceEth: string // Decimal string, current price
  initialPriceEth: string // Price when added
}

export interface CartQuote {
  items: CartItem[]
  subtotalEth: string
  couponCode?: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  hasPriceChanges: boolean
  hasAvailabilityIssues: boolean
  quoteTimestamp: string
}

export interface Coupon {
  code: string
  discountPercentage: number
  valid: boolean
  expiresAt: string
}
