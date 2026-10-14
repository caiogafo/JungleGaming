import { authHandlers } from './auth.handlers'
import { nftsHandlers } from './nfts.handlers'
import { favoritesHandlers } from './favorites.handlers'
import { cartHandlers } from './cart.handlers'
import { ordersHandlers } from './orders.handlers'
import { profileHandlers } from './profile.handlers'
import { walletsHandlers } from './wallets.handlers'
import { socketHandler } from '../socketMock'

export const handlers = [
  socketHandler, // MSW WebSocket connection handler for Socket.IO
  ...authHandlers,
  ...nftsHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...ordersHandlers,
  ...profileHandlers,
  ...walletsHandlers,
]
