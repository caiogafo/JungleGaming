import { Link } from '@tanstack/react-router'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { formatEth } from '../../lib/eth'
import { useFavorites } from '../../hooks/useFavorites'
import { useCart } from '../../hooks/useCart'
import type { NFT } from '../../types/nft'

interface NftCardProps {
  nft: NFT
  onOpenAuth?: () => void
}

export function NftCard({ nft, onOpenAuth }: NftCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem, isAddingItem } = useCart()

  const isFav = isFavorite(nft.id)
  const defaultEdition = nft.editions[0]
  const currentPrice = defaultEdition?.priceEth || nft.basePriceEth

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleFavorite(nft.id)
    } catch {
      onOpenAuth?.()
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!defaultEdition) return
    await addItem({
      nftId: nft.id,
      editionId: defaultEdition.id,
      quantity: 1,
    })
  }

  const getRarityVariant = (rarity: string) => {
    switch (rarity) {
      case 'Lendário':
        return 'rarityLegendary'
      case 'Épico':
        return 'rarityEpic'
      case 'Raro':
        return 'rarityRare'
      default:
        return 'rarityCommon'
    }
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-black/50">
      <div>
        {/* NFT Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-900">
          <img
            src={nft.image}
            alt={nft.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Rarity Badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge variant={getRarityVariant(nft.rarity)} className="text-[10px] px-2 py-0.5">
              {nft.rarity}
            </Badge>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${
              isFav
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20 scale-105'
                : 'bg-black/50 text-stone-300 hover:text-red-400 hover:bg-black/80 border border-white/10'
            }`}
            aria-label={isFav ? `Remover ${nft.name} dos favoritos` : `Adicionar ${nft.name} aos favoritos`}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-current text-red-400' : ''}`} />
          </button>
        </div>

        {/* Content Info */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="truncate max-w-[140px]">{nft.collection}</span>
            <span className="font-mono text-[11px] text-stone-500">#{nft.tokenId}</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {nft.name}
          </h3>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-4 pt-3 border-t border-border/60">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase font-semibold text-stone-400">Preço</p>
            <p className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
              {formatEth(currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-semibold text-stone-400">Disponível</p>
            <p className="text-xs font-semibold text-stone-300">
              {defaultEdition?.availableSupply ?? 0} unid.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/nft/$id"
            params={{ id: nft.id }}
            className="w-full inline-flex"
          >
            <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-border">
              <Eye className="h-3.5 w-3.5" />
              <span>Detalhes</span>
            </Button>
          </Link>

          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            isLoading={isAddingItem}
            className="w-full text-xs font-bold gap-1 shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Comprar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
