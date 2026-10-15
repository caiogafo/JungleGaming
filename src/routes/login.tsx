import { useEffect } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { AuthForm } from '../components/auth/AuthForm'
import { useAuth } from '../hooks/useAuth'

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/profile' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-[#140E0C] text-[#F3EFEA] font-mono px-4 py-8 sm:py-16 flex flex-col items-center justify-center">
      <AuthForm
        initialMode="login"
        onSuccess={() => navigate({ to: '/profile' })}
        className="bg-[#140E0C]"
      />
    </div>
  )
}
