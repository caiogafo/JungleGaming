import { useState } from 'react'
import { createRoute, useNavigate, Link } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { HeroBanner } from '../components/catalog/HeroBanner'
import { FilterSidebar } from '../components/catalog/FilterSidebar'
import { NftGrid } from '../components/catalog/NftGrid'
import { PromoBanners } from '../components/catalog/PromoBanners'
import { MintingJournal } from '../components/catalog/MintingJournal'
import { useNfts } from '../hooks/useNfts'
import { useFavorites } from '../hooks/useFavorites'
import { useCart } from '../hooks/useCart'
import { formatEth } from '../lib/eth'
import type { NftFilterParams } from '../types/nft'
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Home,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'

export interface CatalogSearchParams {
  search?: string
  category?: 'All' | 'Apes' | 'Cyber' | 'Punks' | 'Art' | 'Metaverse'
  rarity?: 'All' | 'Comum' | 'Raro' | 'Épico' | 'Lendário'
  minPrice?: string
  maxPrice?: string
  sort?: 'recent' | 'popular' | 'price_asc' | 'price_desc'
  page?: number
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    return {
      search: typeof search.search === 'string' ? search.search : undefined,
      category: typeof search.category === 'string' ? (search.category as any) : undefined,
      rarity: typeof search.rarity === 'string' ? (search.rarity as any) : undefined,
      minPrice:
        search.minPrice !== undefined && search.minPrice !== null && search.minPrice !== ''
          ? String(search.minPrice)
          : undefined,
      maxPrice:
        search.maxPrice !== undefined && search.maxPrice !== null && search.maxPrice !== ''
          ? String(search.maxPrice)
          : undefined,
      sort: typeof search.sort === 'string' ? (search.sort as any) : undefined,
      page: typeof search.page === 'number' ? search.page : Number(search.page) || undefined,
    }
  },
  component: CatalogPage,
})

function CatalogPage() {
  const searchParams = indexRoute.useSearch()
  const navigate = useNavigate({ from: indexRoute.fullPath })
  const { isFavorite, toggleFavorite } = useFavorites()
  const { totalItemsCount } = useCart()

  const [mobileTab, setMobileTab] = useState<'all' | 'new' | 'trending'>('all')
  const [mobileSearch, setMobileSearch] = useState(searchParams.search || '')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const activeSort =
    mobileTab === 'trending'
      ? 'popular'
      : searchParams.sort || 'recent'

  const { data, isLoading } = useNfts({
    search: searchParams.search,
    category: searchParams.category,
    rarity: searchParams.rarity,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: activeSort,
    page: searchParams.page,
    pageSize: 12,
  })

  const updateFilters = (newFilters: Partial<NftFilterParams>) => {
    navigate({
      search: (prev) => {
        const next = {
          ...prev,
          ...newFilters,
        }
        if (newFilters.minPrice === undefined && 'minPrice' in newFilters) {
          delete (next as any).minPrice
        }
        if (newFilters.maxPrice === undefined && 'maxPrice' in newFilters) {
          delete (next as any).maxPrice
        }
        return next
      },
      replace: true,
      resetScroll: false,
    })
  }

  const resetFilters = () => {
    setMobileSearch('')
    navigate({
      search: {
        category: 'All',
        rarity: 'All',
        sort: 'recent',
        page: 1,
      },
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. VISUALIZAÇÃO MOBILE (Telas < 768px - idêntica ao Figma) */}
      {/* ========================================================= */}
      <div className="block md:hidden min-h-screen px-4 pt-3 pb-6 font-mono text-xs text-[#9E968F] bg-[#140E0C] space-y-5">
        {/* Barra de Busca e Botão de Filtro */}
        <div className="flex items-center gap-3">
          {/* Input de Busca */}
          <div className="flex-1 relative">
            <Search className="h-4 w-4 text-[#9E968F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => {
                setMobileSearch(e.target.value)
                updateFilters({ search: e.target.value || undefined, page: 1 })
              }}
              placeholder="Explorar coleções"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#37271c] bg-[#1E1714] text-xs font-mono text-[#F3EFEA] placeholder-[#9E968F] focus:border-[#D98A53] focus:outline-none transition-colors"
            />
          </div>

          {/* Botão de Filtro (Laranja com ícone SlidersHorizontal) */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="h-11 w-11 rounded-xl bg-[#C48247] hover:bg-[#D98A53] text-[#151312] flex items-center justify-center shrink-0 shadow-md transition-colors active:scale-95"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="h-5 w-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Card Hero Banner com Gradiente e Colagem */}
        <div className="relative rounded-3xl p-5 overflow-hidden border border-[#4D3325]/50 bg-gradient-to-br from-[#3D281D] via-[#241712] to-[#160E0B] shadow-xl">
          {/* Efeitos de luz no fundo */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D98A53]/10 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4D3325]/30 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Texto à esquerda */}
            <div className="flex-1 space-y-1.5">
              <span className="text-[11px] font-mono text-[#BFAFA6] block">
                Bem-vindo à Kurio
              </span>
              <h2 className="font-mono font-bold text-base text-[#F3EFEA] leading-tight uppercase tracking-tight">
                SEJA DONO DA CULTURA DIGITAL
              </h2>
              <p className="text-xs font-mono text-[#9E968F] leading-snug max-w-[190px]">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <div className="pt-1.5">
                <a
                  href="#colecoes-mobile"
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-xs text-[#D98A53] hover:underline uppercase"
                >
                  <span>EXPLORAR</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Colagem de NFTs à direita */}
            <div className="relative w-28 h-32 shrink-0">
              {/* Imagem maior de trás (Emerald Ape) */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-2xl overflow-hidden border border-[#37271c] shadow-lg bg-[#241F1B]">
                <img
                  src="/assets/nfts/emerald_ape_hero.jpg"
                  alt="Emerald Ape"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Imagem menor sobreposta na frente (Sage Nomad) */}
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-[#160E0B] shadow-2xl bg-[#241F1B]">
                <img
                  src="/assets/nfts/cyber_ape_hoodie.jpg"
                  alt="Sage Nomad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Indicadores de Carrossel (3 pontinhos) */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D98A53]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D98A53]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D98A53]/40" />
          </div>
        </div>

        {/* Abas de Categorias */}
        <div id="colecoes-mobile" className="flex items-center gap-5 font-mono text-xs overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => {
              setMobileTab('all')
              updateFilters({ sort: 'recent', category: 'All', page: 1 })
            }}
            className={`pb-1 transition-colors whitespace-nowrap ${
              mobileTab === 'all'
                ? 'border-b-2 border-[#D98A53] text-[#F3EFEA] font-bold'
                : 'border-b-2 border-transparent text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Todos os NFTs
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileTab('new')
              updateFilters({ sort: 'recent', page: 1 })
            }}
            className={`pb-1 transition-colors whitespace-nowrap ${
              mobileTab === 'new'
                ? 'border-b-2 border-[#D98A53] text-[#F3EFEA] font-bold'
                : 'border-b-2 border-transparent text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Novos lançamentos
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileTab('trending')
              updateFilters({ sort: 'popular', page: 1 })
            }}
            className={`pb-1 transition-colors whitespace-nowrap ${
              mobileTab === 'trending'
                ? 'border-b-2 border-[#D98A53] text-[#F3EFEA] font-bold'
                : 'border-b-2 border-transparent text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Em alta
          </button>
        </div>

        {/* Grid 2 Colunas de NFTs */}
        <div className="grid grid-cols-2 gap-3.5">
          {data?.items && data.items.length > 0 ? (
            data.items.map((nft) => {
              const isFav = isFavorite(nft.id)
              return (
                <Link
                  key={nft.id}
                  to="/nft/$id"
                  params={{ id: nft.id }}
                  className="group block space-y-2 focus:outline-none"
                >
                  {/* Imagem do NFT com cantos arredondados */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#241F1B] border border-[#37271c]/40 shadow-md">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge RARO se aplicável */}
                    {nft.rarity === 'Raro' && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#C48247] text-[#151312] font-mono font-bold text-[10px] uppercase shadow">
                        RARO
                      </span>
                    )}

                    {/* Botão de Favoritar no topo direito */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(nft.id)
                      }}
                      className={`absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors ${
                        isFav ? 'text-red-500' : 'text-[#9E968F] hover:text-[#F3EFEA]'
                      }`}
                      aria-label="Favoritar"
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Informações: Nome e Preço */}
                  <div className="font-mono space-y-0.5">
                    <h3 className="text-xs font-medium text-[#F3EFEA] truncate">
                      {nft.name}
                    </h3>
                    <p className="text-xs font-bold text-[#D98A53]">
                      {formatEth(nft.basePriceEth)}
                    </p>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-2 py-12 text-center text-xs text-[#9E968F]">
              Nenhum NFT encontrado com os filtros atuais.
            </div>
          )}
        </div>

        {/* Modal / Gaveta de Filtro no Mobile */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end animate-in fade-in">
            <div className="w-full bg-[#1E1714] border-t border-[#37271c] rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#37271c] pb-3">
                <h3 className="text-sm font-bold text-[#F3EFEA]">Filtrar Coleção</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-[#9E968F] hover:text-[#F3EFEA]"
                  aria-label="Fechar filtros"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categorias */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F3EFEA] block">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Apes', 'Cyber', 'Punks', 'Art'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateFilters({ category: cat as any, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                        (searchParams.category || 'All') === cat
                          ? 'border-[#D98A53] text-[#D98A53] bg-[#D98A53]/15 font-bold'
                          : 'border-[#37271c] text-[#9E968F] bg-[#291C19]'
                      }`}
                    >
                      {cat === 'All' ? 'Todas' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Raridade */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F3EFEA] block">Raridade</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Comum', 'Raro', 'Épico', 'Lendário'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateFilters({ rarity: r as any, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                        (searchParams.rarity || 'All') === r
                          ? 'border-[#D98A53] text-[#D98A53] bg-[#D98A53]/15 font-bold'
                          : 'border-[#37271c] text-[#9E968F] bg-[#291C19]'
                      }`}
                    >
                      {r === 'All' ? 'Todas' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters()
                    setIsMobileFilterOpen(false)
                  }}
                  className="flex-1 h-10 border border-[#37271c] text-[#9E968F] hover:text-[#F3EFEA] rounded-xl text-xs font-mono"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 h-10 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold rounded-xl text-xs uppercase"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra de Navegação Inferior (Dock Mobile) */}
        <nav
          aria-label="Navegação mobile"
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#19120F]/95 backdrop-blur-md border-t border-[#37271c] px-6 py-2 shadow-2xl"
        >
          <div className="max-w-md mx-auto flex items-center justify-between relative">
            {/* 1. Home (Ativo) */}
            <Link
              to="/"
              className="p-2 text-[#D98A53] hover:text-[#E59864] transition-colors flex flex-col items-center"
              aria-label="Início"
            >
              <Home className="h-5 w-5" />
            </Link>

            {/* 2. Favoritos */}
            <Link
              to="/profile"
              search={{ tab: 'wishlist' }}
              className="p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors flex flex-col items-center"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* 3. Botão Central Flutuante com Ícone Scan */}
            <div className="relative -top-5 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('colecoes-mobile')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-13 h-13 w-12 h-12 rounded-full bg-gradient-to-tr from-[#B87038] via-[#D98A53] to-[#E59864] text-[#151312] shadow-xl shadow-[#D98A53]/30 flex items-center justify-center border-4 border-[#16110E] active:scale-95 transition-transform"
                aria-label="Explorar Coleções"
              >
                <svg
                  className="h-6 w-6 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 3H5a2 2 0 0 0-2 2v2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M3 17v2a2 2 0 0 0 2 2h2" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                </svg>
              </button>
            </div>

            {/* 4. Carrinho */}
            <button
              type="button"
              onClick={() => navigate({ to: '/cart' })}
              className="p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors flex flex-col items-center relative"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#D98A53] text-[#151312] text-[9px] font-mono font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* 5. Perfil */}
            <Link
              to="/profile"
              className="p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors flex flex-col items-center"
              aria-label="Meu Perfil"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* 2. VISUALIZAÇÃO DESKTOP (Telas >= 768px)                   */}
      {/* ========================================================= */}
      <div className="hidden md:block max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-12">
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* Main Catalog with Responsive Sidebar */}
        <div id="catalogo" className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-start pt-2">
          <div className="w-full lg:w-[220px] shrink-0">
            <FilterSidebar
              filters={searchParams}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </div>

          <div className="flex-1 w-full min-w-0">
            <NftGrid
              nfts={data?.items || []}
              total={data?.total || 0}
              currentPage={searchParams.page || 1}
              totalPages={data?.totalPages || 1}
              isLoading={isLoading}
              sort={searchParams.sort || 'recent'}
              onSortChange={(sort) => updateFilters({ sort: sort as any, page: 1 })}
              onPageChange={(page) => updateFilters({ page })}
              onResetFilters={resetFilters}
            />
          </div>
        </div>

        {/* 2.4 Banners Promocionais (2 Colunas) */}
        <div className="w-full">
          <PromoBanners />
        </div>

        {/* 2.5 Diário da Cunhagem (Blog com 4 Colunas) */}
        <div className="w-full">
          <MintingJournal />
        </div>
      </div>
    </>
  )
}

