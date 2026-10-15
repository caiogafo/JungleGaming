import React, { useState } from 'react'
import { ChevronDown, SearchX } from 'lucide-react'
import { NftCard } from './NftCard'
import { NftCardSkeleton } from '../feedback/Skeleton'
import { Pagination } from './Pagination'
import { Button } from '../ui/button'
import type { NFT } from '../../types/nft'

interface NftGridProps {
  nfts: NFT[]
  total: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  sort: string
  onSortChange: (newSort: string) => void
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
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'trending'>('all')

  const handleTabClick = (tab: 'all' | 'recent' | 'trending') => {
    setActiveTab(tab)
    if (tab === 'recent') {
      onSortChange('recent')
    } else if (tab === 'trending') {
      onSortChange('popular')
    } else {
      onSortChange('recent')
    }
  }

  return (
    <div className="flex-1 w-full space-y-6">
      {/* Barra Superior: Abas e Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        {/* Abas de navegação */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleTabClick('all')}
            className={`pb-1.5 font-semibold transition-colors relative ${
              activeTab === 'all'
                ? 'text-[#F3EFEA]'
                : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Todos os NFTs
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('recent')}
            className={`pb-1.5 font-semibold transition-colors relative ${
              activeTab === 'recent'
                ? 'text-[#F3EFEA]'
                : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Novos lançamentos
            {activeTab === 'recent' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('trending')}
            className={`pb-1.5 font-semibold transition-colors relative ${
              activeTab === 'trending'
                ? 'text-[#F3EFEA]'
                : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            Em alta
            {activeTab === 'trending' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
            )}
          </button>
        </div>

        {/* Ordenar por */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#9E968F]">
          <label htmlFor="sort-select" className="shrink-0 cursor-pointer">
            Ordenar por:
          </label>
          <div className="relative inline-flex items-center">
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-transparent pr-6 text-xs font-mono font-medium text-[#F3EFEA] focus:outline-none cursor-pointer"
            >
              <option value="recent" className="bg-[#1C1A18] text-[#F3EFEA]">
                Listados recentemente
              </option>
              <option value="popular" className="bg-[#1C1A18] text-[#F3EFEA]">
                Em alta
              </option>
              <option value="price_asc" className="bg-[#1C1A18] text-[#F3EFEA]">
                Menor Preço
              </option>
              <option value="price_desc" className="bg-[#1C1A18] text-[#F3EFEA]">
                Maior Preço
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-[#9E968F]" />
          </div>
        </div>
      </div>

      {/* Grid de Cards de NFTs (3 Colunas fixas conforme Figma) */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 9 }).map((_, idx) => (
            <NftCardSkeleton key={idx} />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 px-4 text-center bg-[#181614]/50">
          <div className="h-12 w-12 rounded-full bg-[#201D1A] flex items-center justify-center text-[#9E968F] mb-3">
            <SearchX className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#F3EFEA]">Nenhum NFT encontrado</h3>
          <p className="mt-1 text-xs font-mono text-[#9E968F] max-w-sm">
            Nenhum colecionável corresponde aos critérios selecionados. Tente ajustar os termos ou filtros de preço.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-4 text-xs font-mono border-[#D98A53] text-[#D98A53] hover:bg-[#D98A53] hover:text-black"
          >
            Redefinir Filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {nfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} onOpenAuth={onOpenAuth} />
            ))}
          </div>

          {/* Paginação no canto inferior direito */}
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
