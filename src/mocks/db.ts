import type { NFT } from '../types/nft'
import type { User, AuthSession } from '../types/user'
import type { CartItem } from '../types/cart'
import type { Wallet } from '../types/wallet'
import type { Order } from '../types/order'
import type { Coupon } from '../types/cart'

const STORAGE_KEY = 'jungle_nft_mock_db_v1'

export interface MockDatabase {
  users: User[]
  sessions: Record<string, AuthSession> // token -> session
  nfts: NFT[]
  userFavorites: Record<string, string[]> // userId -> nftIds[]
  userCarts: Record<string, CartItem[]> // userId or 'guest' -> CartItem[]
  userWallets: Record<string, Wallet[]> // userId -> Wallet[]
  orders: Order[]
  coupons: Coupon[]
  scenarios: {
    latencyMs: number
    simulateOffline: boolean
    simulate500: boolean
    simulateTimeoutOnOrder: boolean
    simulateRejectOrder: boolean
  }
}

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Caio Jungle Hunter',
    username: 'caiohunter',
    email: 'alex@junglegaming.io',
    avatar: '/assets/avatars/collector_1.jpg',
    bio: 'Colecionador Web3 & early adopter de Jungle Gaming. Focado em NFTs raros e arte generativa.',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'user_2',
    name: 'Sara Cyber Walker',
    username: 'saracyber',
    email: 'sara@junglegaming.io',
    avatar: '/assets/avatars/collector_2.jpg',
    bio: 'Curadora de coleções digitais e entusiasta de Web3 gaming.',
    createdAt: '2026-03-20T14:30:00.000Z',
  },
]

export const INITIAL_NFTS: NFT[] = [
  {
    id: 'nft_1',
    name: 'Emerald Varsity Ape #042',
    collection: 'Jungle Ape Yacht Club',
    creator: {
      id: 'creator_1',
      name: 'Bored Studio',
      avatar: '/assets/nfts/hero_emerald_ape.png',
      verified: true,
    },
    description: 'Edição lendária do Emerald Ape trajando a clássica jaqueta varsity verde floresta e óculos escuros redondos vintage. Um dos NFTs mais cobiçados do metaverso Jungle.',
    image: '/assets/nfts/emerald_ape_hero.jpg',
    thumbnails: [
      '/assets/nfts/emerald_ape_hero.jpg',
      '/assets/nfts/cyber_ape_hoodie.jpg',
      '/assets/nfts/black_chimpanzee_suit.jpg',
      '/assets/nfts/golden_ape_headphones.jpg',
    ],
    rarity: 'Lendário',
    category: 'Apes',
    editions: [
      { id: 'ed_1_std', name: 'Standard Edition', maxSupply: 50, availableSupply: 8, priceEth: '0.850000' },
      { id: 'ed_1_foil', name: 'Holo Foil Variant', maxSupply: 10, availableSupply: 2, priceEth: '1.450000' },
      { id: 'ed_1_gold', name: 'Golden Master 1/1', maxSupply: 1, availableSupply: 1, priceEth: '3.200000' },
    ],
    selectedEditionId: 'ed_1_std',
    basePriceEth: '0.850000',
    contractAddress: '0x71C836466D380195A852277d337a85F756F304B1',
    tokenId: '42',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 342,
    isFeatured: true,
    createdAt: '2026-09-01T12:00:00Z',
    version: 1,
  },
  {
    id: 'nft_2',
    name: 'Phantom Sage Ape #108',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Primata sábio com chapéu bucket verde oliva e moletom roxo royal com insígnia bordada BAYC. Conecta portais dimensionais nos jogos Jungle.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: [
      '/assets/nfts/cyber_ape_hoodie.jpg',
      '/assets/nfts/emerald_ape_hero.jpg',
      '/assets/nfts/black_chimpanzee_suit.jpg',
    ],
    rarity: 'Épico',
    category: 'Cyber',
    editions: [
      { id: 'ed_2_std', name: 'Prime Edition', maxSupply: 100, availableSupply: 15, priceEth: '0.620000' },
      { id: 'ed_2_ltd', name: 'Neon Glow Edition', maxSupply: 25, availableSupply: 4, priceEth: '0.980000' },
    ],
    selectedEditionId: 'ed_2_std',
    basePriceEth: '0.620000',
    contractAddress: '0x8b31a2936a28292f76823c6f494921f005c2a118',
    tokenId: '108',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 219,
    isFeatured: true,
    createdAt: '2026-09-03T15:00:00Z',
    version: 1,
  },
  {
    id: 'nft_3',
    name: 'Black Chimpanzee Executive #007',
    collection: 'High Society Primates',
    creator: {
      id: 'creator_3',
      name: 'Monochrome Guild',
      avatar: '/assets/nfts/black_chimpanzee_suit.jpg',
      verified: true,
    },
    description: 'O epítome da sofisticação: chimpanzé negro com olhar penetrante trajando gola alta bege sob medida. Dá acesso aos lounges VIP da Jungle Gaming.',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    thumbnails: [
      '/assets/nfts/black_chimpanzee_suit.jpg',
      '/assets/nfts/emerald_ape_hero.jpg',
      '/assets/nfts/golden_ape_headphones.jpg',
    ],
    rarity: 'Raro',
    category: 'Art',
    editions: [
      { id: 'ed_3_std', name: 'Curator Cut', maxSupply: 200, availableSupply: 42, priceEth: '0.480000' },
      { id: 'ed_3_sig', name: 'Signed Edition', maxSupply: 20, availableSupply: 5, priceEth: '0.890000' },
    ],
    selectedEditionId: 'ed_3_std',
    basePriceEth: '0.480000',
    contractAddress: '0x12c4b58e9944a9e5784381200dfa48501e389b02',
    tokenId: '7',
    tokenStandard: 'ERC-721',
    blockchain: 'Polygon',
    likesCount: 184,
    isFeatured: true,
    createdAt: '2026-09-05T09:30:00Z',
    version: 1,
  },
  {
    id: 'nft_4',
    name: 'Solar DJ Golden Ape #555',
    collection: 'Audio Metaverse Vibes',
    creator: {
      id: 'creator_4',
      name: 'Soundwave Collective',
      avatar: '/assets/nfts/golden_ape_headphones.jpg',
      verified: true,
    },
    description: 'Pelagem dourada brilhante com fones de ouvido holográficos DJ e jaqueta aviador futurista. Proporciona trilhas sonoras exclusivas nos games.',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    thumbnails: [
      '/assets/nfts/golden_ape_headphones.jpg',
      '/assets/nfts/cyber_ape_hoodie.jpg',
      '/assets/nfts/emerald_ape_hero.jpg',
    ],
    rarity: 'Lendário',
    category: 'Metaverse',
    editions: [
      { id: 'ed_4_std', name: 'Festival Edition', maxSupply: 75, availableSupply: 12, priceEth: '1.150000' },
      { id: 'ed_4_vip', name: 'Backstage Pass 1/5', maxSupply: 5, availableSupply: 1, priceEth: '2.500000' },
    ],
    selectedEditionId: 'ed_4_std',
    basePriceEth: '1.150000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '555',
    tokenStandard: 'ERC-1155',
    blockchain: 'Arbitrum',
    likesCount: 489,
    isFeatured: true,
    createdAt: '2026-09-07T18:40:00Z',
    version: 1,
  },
  {
    id: 'nft_5',
    name: 'Cyberpunk Primate #2049',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Modificações cibernéticas neuronais com visor infravermelho de alta precisão.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: ['/assets/nfts/cyber_ape_hoodie.jpg'],
    rarity: 'Épico',
    category: 'Punks',
    editions: [
      { id: 'ed_5_std', name: 'Augmented Edition', maxSupply: 150, availableSupply: 25, priceEth: '0.750000' },
    ],
    selectedEditionId: 'ed_5_std',
    basePriceEth: '0.750000',
    contractAddress: '0x8b31a2936a28292f76823c6f494921f005c2a118',
    tokenId: '2049',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 156,
    createdAt: '2026-09-10T11:20:00Z',
    version: 1,
  },
  {
    id: 'nft_6',
    name: 'Emerald Cadet Ape #089',
    collection: 'Jungle Ape Yacht Club',
    creator: {
      id: 'creator_1',
      name: 'Bored Studio',
      avatar: '/assets/nfts/hero_emerald_ape.png',
      verified: true,
    },
    description: 'Recruta da frota esmeralda, equipado com jaqueta clássica e distintivo de mérito da Jungle.',
    image: '/assets/nfts/emerald_ape_hero.jpg',
    thumbnails: ['/assets/nfts/emerald_ape_hero.jpg'],
    rarity: 'Comum',
    category: 'Apes',
    editions: [
      { id: 'ed_6_std', name: 'Recruit Edition', maxSupply: 500, availableSupply: 120, priceEth: '0.350000' },
    ],
    selectedEditionId: 'ed_6_std',
    basePriceEth: '0.350000',
    contractAddress: '0x71C836466D380195A852277d337a85F756F304B1',
    tokenId: '89',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 94,
    createdAt: '2026-09-12T08:15:00Z',
    version: 1,
  },
  {
    id: 'nft_7',
    name: 'Midnight Chimp SpecOps #013',
    collection: 'High Society Primates',
    creator: {
      id: 'creator_3',
      name: 'Monochrome Guild',
      avatar: '/assets/nfts/black_chimpanzee_suit.jpg',
      verified: true,
    },
    description: 'Operador tático noturno com uniforme escuro e textura fosca anti-reflexo.',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    thumbnails: ['/assets/nfts/black_chimpanzee_suit.jpg'],
    rarity: 'Raro',
    category: 'Art',
    editions: [
      { id: 'ed_7_std', name: 'Stealth Edition', maxSupply: 120, availableSupply: 31, priceEth: '0.550000' },
    ],
    selectedEditionId: 'ed_7_std',
    basePriceEth: '0.550000',
    contractAddress: '0x12c4b58e9944a9e5784381200dfa48501e389b02',
    tokenId: '13',
    tokenStandard: 'ERC-721',
    blockchain: 'Polygon',
    likesCount: 133,
    createdAt: '2026-09-15T14:45:00Z',
    version: 1,
  },
  {
    id: 'nft_8',
    name: 'Electro Sunset Ape #777',
    collection: 'Audio Metaverse Vibes',
    creator: {
      id: 'creator_4',
      name: 'Soundwave Collective',
      avatar: '/assets/nfts/golden_ape_headphones.jpg',
      verified: true,
    },
    description: 'Vibrações solares combinadas com batidas eletrônicas imersivas.',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    thumbnails: ['/assets/nfts/golden_ape_headphones.jpg'],
    rarity: 'Épico',
    category: 'Metaverse',
    editions: [
      { id: 'ed_8_std', name: 'Sunset Pass', maxSupply: 80, availableSupply: 14, priceEth: '0.920000' },
    ],
    selectedEditionId: 'ed_8_std',
    basePriceEth: '0.920000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '777',
    tokenStandard: 'ERC-1155',
    blockchain: 'Arbitrum',
    likesCount: 278,
    createdAt: '2026-09-18T20:10:00Z',
    version: 1,
  },
  {
    id: 'nft_9',
    name: 'Cybernetic Rogue #333',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Mochileiro solitário das ruas de Neo-Jungle City.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: ['/assets/nfts/cyber_ape_hoodie.jpg'],
    rarity: 'Comum',
    category: 'Punks',
    editions: [
      { id: 'ed_9_std', name: 'Wanderer Edition', maxSupply: 300, availableSupply: 85, priceEth: '0.400000' },
    ],
    selectedEditionId: 'ed_9_std',
    basePriceEth: '0.400000',
    contractAddress: '0x8b31a2936a28292f76823c6f494921f005c2a118',
    tokenId: '333',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 88,
    createdAt: '2026-09-20T17:00:00Z',
    version: 1,
  },
]

export const INITIAL_WALLETS: Record<string, Wallet[]> = {
  user_1: [
    {
      id: 'w_1',
      userId: 'user_1',
      address: '0x71C836466D380195A852277d337a85F756F304B1',
      label: 'MetaMask Principal',
      network: 'Ethereum',
      isPrimary: true,
      balanceEth: '4.852000',
      status: 'connected',
      createdAt: '2026-01-16T11:00:00Z',
    },
    {
      id: 'w_2',
      userId: 'user_1',
      address: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
      label: 'Coinbase Wallet Secundária',
      network: 'Polygon',
      isPrimary: false,
      balanceEth: '1.240000',
      status: 'connected',
      createdAt: '2026-02-01T15:00:00Z',
    },
  ],
  user_2: [
    {
      id: 'w_3',
      userId: 'user_2',
      address: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
      label: 'Phantom Wallet',
      network: 'Ethereum',
      isPrimary: true,
      balanceEth: '8.120000',
      status: 'connected',
      createdAt: '2026-03-21T09:00:00Z',
    },
  ],
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'JUNGLE10',
    discountPercentage: 10,
    valid: true,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'VIP20',
    discountPercentage: 20,
    valid: true,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'EXPIRED',
    discountPercentage: 50,
    valid: false,
    expiresAt: '2026-01-01T00:00:00Z',
  },
]

function getInitialDb(): MockDatabase {
  const initialSession: AuthSession = {
    token: 'mock_jwt_token_user_1',
    user: INITIAL_USERS[0],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  return {
    users: [...INITIAL_USERS],
    sessions: {
      [initialSession.token]: initialSession,
    },
    nfts: JSON.parse(JSON.stringify(INITIAL_NFTS)),
    userFavorites: {
      user_1: ['nft_1', 'nft_4'],
      user_2: ['nft_2'],
    },
    userCarts: {
      user_1: [],
      guest: [],
    },
    userWallets: JSON.parse(JSON.stringify(INITIAL_WALLETS)),
    orders: [],
    coupons: [...INITIAL_COUPONS],
    scenarios: {
      latencyMs: 150,
      simulateOffline: false,
      simulate500: false,
      simulateTimeoutOnOrder: false,
      simulateRejectOrder: false,
    },
  }
}

class MockDbService {
  private db: MockDatabase

  constructor() {
    this.db = this.load()
  }

  private load(): MockDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // ignore
    }
    const fresh = getInitialDb()
    this.save(fresh)
    return fresh
  }

  private save(data: MockDatabase) {
    this.db = data
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }
  }

  public get(): MockDatabase {
    return this.db
  }

  public update(updater: (db: MockDatabase) => void) {
    updater(this.db)
    this.save(this.db)
  }

  public reset() {
    const fresh = getInitialDb()
    this.save(fresh)
    return fresh
  }
}

export const mockDb = new MockDbService()
