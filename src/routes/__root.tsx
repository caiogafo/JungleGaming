import { useState, useEffect } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ScenarioControlBar } from '../components/layout/ScenarioControlBar'
import { RealtimeAlert } from '../components/feedback/RealtimeAlert'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CartDrawer } from '../components/cart/CartDrawer'
import { AuthModal } from '../components/auth/AuthModal'
import { useRealtimeSync } from '../socket/useRealtimeSync'

export const rootRoute = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { latestNotice, clearNotice } = useRealtimeSync()

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true)
    window.addEventListener('jungle:open-auth', handleOpenAuth)
    return () => window.removeEventListener('jungle:open-auth', handleOpenAuth)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-amber-500/20 selection:text-amber-400">
      {/* Top Testing & Evaluation Toolbar */}
      <ScenarioControlBar />

      {/* Socket.IO Real-time Notifications */}
      <RealtimeAlert notice={latestNotice} onDismiss={clearNotice} />

      {/* Application Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Global Drawers / Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false)
          setIsAuthOpen(true)
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  )
}
