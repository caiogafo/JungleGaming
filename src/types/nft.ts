export type NftRarity = 'Comum' | 'Raro' | 'Épico' | 'Lendário'
export type NftCategory = 'Apes' | 'Cyber' | 'Punks' | 'Art' | 'Metaverse'

export interface NftEdition {
  id: string
  name: string
  maxSupply: number
  availableSupply: number
  priceEth: string // Decimal string, e.g. "0.8500"
}

export interface NftProperty {
  traitType: string
  value: string
  rarityPercentage: number
}

export interface NFT {
  id: string
  name: string
  collection: string
  creator: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  description: string
  image: string
  thumbnails: string[]
  rarity: NftRarity
  category: NftCategory
  editions: NftEdition[]
  selectedEditionId: string
  basePriceEth: string // Decimal string
  contractAddress: string
  tokenId: string
  tokenStandard: 'ERC-721' | 'ERC-1155'
  blockchain: 'Ethereum' | 'Polygon' | 'Arbitrum'
  likesCount: number
  isFeatured?: boolean
  originalPriceEth?: string
  createdAt: string
  version: number // for event ordering & conflict detection
}

export interface NftFilterParams {
  search?: string
  category?: NftCategory | 'All'
  rarity?: NftRarity | 'All'
  minPrice?: string
  maxPrice?: string
  sort?: 'price_asc' | 'price_desc' | 'recent' | 'popular'
  page?: number
  pageSize?: number
}

export interface NftListResponse {
  items: NFT[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
