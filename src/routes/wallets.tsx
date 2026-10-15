import { useEffect } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: WalletsPage,
})

function WalletsPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({
      to: '/profile',
      search: { tab: 'wallets' } as any,
      replace: true,
    })
  }, [navigate])

  return null
}

