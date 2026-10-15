import { createRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { rootRoute } from './__root'
import { HeroBanner } from '../components/catalog/HeroBanner'
import { FilterSidebar } from '../components/catalog/FilterSidebar'
import { NftGrid } from '../components/catalog/NftGrid'
import { PromoBanners } from '../components/catalog/PromoBanners'
import { MintingJournal } from '../components/catalog/MintingJournal'
import { useNfts } from '../hooks/useNfts'
import type { NftFilterParams } from '../types/nft'

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

  const { data, isLoading } = useNfts({
    search: searchParams.search,
    category: searchParams.category,
    rarity: searchParams.rarity,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    page: searchParams.page,
    pageSize: 9,
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
    })
  }

  const resetFilters = () => {
    navigate({
      search: {
        category: 'All',
        rarity: 'All',
        sort: 'recent',
        page: 1,
      },
    })
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-12">
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
  )
}
