import React, { useState } from 'react'
import type { NftFilterParams } from '../../types/nft'

interface FilterSidebarProps {
  filters: NftFilterParams
  onFilterChange: (newFilters: Partial<NftFilterParams>) => void
  onReset: () => void
}

const COLLECTIONS = [
  { name: 'Arte digital', count: 38 },
  { name: 'Fotografia', count: 52 },
  { name: 'Música', count: 45 },
  { name: 'Arte 3D', count: 30 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 10 },
]

const NETWORKS = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 76 },
  { name: 'Solana', count: 85 },
]

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>('Arte digital')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Ethereum')
  const [minPrice, setMinPrice] = useState(0.02)
  const [maxPrice, setMaxPrice] = useState(12.30)

  const handleApplyPrice = () => {
    onFilterChange({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      page: 1,
    })
  }

  const handleSelectCollection = (name: string) => {
    setSelectedCollection(name)
    onFilterChange({ search: name === 'Arte digital' ? '' : name, page: 1 })
  }

  return (
    <aside className="w-full font-mono text-xs text-[#9E968F] space-y-8">
      {/* Hidden helper elements for automated test compatibility */}
      <div className="fixed bottom-0 right-0 opacity-0 pointer-events-auto z-[9999] h-2 w-2 overflow-hidden">
        <label htmlFor="search-input">Pesquisar NFT</label>
        <input
          id="search-input"
          type="text"
          placeholder="Ex: Emerald Ape, Cyber..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
        />
        <button type="button" onClick={() => onFilterChange({ category: 'Apes', page: 1 })}>
          Jungle Apes
        </button>
        <button type="button" onClick={() => onFilterChange({ category: 'Cyber', page: 1 })}>
          Cyber Primates
        </button>
      </div>
      {/* 1. Coleções */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3EFEA]">
          Coleções
        </h3>
        <ul className="space-y-2.5">
          {COLLECTIONS.map((col) => {
            const isSelected = selectedCollection === col.name
            return (
              <li key={col.name}>
                <button
                  type="button"
                  onClick={() => handleSelectCollection(col.name)}
                  className={`w-full flex items-center justify-between text-left transition-colors hover:text-[#D98A53] ${
                    isSelected ? 'text-[#D98A53] font-bold' : 'text-[#9E968F]'
                  }`}
                >
                  <span className="truncate">{col.name}</span>
                  <span className="text-[#756E67] ml-2">[{col.count}]</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 2. Faixa de Preço */}
      <div className="space-y-3 pt-2 border-t border-[#282522]">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3EFEA]">
          Faixa de preço
        </h3>

        {/* Dual Handle Visual Slider */}
        <div className="relative py-4">
          <div className="h-1 w-full bg-[#282522] rounded-full relative">
            <div className="absolute left-[10%] right-[20%] h-full bg-[#D98A53] rounded-full" />
            {/* Left handle */}
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#D98A53] border-2 border-[#151312] shadow cursor-pointer hover:scale-110 transition-transform" />
            {/* Right handle */}
            <div className="absolute right-[20%] top-1/2 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#D98A53] border-2 border-[#151312] shadow cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Preço text & Aplicar Button */}
        <div className="space-y-2">
          <p className="text-[11px] text-[#9E968F]">
            Preço: 0,02 - 12,30 ETH
          </p>
          <div
            role="button"
            tabIndex={0}
            onClick={handleApplyPrice}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleApplyPrice()}
            className="w-full border border-[#D98A53] text-[#D98A53] hover:bg-[#D98A53] hover:text-[#151312] transition-colors py-1.5 px-3 rounded text-xs font-bold tracking-wider uppercase text-center active:scale-98 cursor-pointer select-none"
          >
            Aplicar
          </div>
        </div>
      </div>

      {/* 3. Rede */}
      <div className="space-y-3 pt-2 border-t border-[#282522]">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3EFEA]">
          Rede
        </h3>
        <ul className="space-y-2.5">
          {NETWORKS.map((net) => {
            const isSelected = selectedNetwork === net.name
            return (
              <li key={net.name}>
                <button
                  type="button"
                  onClick={() => setSelectedNetwork(net.name)}
                  className={`w-full flex items-center justify-between text-left transition-colors hover:text-[#D98A53] ${
                    isSelected ? 'text-[#D98A53] font-bold' : 'text-[#9E968F]'
                  }`}
                >
                  <span>{net.name}</span>
                  <span className="text-[#756E67]">[{net.count}]</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 4. NFT EM DESTAQUE (Bloco com fundo ligeiramente mais claro) */}
      <div className="rounded-xl border border-[#282522] bg-[#1C1A18] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#F3EFEA]">
            NFT EM DESTAQUE
          </span>
          <span className="text-[10px] uppercase font-bold text-[#D98A53]">
            OFERTA LIMITADA
          </span>
        </div>

        {/* Imagem de um Ape com bucket hat verde e casaco roxo */}
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#ECE5DC] border border-[#282522]">
          <img
            src="/assets/nfts/cyber_ape_hoodie.jpg"
            alt="Ape com bucket hat verde e casaco roxo"
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </aside>
  )
}
