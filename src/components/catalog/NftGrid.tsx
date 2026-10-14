import React from 'react'
import { ArrowUpDown, SearchX } from 'lucide-react'
import { NftCard } from './NftCard'
import { NftCardSkeleton } from '../feedback/Skeleton'
import { Pagination } from './Pagination'
import { Button } from '../ui/button'
import type { NFT, NftFilterParams } from '../../types/nft'

interface NftGridProps {
  nfts: NFT[]
  total: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  sort: string
  onSortChange: (newSort: any) => void
  onPageChange: (newPage: number) => void
  onResetFilters: () => void
  onOpenAuth?: () => void
}

export function NftGrid({
  nfts,
  total,
  currentPage,
  totalPages,
  isLoading,
  sort,
  onSortChange,
  onPageChange,
  onResetFilters,
  onOpenAuth,
}: NftGridProps) {
  return (
    <div className="flex-1 space-y-6">
      {/* Top Header of Catalog: Total count & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-3.5 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            Catálogo de Colecionáveis
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-mono font-bold text-amber-400">
              {isLoading ? '...' : `${total} itens`}
            </span>
          </h2>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="h-4 w-4 text-stone-400 shrink-0" />
          <label htmlFor="sort-select" className="text-stone-400 shrink-0">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="recent">Mais Recentes</option>
            <option value="popular">Mais Populares</option>
            <option value="price_asc">Menor Preço (ETH)</option>
            <option value="price_desc">Maior Preço (ETH)</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <NftCardSkeleton key={idx} />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 px-4 text-center bg-surface/40">
          <div className="h-12 w-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
            <SearchX className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum NFT encontrado</h3>
          <p className="mt-1 text-xs text-stone-400 max-w-sm">
            Nenhum colecionável corresponde aos critérios selecionados. Tente ajustar os termos ou filtros de preço.
          </p>
          <Button variant="outline" size="sm" onClick={onResetFilters} className="mt-4 text-xs">
            Redefinir Filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} onOpenAuth={onOpenAuth} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  )
}
