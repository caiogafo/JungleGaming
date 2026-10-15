import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { nftDetailRoute } from './routes/nft.$id'
import { cartRoute } from './routes/cart'
import { checkoutRoute } from './routes/checkout'
import { receiptRoute } from './routes/receipt.$id'
import { profileRoute } from './routes/profile'
import { walletsRoute } from './routes/wallets'
import { mercadoRoute } from './routes/mercado'
import { loginRoute } from './routes/login'
import { registerRoute } from './routes/register'
import { NotFoundPage } from './routes/notFound'

const routeTree = rootRoute.addChildren([
  indexRoute,
  mercadoRoute,
  nftDetailRoute,
  cartRoute,
  checkoutRoute,
  receiptRoute,
  profileRoute,
  walletsRoute,
  loginRoute,
  registerRoute,
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
