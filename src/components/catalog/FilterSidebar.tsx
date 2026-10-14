import React from 'react'
import { Search, RotateCcw, Filter } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import type { NftCategory, NftRarity, NftFilterParams } from '../../types/nft'

interface FilterSidebarProps {
  filters: NftFilterParams
  onFilterChange: (newFilters: Partial<NftFilterParams>) => void
  onReset: () => void
}

const CATEGORIES: { label: string; value: NftCategory | 'All' }[] = [
  { label: 'Todas as Categorias', value: 'All' },
  { label: 'Jungle Apes', value: 'Apes' },
  { label: 'Cyber Primates', value: 'Cyber' },
  { label: 'Punks & Rogues', value: 'Punks' },
  { label: 'Fine Art & Society', value: 'Art' },
  { label: 'Metaverse Audio', value: 'Metaverse' },
]

const RARITIES: { label: string; value: NftRarity | 'All' }[] = [
  { label: 'Todas as Raridades', value: 'All' },
  { label: 'Comum', value: 'Comum' },
  { label: 'Raro', value: 'Raro' },
  { label: 'Épico', value: 'Épico' },
  { label: 'Lendário', value: 'Lendário' },
]

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value, page: 1 })
  }

  const handleCategorySelect = (category: NftCategory | 'All') => {
    onFilterChange({ category, page: 1 })
  }

  const handleRaritySelect = (rarity: NftRarity | 'All') => {
    onFilterChange({ rarity, page: 1 })
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ minPrice: e.target.value, page: 1 })
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ maxPrice: e.target.value, page: 1 })
  }

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.category && filters.category !== 'All') ||
    (filters.rarity && filters.rarity !== 'All') ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice)

  return (
    <aside className="w-full lg:w-72 space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-400" />
          Filtros de Busca
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs text-stone-400 hover:text-amber-400 p-1 gap-1"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <label htmlFor="search-input" className="text-xs font-semibold text-stone-300">
          Pesquisar NFT
        </label>
        <Input
          id="search-input"
          placeholder="Ex: Emerald Ape, Cyber..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9 text-xs"
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300 block">Categoria</label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-stone-300 hover:bg-surface-elevated hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300 block">Raridade</label>
        <div className="grid grid-cols-2 gap-1.5">
          {RARITIES.map((r) => {
            const isSelected = (filters.rarity || 'All') === r.value
            return (
              <button
                key={r.value}
                onClick={() => handleRaritySelect(r.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-center truncate ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-surface-elevated text-stone-300 hover:bg-surface-hover border border-border/60'
                }`}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter (ETH) */}
      <div className="space-y-2 pt-2 border-t border-border/80">
        <label className="text-xs font-semibold text-stone-300 block">
          Faixa de Preço (ETH)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price-input" className="sr-only">Preço Mínimo ETH</label>
            <Input
              id="min-price-input"
              type="number"
              step="0.05"
              min="0"
              placeholder="Mín. (ETH)"
              value={filters.minPrice || ''}
              onChange={handleMinPriceChange}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div>
            <label htmlFor="max-price-input" className="sr-only">Preço Máximo ETH</label>
            <Input
              id="max-price-input"
              type="number"
              step="0.05"
              min="0"
              placeholder="Máx. (ETH)"
              value={filters.maxPrice || ''}
              onChange={handleMaxPriceChange}
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
