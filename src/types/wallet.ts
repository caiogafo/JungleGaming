export type BlockchainNetwork = 'Ethereum' | 'Polygon' | 'Arbitrum'

export interface Wallet {
  id: string
  userId: string
  address: string
  label: string
  network: BlockchainNetwork
  isPrimary: boolean
  balanceEth: string
  status: 'connected' | 'disconnected' | 'connecting' | 'rejected'
  createdAt: string
}

export interface CreateWalletPayload {
  address: string
  label: string
  network: BlockchainNetwork
  isPrimary?: boolean
}

export interface UpdateWalletPayload {
  label?: string
  network?: BlockchainNetwork
  isPrimary?: boolean
}
