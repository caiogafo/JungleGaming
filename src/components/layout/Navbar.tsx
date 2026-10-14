import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingBag, Heart, User, LogOut, Wallet, Menu, X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface NavbarProps {
  onOpenAuth: () => void
  onOpenCart: () => void
}

export function Navbar({ onOpenAuth, onOpenCart }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItemsCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/assets/nfts/hero_emerald_ape.png" alt="Jungle Logo" className="h-8 w-8 object-cover rounded-lg" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-sans">
              JUNGLE <span className="text-amber-400">NFT</span>
            </span>
            <span className="text-[10px] text-stone-400 tracking-widest uppercase block -mt-1 font-mono">
              Gaming Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <Link
            to="/"
            className="hover:text-amber-400 transition-colors [&.active]:text-amber-400 [&.active]:font-semibold"
          >
            Explorar Catálogo
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className="hover:text-amber-400 transition-colors [&.active]:text-amber-400 [&.active]:font-semibold"
              >
                Meu Perfil
              </Link>
              <Link
                to="/wallets"
                className="hover:text-amber-400 transition-colors [&.active]:text-amber-400 [&.active]:font-semibold"
              >
                Carteiras Web3
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenCart}
            className="relative border-border bg-surface-elevated hover:border-amber-500/50 text-stone-200"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingBag className="h-5 w-5 text-stone-200" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center shadow-md animate-in zoom-in-50">
                {totalItemsCount}
              </span>
            )}
          </Button>

          {/* User Account / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated p-1 pr-3 hover:border-amber-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Menu do usuário"
                aria-expanded={isUserMenuOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-amber-500/30"
                />
                <span className="text-xs font-semibold text-stone-200 hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface-elevated p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-400 truncate font-mono">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-200 hover:bg-surface-hover rounded-lg transition-colors"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 text-amber-400" />
                    Dados do Colecionador
                  </Link>
                  <Link
                    to="/wallets"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-200 hover:bg-surface-hover rounded-lg transition-colors"
                    role="menuitem"
                  >
                    <Wallet className="h-4 w-4 text-amber-400" />
                    Minhas Carteiras
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Encerrar Sessão
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onOpenAuth}
              className="font-bold gap-2 text-xs shadow-amber-500/20"
            >
              <User className="h-4 w-4" />
              <span>Entrar / Cadastrar</span>
            </Button>
          )}

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-stone-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu de navegação móvel"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-200 hover:bg-surface-elevated"
          >
            Explorar Catálogo
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-stone-200 hover:bg-surface-elevated"
              >
                Meu Perfil
              </Link>
              <Link
                to="/wallets"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-stone-200 hover:bg-surface-elevated"
              >
                Carteiras Conectadas
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                Sair da Conta
              </button>
            </>
          ) : (
            <Button
              variant="default"
              className="w-full mt-2 font-bold"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onOpenAuth()
              }}
            >
              Conectar / Criar Conta
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
