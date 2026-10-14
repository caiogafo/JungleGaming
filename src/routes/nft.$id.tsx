import { useState } from 'react'
import { createRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useNftDetail, useSimilarNfts } from '../hooks/useNfts'
import { useFavorites } from '../hooks/useFavorites'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatEth } from '../lib/eth'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { NftCard } from '../components/catalog/NftCard'
import { NftDetailSkeleton } from '../components/feedback/Skeleton'
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
} from 'lucide-react'

export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NftDetailPage,
})

function NftDetailPage() {
  const { id } = useParams({ from: '/nft/$id' })
  const navigate = useNavigate()
  const { data: nft, isLoading, isError } = useNftDetail(id)
  const { data: similarNfts = [] } = useSimilarNfts(id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem, isAddingItem } = useCart()
  const { isAuthenticated } = useAuth()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToast, setAddedToast] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NftDetailSkeleton />
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">NFT Não Encontrado</h2>
        <p className="text-sm text-stone-400 mb-6">
          O colecionável com ID #{id} não existe ou foi removido do marketplace da Jungle.
        </p>
        <Link to="/">
          <Button variant="default" className="font-bold text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  const activeImage = selectedImage || nft.image
  const activeEdition =
    nft.editions.find((e) => e.id === (selectedEditionId || nft.selectedEditionId)) || nft.editions[0]
  const isFav = isFavorite(nft.id)

  const handleAddToCart = async () => {
    if (!activeEdition) return
    await addItem({
      nftId: nft.id,
      editionId: activeEdition.id,
      quantity,
    })
    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)
  }

  const handleBuyNow = async () => {
    if (!activeEdition) return
    await addItem({
      nftId: nft.id,
      editionId: activeEdition.id,
      quantity,
    })
    navigate({ to: '/checkout' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para o catálogo</span>
      </Link>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery thumbnails & Preview */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical thumbnails */}
          {nft.thumbnails && nft.thumbnails.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {nft.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(thumb)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === thumb
                      ? 'border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                      : 'border-border/80 opacity-70 hover:opacity-100 hover:border-stone-500'
                  }`}
                  aria-label={`Ver imagem ${idx + 1}`}
                >
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-2xl border border-border bg-stone-900 shadow-2xl">
            <img
              src={activeImage}
              alt={nft.name}
              className="h-full w-full object-cover transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="rarityLegendary" className="text-xs px-3 py-1 font-bold">
                {nft.rarity}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Info, Editions, Quantity and Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono">
                {nft.collection}
              </span>
              <span className="text-stone-500 text-xs">•</span>
              <span className="text-xs text-stone-400 font-mono">Token #{nft.tokenId}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              {nft.name}
            </h1>

            {/* Creator info */}
            <div className="flex items-center gap-2 mt-3 text-xs text-stone-300">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.name}
                className="h-6 w-6 rounded-full border border-amber-500/30"
              />
              <span>Criado por <strong>{nft.creator.name}</strong></span>
              {nft.creator.verified && (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              )}
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            {nft.description}
          </p>

          {/* Edition Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              Selecione a Edição
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nft.editions.map((edition) => {
                const isSelected = activeEdition.id === edition.id
                const isSoldOut = edition.availableSupply <= 0

                return (
                  <button
                    key={edition.id}
                    onClick={() => {
                      setSelectedEditionId(edition.id)
                      setQuantity(1)
                    }}
                    disabled={isSoldOut}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10'
                        : 'border-border bg-surface-elevated hover:border-stone-500'
                    } ${isSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white">{edition.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-extrabold text-amber-400 font-mono">
                        {formatEth(edition.priceEth)}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {isSoldOut ? 'Esgotado' : `${edition.availableSupply}/${edition.maxSupply} restam`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pricing Card & Quantity Limiter */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold text-stone-400 block mb-1">
                  Preço da Edição Atual
                </span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {formatEth(activeEdition.priceEth)}
                </span>
              </div>

              {/* Quantity selector */}
              <div className="space-y-1">
                <span className="text-xs text-stone-400 block sm:text-right">Quantidade</span>
                <div className="flex items-center gap-2 border border-border rounded-xl bg-surface px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-white disabled:opacity-30"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold font-mono text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(activeEdition.availableSupply, q + 1))}
                    disabled={quantity >= activeEdition.availableSupply}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-white disabled:opacity-30"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleBuyNow}
                disabled={activeEdition.availableSupply <= 0}
                className="sm:col-span-7 font-extrabold text-sm gap-2 shadow-amber-500/25"
              >
                <Sparkles className="h-4 w-4" />
                <span>Comprar Agora</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAddingItem}
                disabled={activeEdition.availableSupply <= 0}
                className="sm:col-span-3 text-xs font-bold gap-1.5 border-border"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Carrinho</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite(nft.id)}
                className={`sm:col-span-2 border-border p-0 ${
                  isFav ? 'text-red-400 border-red-500/40 bg-red-500/10' : 'text-stone-300'
                }`}
                aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {addedToast && (
              <p className="text-xs text-emerald-400 text-center font-semibold animate-in fade-in">
                ✓ Item adicionado ao carrinho com sucesso!
              </p>
            )}
          </div>

          {/* Technical properties summary */}
          <div className="rounded-xl border border-border bg-surface p-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Standard</span>
              <span className="font-mono text-white font-bold">{nft.tokenStandard}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Blockchain</span>
              <span className="text-amber-400 font-bold">{nft.blockchain}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Curtidas</span>
              <span className="font-mono text-white font-bold">{nft.likesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar NFTs Section */}
      {similarNfts.length > 0 && (
        <section className="pt-10 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              Colecionáveis Recomendados
            </h2>
            <Link to="/" className="text-xs text-amber-400 hover:underline">
              Ver todos no catálogo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarNfts.map((item) => (
              <NftCard key={item.id} nft={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
