import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const mercadoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mercado',
  beforeLoad: () => {
    const targetId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('last_selected_nft_id') || 'nft_1'
        : 'nft_1'

    throw redirect({
      to: '/nft/$id',
      params: { id: targetId },
    })
  },
})
