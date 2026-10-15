import type { NFT } from '../types/nft'
import type { User, AuthSession } from '../types/user'
import type { CartItem } from '../types/cart'
import type { Wallet } from '../types/wallet'
import type { Order } from '../types/order'
import type { Coupon } from '../types/cart'

const STORAGE_KEY = 'kurio_nft_mock_db_v19'

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
  {
    id: 'user_contato',
    name: 'Novo Sato',
    username: 'novosato',
    email: 'contato@email.com',
    avatar: '/assets/avatars/collector_1.jpg',
    bio: 'Colecionador Web3 & early adopter de Jungle Gaming.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export const INITIAL_NFTS: NFT[] = [
  {
    id: 'nft_1',
    name: 'Emerald Ape #042',
    collection: 'Kurio Apes',
    creator: {
      id: 'creator_1',
      name: 'Kurio Studios',
      avatar: '/assets/nfts/emerald_ape_hero.jpg',
      verified: true,
    },
    description: 'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
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
      { id: 'ed_1_1', name: '1/1', maxSupply: 1, availableSupply: 1, priceEth: '3.500000' },
      { id: 'ed_1_10', name: '1/10', maxSupply: 10, availableSupply: 2, priceEth: '2.000000' },
      { id: 'ed_1_50', name: '1/50', maxSupply: 50, availableSupply: 8, priceEth: '1.190000' },
      { id: 'ed_1_open', name: 'ABERTA', maxSupply: 999, availableSupply: 999, priceEth: '0.850000' },
    ],
    selectedEditionId: 'ed_1_50',
    basePriceEth: '1.190000',
    contractAddress: '0x7A42...19E8',
    tokenId: '0042',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 342,
    isFeatured: true,
    createdAt: '2026-09-29T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Acessório', value: 'Óculos Redondos', rarityPercentage: 8 },
      { traitType: 'Vestuário', value: 'Jaqueta Bomber Esmeralda', rarityPercentage: 12 },
      { traitType: 'Joia', value: 'Pingente de Ouro', rarityPercentage: 5 },
      { traitType: 'Raridade', value: 'Lendário', rarityPercentage: 3 },
    ],
  },
  {
    id: 'nft_2',
    name: 'Sage Nomad #009',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Primata sábio com chapéu bucket verde oliva e moletom roxo royal com insígnia bordada BAYC.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: [
      '/assets/nfts/cyber_ape_hoodie.jpg',
      '/assets/nfts/emerald_ape_hero.jpg',
      '/assets/nfts/black_chimpanzee_suit.jpg',
    ],
    rarity: 'Épico',
    category: 'Cyber',
    editions: [
      { id: 'ed_2_std', name: 'Prime Edition', maxSupply: 100, availableSupply: 15, priceEth: '1.690000' },
    ],
    selectedEditionId: 'ed_2_std',
    basePriceEth: '1.690000',
    contractAddress: '0x8b31a2936a28292f76823c6f494921f005c2a118',
    tokenId: '108',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 219,
    isFeatured: true,
    createdAt: '2026-09-28T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Chapéu', value: 'Bucket Hat Verde Oliva', rarityPercentage: 14 },
      { traitType: 'Vestuário', value: 'Moletom Roxo Royal', rarityPercentage: 18 },
      { traitType: 'Expressão', value: 'Sábio e Sereno', rarityPercentage: 22 },
      { traitType: 'Raridade', value: 'Épico', rarityPercentage: 15 },
    ],
  },
  {
    id: 'nft_3',
    name: 'Neon Vessel #552',
    collection: 'High Society Primates',
    creator: {
      id: 'creator_3',
      name: 'Monochrome Guild',
      avatar: '/assets/nfts/black_chimpanzee_suit.jpg',
      verified: true,
    },
    description: 'O epítome da sofisticação: chimpanzé em fato branco clássico e camisola verde sob medida.',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    thumbnails: [
      '/assets/nfts/black_chimpanzee_suit.jpg',
      '/assets/nfts/emerald_ape_hero.jpg',
      '/assets/nfts/golden_ape_headphones.jpg',
    ],
    rarity: 'Raro',
    category: 'Art',
    editions: [
      { id: 'ed_3_std', name: 'Curator Cut', maxSupply: 200, availableSupply: 42, priceEth: '1.990000' },
    ],
    selectedEditionId: 'ed_3_std',
    basePriceEth: '1.990000',
    originalPriceEth: '2.29 ETH',
    contractAddress: '0x12c4b58e9944a9e5784381200dfa48501e389b02',
    tokenId: '552',
    tokenStandard: 'ERC-721',
    blockchain: 'Polygon',
    likesCount: 184,
    isFeatured: true,
    createdAt: '2026-09-27T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Vestuário', value: 'Paletó Linho Branco', rarityPercentage: 10 },
      { traitType: 'Camisa', value: 'Gola Alta Verde', rarityPercentage: 16 },
      { traitType: 'Acessório', value: 'Argola Dourada', rarityPercentage: 9 },
      { traitType: 'Raridade', value: 'Raro', rarityPercentage: 20 },
    ],
  },
  {
    id: 'nft_4',
    name: 'Cosmic Bloom #118',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Viajante cósmico com casaco roxo e tecnologia de navegação estelar integrada.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: ['/assets/nfts/cyber_ape_hoodie.jpg'],
    rarity: 'Épico',
    category: 'Cyber',
    editions: [
      { id: 'ed_4_std', name: 'Cosmic Edition', maxSupply: 75, availableSupply: 12, priceEth: '1.290000' },
    ],
    selectedEditionId: 'ed_4_std',
    basePriceEth: '1.290000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '118',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 156,
    isFeatured: true,
    createdAt: '2026-09-26T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Traje', value: 'Casaco Espacial Roxo', rarityPercentage: 15 },
      { traitType: 'Tecnologia', value: 'Visor Estelar', rarityPercentage: 7 },
      { traitType: 'Raridade', value: 'Épico', rarityPercentage: 12 },
    ],
  },
  {
    id: 'nft_5',
    name: 'Violet Nomad #314',
    collection: 'Cyber Jungle Primate',
    creator: {
      id: 'creator_2',
      name: 'Cyber Labs',
      avatar: '/assets/nfts/cyber_ape_hoodie.jpg',
      verified: true,
    },
    description: 'Nômade cibernético em moletom violeta com trajes reforçados para o metaverso.',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    thumbnails: ['/assets/nfts/cyber_ape_hoodie.jpg'],
    rarity: 'Raro',
    category: 'Punks',
    editions: [
      { id: 'ed_5_std', name: '1/1', maxSupply: 150, availableSupply: 25, priceEth: '1.390000' },
    ],
    selectedEditionId: 'ed_5_std',
    basePriceEth: '1.390000',
    contractAddress: '0x8b31a2936a28292f76823c6f494921f005c2a118',
    tokenId: '314',
    tokenStandard: 'ERC-721',
    blockchain: 'Ethereum',
    likesCount: 142,
    createdAt: '2026-09-25T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Chapéu', value: 'Chapéu Safari', rarityPercentage: 18 },
      { traitType: 'Vestuário', value: 'Moletom Violeta', rarityPercentage: 20 },
      { traitType: 'Raridade', value: 'Raro', rarityPercentage: 25 },
    ],
  },
  {
    id: 'nft_6',
    name: 'Ivory Baron #088',
    collection: 'High Society Primates',
    creator: {
      id: 'creator_3',
      name: 'Monochrome Guild',
      avatar: '/assets/nfts/black_chimpanzee_suit.jpg',
      verified: true,
    },
    description: 'Barão da alta sociedade trajando linho marfim sob medida.',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    thumbnails: ['/assets/nfts/black_chimpanzee_suit.jpg'],
    rarity: 'Lendário',
    category: 'Apes',
    editions: [
      { id: 'ed_6_std', name: '1/10', maxSupply: 50, availableSupply: 5, priceEth: '1.790000' },
    ],
    selectedEditionId: 'ed_6_std',
    basePriceEth: '1.790000',
    contractAddress: '0x12c4b58e9944a9e5784381200dfa48501e389b02',
    tokenId: '088',
    tokenStandard: 'ERC-721',
    blockchain: 'Polygon',
    likesCount: 290,
    createdAt: '2026-09-24T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Vestuário', value: 'Fato Marfim Aristocrata', rarityPercentage: 6 },
      { traitType: 'Camisa', value: 'Malha Negra Sob Medida', rarityPercentage: 14 },
      { traitType: 'Raridade', value: 'Lendário', rarityPercentage: 4 },
    ],
  },
  {
    id: 'nft_7',
    name: 'Golden Beat #207',
    collection: 'Audio Metaverse Vibes',
    creator: {
      id: 'creator_4',
      name: 'Soundwave Collective',
      avatar: '/assets/nfts/golden_ape_headphones.jpg',
      verified: true,
    },
    description: 'Produtor sonoro em jaqueta amarela e headphones esmeralda master.',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    thumbnails: ['/assets/nfts/golden_ape_headphones.jpg'],
    rarity: 'Épico',
    category: 'Metaverse',
    editions: [
      { id: 'ed_7_std', name: '1/50', maxSupply: 120, availableSupply: 31, priceEth: '0.990000' },
    ],
    selectedEditionId: 'ed_7_std',
    basePriceEth: '0.990000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '207',
    tokenStandard: 'ERC-1155',
    blockchain: 'Arbitrum',
    likesCount: 204,
    createdAt: '2026-09-23T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Áudio', value: 'Headphones DJ Master', rarityPercentage: 9 },
      { traitType: 'Pelagem', value: 'Ouro Radiante', rarityPercentage: 11 },
      { traitType: 'Vestuário', value: 'Jaqueta Amarela Bomber', rarityPercentage: 15 },
      { traitType: 'Raridade', value: 'Épico', rarityPercentage: 10 },
    ],
  },
  {
    id: 'nft_8',
    name: 'Golden Echo #104',
    collection: 'Audio Metaverse Vibes',
    creator: {
      id: 'creator_4',
      name: 'Soundwave Collective',
      avatar: '/assets/nfts/golden_ape_headphones.jpg',
      verified: true,
    },
    description: 'Edição sônica mestre com jaqueta bomber marfim e fones esmeralda.',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    thumbnails: ['/assets/nfts/golden_ape_headphones.jpg'],
    rarity: 'Raro',
    category: 'Metaverse',
    editions: [
      { id: 'ed_8_std', name: 'Echo Cut', maxSupply: 100, availableSupply: 20, priceEth: '0.690000' },
    ],
    selectedEditionId: 'ed_8_std',
    basePriceEth: '0.690000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '104',
    tokenStandard: 'ERC-1155',
    blockchain: 'Arbitrum',
    likesCount: 150,
    createdAt: '2026-09-22T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Áudio', value: 'Headphones Monitor Studio', rarityPercentage: 13 },
      { traitType: 'Vestuário', value: 'Jaqueta Bomber Creme', rarityPercentage: 17 },
      { traitType: 'Raridade', value: 'Raro', rarityPercentage: 22 },
    ],
  },
  {
    id: 'nft_9',
    name: 'Golden Signal #160',
    collection: 'Audio Metaverse Vibes',
    creator: {
      id: 'creator_4',
      name: 'Soundwave Collective',
      avatar: '/assets/nfts/golden_ape_headphones.jpg',
      verified: true,
    },
    description: 'Sintonizador de frequências e transmissor de ondas sônicas no metaverso.',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    thumbnails: ['/assets/nfts/golden_ape_headphones.jpg'],
    rarity: 'Comum',
    category: 'Metaverse',
    editions: [
      { id: 'ed_9_std', name: 'Signal Pass', maxSupply: 250, availableSupply: 80, priceEth: '0.390000' },
    ],
    selectedEditionId: 'ed_9_std',
    basePriceEth: '0.390000',
    contractAddress: '0x99e8d41a7732a10129bcfe56328905b7642aa012',
    tokenId: '160',
    tokenStandard: 'ERC-1155',
    blockchain: 'Arbitrum',
    likesCount: 112,
    createdAt: '2026-09-21T12:00:00Z',
    version: 1,
    attributes: [
      { traitType: 'Áudio', value: 'Headphones Esmeralda', rarityPercentage: 25 },
      { traitType: 'Frequência', value: 'Ondas Hertzianas', rarityPercentage: 22 },
      { traitType: 'Raridade', value: 'Comum', rarityPercentage: 50 },
    ],
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
  user_contato: [
    {
      id: 'w_contato_1',
      userId: 'user_contato',
      address: '0x71C836466D380195A852277d337a85F756F304B1',
      label: 'MetaMask Principal',
      network: 'Ethereum',
      isPrimary: true,
      balanceEth: '4.852000',
      status: 'connected',
      createdAt: '2026-01-16T11:00:00Z',
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
      user_1: ['nft_4'],
      user_2: ['nft_2'],
    },
    userCarts: {
      user_1: [],
      guest: [
        {
          id: 'item_init_1',
          nftId: 'nft_1',
          editionId: 'ed_1_50',
          nft: INITIAL_NFTS[0],
          edition: INITIAL_NFTS[0].editions[2],
          quantity: 1,
          unitPriceEth: '1.190000',
          initialPriceEth: '1.190000',
        },
        {
          id: 'item_init_2',
          nftId: 'nft_5',
          editionId: 'ed_5_std',
          nft: INITIAL_NFTS[4],
          edition: INITIAL_NFTS[4].editions[0],
          quantity: 1,
          unitPriceEth: '1.390000',
          initialPriceEth: '1.390000',
        },
        {
          id: 'item_init_3',
          nftId: 'nft_6',
          editionId: 'ed_6_std',
          nft: INITIAL_NFTS[5],
          edition: INITIAL_NFTS[5].editions[0],
          quantity: 2,
          unitPriceEth: '1.790000',
          initialPriceEth: '1.790000',
        },
        {
          id: 'item_init_4',
          nftId: 'nft_7',
          editionId: 'ed_7_std',
          nft: INITIAL_NFTS[6],
          edition: INITIAL_NFTS[6].editions[0],
          quantity: 2,
          unitPriceEth: '0.990000',
          initialPriceEth: '0.990000',
        },
      ],
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
    const fresh = getInitialDb()
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...fresh,
          ...parsed,
          scenarios: {
            ...fresh.scenarios,
            latencyMs:
              typeof parsed.scenarios?.latencyMs === 'number'
                ? parsed.scenarios.latencyMs
                : fresh.scenarios.latencyMs,
            simulateOffline: false,
            simulate500: false,
            simulateTimeoutOnOrder: false,
            simulateRejectOrder: false,
          },
          orders: Array.isArray(parsed.orders) ? parsed.orders : fresh.orders,
          userCarts: parsed.userCarts || fresh.userCarts,
          userWallets: parsed.userWallets || fresh.userWallets,
          userFavorites: parsed.userFavorites || fresh.userFavorites,
          sessions: parsed.sessions || fresh.sessions,
          users: Array.isArray(parsed.users) ? parsed.users : fresh.users,
          nfts: fresh.nfts.map((freshNft) => {
            const stored = Array.isArray(parsed.nfts)
              ? parsed.nfts.find((n: any) => n.id === freshNft.id)
              : null
            return stored
              ? { ...freshNft, ...stored, attributes: freshNft.attributes }
              : freshNft
          }),
        }
      }
    } catch {
      // ignore
    }
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
