import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, ShoppingBag, Heart, User, LogOut, Wallet, Menu, X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { Button } from '../ui/button'

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
    <header className="sticky top-0 z-40 w-full border-b border-[#37271c] bg-[#1B1512]/95 backdrop-blur-md">
      <div className="max-w-[960px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-0">
        {/* Esquerda: Logótipo KURIO em letras maiúsculas e fonte monospace */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#D98A53] rounded-lg p-1"
        >
          <span className="font-mono text-2xl font-bold tracking-[0.2em] text-[#F3EFEA] hover:text-[#D98A53] transition-colors">
            KURIO
          </span>
        </Link>

        {/* Centro: Links de navegação em monospace: Início (laranja ativo com traço na borda inferior), Mercado, Criadores, Aprenda */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm tracking-wide text-[#9E968F] h-20">
          <Link
            to="/"
            className="text-[#D98A53] font-semibold hover:text-[#E59864] transition-colors relative flex items-center h-full"
          >
            <span>Início</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
          </Link>
          <a
            href="#catalogo"
            className="hover:text-[#D98A53] transition-colors flex items-center h-full"
          >
            Mercado
          </a>
          <a
            href="#criadores"
            className="hover:text-[#D98A53] transition-colors flex items-center h-full"
          >
            Criadores
          </a>
          <a
            href="#diario"
            className="hover:text-[#D98A53] transition-colors flex items-center h-full"
          >
            Aprenda
          </a>
        </nav>

        {/* Direita: Ícone de pesquisa, ícone de carrinho com badge, botão sólido Entrar */}
        <div className="flex items-center gap-4">
          {/* Ícone de pesquisa */}
          <button
            type="button"
            className="text-[#9E968F] hover:text-[#F3EFEA] p-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#D98A53] rounded-md"
            aria-label="Pesquisar"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Ícone de carrinho com badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D98A53] rounded-md"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#D98A53] text-[#151312] font-mono font-bold text-[10px] flex items-center justify-center">
              {totalItemsCount}
            </span>
          </button>

          {/* Botão sólido Entrar com fundo laranja e cantos levemente arredondados */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-md border border-[#282522] bg-[#1E1C1A] px-2.5 py-1.5 hover:border-[#D98A53] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D98A53]"
                aria-label="Menu do usuário"
                aria-expanded={isUserMenuOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover border border-[#D98A53]/40"
                />
                <span className="font-mono text-xs font-semibold text-[#F3EFEA] hidden sm:inline max-w-[100px] truncate">
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
            <button
              onClick={onOpenAuth}
              className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              <span>Entrar</span>
              <span className="sr-only"> / Cadastrar</span>
            </button>
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
