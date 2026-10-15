import { useState, useEffect } from 'react'
import { createRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useNftDetail, useNfts } from '../hooks/useNfts'
import { useFavorites } from '../hooks/useFavorites'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatEth } from '../lib/eth'
import { NftCard } from '../components/catalog/NftCard'
import { NftDetailSkeleton } from '../components/feedback/Skeleton'
import {
  Heart,
  Search,
  Plus,
  Minus,
  AlertCircle,
  Mail,
  X,
  ChevronLeft,
  ShoppingCart,
} from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'h-3.5 w-3.5 fill-current'} viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'h-3.5 w-3.5 fill-current'} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NftDetailPage,
})

function NftDetailPage() {
  const { id } = useParams({ from: '/nft/$id' })
  const navigate = useNavigate()
  const { data: nft, isLoading, isError } = useNftDetail(id)
  const { data: allNftsData } = useNfts({ pageSize: 12 })
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem, isAddingItem } = useCart()
  const { isAuthenticated } = useAuth()

  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0)
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [addedToast, setAddedToast] = useState(false)

  // Reseta estado e atualiza sessionStorage/scroll sempre que um novo NFT é selecionado
  useEffect(() => {
    setSelectedThumbnailIndex(0)
    setSelectedEditionId(null)
    setQuantity(1)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_selected_nft_id', id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [id])

  // Atualiza dinamicamente o título da aba do navegador de acordo com o NFT selecionado
  useEffect(() => {
    if (nft?.name) {
      document.title = `${nft.name} — KURIO NFT Marketplace`
    }
    return () => {
      document.title = 'KURIO — Marketplace de NFTs de Alto Padrão'
    }
  }, [nft?.name])

  if (isLoading) {
    return (
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <NftDetailSkeleton />
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-mono">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#F3EFEA] mb-2">NFT Não Encontrado</h2>
        <p className="text-xs text-[#9E968F] mb-6">
          O colecionável com ID #{id} não existe ou foi removido do marketplace da Kurio.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#D98A53] text-[#151312] font-bold text-xs uppercase px-6 py-2.5 rounded-md hover:bg-[#E59864] transition-colors"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    )
  }

  const activeImage = nft.image
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
    navigate({ to: '/cart' })
  }

  // Miniaturas laterais: 4 repetições da imagem do próprio NFT selecionado
  const thumbnails = [nft.image, nft.image, nft.image, nft.image]

  // Coleção "Mais desta coleção" (5 itens conforme Figma)
  const collectionNfts = (allNftsData?.items || [])
    .filter((item) => item.id !== nft.id)
    .slice(0, 5)

  return (
    <>
      {/* ========================================================= */}
      {/* 1. VISUALIZAÇÃO MOBILE (Telas < 768px - idêntica ao Figma) */}
      {/* ========================================================= */}
      <div className="block md:hidden min-h-screen px-4 pt-3 pb-36 font-mono text-xs text-[#9E968F] bg-[#16110E]">
        {/* Top Bar Mobile com botão Voltar (<) e Favoritar (♡) */}
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="h-10 w-10 rounded-full bg-[#2A201C] border border-[#3D2E27] flex items-center justify-center text-[#F3EFEA] hover:text-[#D98A53] transition-colors shadow-md active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(nft.id)}
            className={`h-10 w-10 rounded-full bg-[#2A201C] border border-[#3D2E27] flex items-center justify-center transition-colors shadow-md active:scale-95 ${
              isFav ? 'text-red-500 border-red-500/50' : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-current text-red-500' : ''}`} />
          </button>
        </div>

        {/* Card da Imagem Principal */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#241F1B] border border-[#37271c]/50 shadow-2xl mt-1">
          <img
            src={activeImage}
            alt={nft.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Informações da Obra */}
        <div className="pt-5 space-y-4 font-mono">
          {/* Título e Badge de Avaliação */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-[#F3EFEA] leading-tight">
              {nft.name}
            </h1>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D98A53]/50 bg-[#291C19] text-xs font-mono shrink-0">
              <span className="text-[#D98A53] font-bold">★ 4.8</span>
              <span className="text-[#9E968F]">(19)</span>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-xs text-[#9E968F] leading-relaxed">
            {nft.description ||
              'Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.'}
          </p>

          {/* Seletor de Edição */}
          <div className="space-y-2 pt-1">
            <h3 className="font-bold text-xs text-[#F3EFEA]">Edição:</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {nft.editions && nft.editions.length > 0 ? (
                nft.editions.map((ed) => {
                  const isSelected = activeEdition?.id === ed.id
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => setSelectedEditionId(ed.id)}
                      className={`px-3.5 py-1.5 rounded-full font-mono text-xs border transition-colors shrink-0 ${
                        isSelected
                          ? 'border-[#D98A53] text-[#D98A53] bg-[#D98A53]/15 font-bold'
                          : 'border-[#37271c] text-[#9E968F] bg-[#1F1714] hover:border-[#D98A53]'
                      }`}
                    >
                      {ed.name}
                    </button>
                  )
                })
              ) : (
                <>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1F1714]"
                  >
                    1/10
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1F1714]"
                  >
                    1/10
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full font-mono text-xs border border-[#D98A53] text-[#D98A53] bg-[#D98A53]/15 font-bold"
                  >
                    1/50
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1F1714]"
                  >
                    ABERTA
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Metadados: ID, Coleção, Atributos */}
          <div className="space-y-2 text-xs text-[#9E968F] pt-2">
            <div>
              <span>ID do token: </span>
              <span className="text-[#F3EFEA]">#{nft.tokenId || '0042'}</span>
            </div>
            <div>
              <span>Coleção: </span>
              <span className="text-[#F3EFEA]">{nft.collection || 'Kurio Apes'}</span>
            </div>
            <div>
              <span>Atributos: </span>
              <span className="text-[#F3EFEA]">
                {nft.attributes && nft.attributes.length > 0
                  ? nft.attributes.map((a) => a.value).join(', ')
                  : `${nft.category}, ${nft.rarity}`}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Seção "Mais desta coleção" no Mobile (conforme Figma) */}
        <div className="pt-8 space-y-4">
          <h2 className="font-mono text-sm font-bold text-[#D98A53]">
            Mais desta coleção
          </h2>

          {/* Grade de 2 colunas para cards no mobile */}
          <div className="grid grid-cols-2 gap-3.5">
            {collectionNfts.map((item) => (
              <NftCard key={item.id} nft={item} />
            ))}
          </div>

          {/* Três pequenos pontos de paginação centralizados conforme Figma: ○ ● ○ */}
          <div className="flex justify-center items-center gap-2 pt-2">
            <span className="h-1.5 w-1.5 rounded-full border border-[#D98A53] bg-transparent" aria-hidden="true" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#D98A53]" aria-hidden="true" />
            <span className="h-1.5 w-1.5 rounded-full border border-[#D98A53] bg-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* Notificação toast de item adicionado */}
        {addedToast && (
          <div className="fixed top-4 left-4 right-4 z-50 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs text-center shadow-2xl animate-in fade-in">
            ✓ Item adicionado ao carrinho com sucesso!
          </div>
        )}

        {/* Barra Fixa de Ação no Rodapé (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#191310]/95 backdrop-blur-md border-t border-[#37271c] px-5 py-3 space-y-3 shadow-2xl">
          {/* Linha superior: Qtd e Preço */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-mono text-xs text-[#9E968F]">
              <span>Qtd.</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-6 h-6 rounded-full bg-[#D98A53] text-[#151312] flex items-center justify-center font-bold text-xs hover:bg-[#E59864] disabled:opacity-40 transition-colors"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-[#F3EFEA] text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 rounded-full bg-[#D98A53] text-[#151312] flex items-center justify-center font-bold text-xs hover:bg-[#E59864] transition-colors"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            <div className="font-mono text-xl font-bold text-[#D98A53]">
              {formatEth(activeEdition?.priceEth || nft.basePriceEth)}
            </div>
          </div>

          {/* Linha inferior: Botão Comprar NFT e Carrinho */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-[#C48247] hover:bg-[#D98A53] text-[#151312] font-mono font-bold text-xs uppercase rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center tracking-wider"
            >
              Comprar NFT
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="h-12 w-12 rounded-2xl bg-[#2A201C] border border-[#3D2E27] flex items-center justify-center text-[#F3EFEA] hover:text-[#D98A53] transition-colors shrink-0 shadow-md active:scale-95"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. VISUALIZAÇÃO DESKTOP (Telas >= 768px)                   */}
      {/* ========================================================= */}
      <div className="hidden md:block max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-10 font-mono text-xs text-[#9E968F]">
        {/* 1. Breadcrumb no topo: Início / Mercado */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#9E968F]">
          <Link to="/" className="hover:text-[#F3EFEA] transition-colors">
            Início
          </Link>
          <span>/</span>
          <span className="text-[#F3EFEA]">Mercado</span>
        </nav>

      {/* 2. Grid Principal: Galeria à esquerda e Informações à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Esquerda: 4 miniaturas verticais + Imagem Principal com Lupa */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Miniaturas verticais */}
          <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible">
            {thumbnails.map((thumb, idx) => {
              const isSelected = selectedThumbnailIndex === idx
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedThumbnailIndex(idx)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-[#241F1B] border transition-all shrink-0 ${
                    isSelected
                      ? 'border-[#D98A53] shadow-md shadow-[#D98A53]/20'
                      : 'border-[#37271c] hover:border-[#D98A53]'
                  }`}
                  aria-label={`Ver perspectiva ${idx + 1}`}
                >
                  <img
                    src={thumb}
                    alt={`Miniatura ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              )
            })}
          </div>

          {/* Imagem Principal com cantos arredondados e botão de lupa */}
          <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-3xl bg-[#241F1B] shadow-xl group border border-[#37271c]/50">
            <img
              src={activeImage}
              alt={nft.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => setIsZoomOpen(true)}
            />
            {/* Botão de lupa no canto superior direito */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-[#F3EFEA] flex items-center justify-center hover:bg-black/80 hover:text-[#D98A53] transition-colors"
              aria-label="Ampliar imagem do NFT"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Direita: Título dinâmico, Preço, Edição, Ações e Metadados */}
        <div className="lg:col-span-5 space-y-5">
          {/* Título do NFT (dinâmico com base no item selecionado) */}
          <h1 className="font-mono text-2xl sm:text-[28px] font-bold text-[#F3EFEA] tracking-tight leading-tight">
            {nft.name}
          </h1>

          {/* Preço e Avaliações */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#D98A53]">
              {formatEth(activeEdition?.priceEth || nft.basePriceEth)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#9E968F]">
              <span className="text-[#D98A53] tracking-widest">★★★★★</span>
              <span>19 avaliações de colecionadores</span>
            </div>
          </div>

          {/* Sobre este NFT */}
          <div className="space-y-1.5 text-xs text-[#9E968F]">
            <h3 className="font-bold text-[#F3EFEA]">
              Sobre este NFT:
            </h3>
            <p className="leading-relaxed">
              {nft.description ||
                'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.'}
            </p>
          </div>

          {/* Seletor de Edição em Pílulas */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-[#F3EFEA]">
              Edição:
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {nft.editions && nft.editions.length > 0 ? (
                nft.editions.map((ed) => {
                  const isSelected = activeEdition?.id === ed.id
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => setSelectedEditionId(ed.id)}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-colors ${
                        isSelected
                          ? 'border-[#D98A53] text-[#D98A53] bg-[#D98A53]/10 font-bold'
                          : 'border-[#37271c] text-[#9E968F] bg-[#1B1512] hover:text-[#F3EFEA] hover:border-[#D98A53]'
                      }`}
                    >
                      {ed.name}
                    </button>
                  )
                })
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-md font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1B1512]">
                    1/1
                  </span>
                  <span className="px-3 py-1.5 rounded-md font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1B1512]">
                    1/10
                  </span>
                  <span className="px-3 py-1.5 rounded-md font-mono text-xs border border-[#D98A53] text-[#D98A53] bg-[#D98A53]/10 font-bold">
                    1/50
                  </span>
                  <span className="px-3 py-1.5 rounded-md font-mono text-xs border border-[#37271c] text-[#9E968F] bg-[#1B1512]">
                    ABERTA
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Controle de Quantidade e Botões de Ação */}
          <div className="flex items-center gap-3 pt-2">
            {/* Seletor [-] Qtd [+] */}
            <div className="flex items-center bg-[#291C19] border border-[#37271c] rounded-md h-10 px-2 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-1 hover:text-[#D98A53] disabled:opacity-30"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-7 text-center font-bold text-[#F3EFEA]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 hover:text-[#D98A53]"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Botão COMPRAR (laranja sólido) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase h-10 px-6 rounded-md transition-colors shadow-md active:scale-95"
            >
              COMPRAR
            </button>

            {/* Botão Favoritar (borda escura com ícone coração) */}
            <button
              type="button"
              onClick={() => toggleFavorite(nft.id)}
              className={`flex items-center gap-1.5 bg-[#291C19] border border-[#37271c] hover:border-[#D98A53] text-[#F3EFEA] font-mono text-xs h-10 px-4 rounded-md transition-colors shrink-0 ${
                isFav ? 'text-red-400 border-red-500/50' : ''
              }`}
              aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current text-red-500' : ''}`} />
              <span>Favoritar</span>
            </button>
          </div>

          {addedToast && (
            <p className="text-xs text-emerald-400 font-semibold animate-in fade-in">
              ✓ Item adicionado ao pedido!
            </p>
          )}

          {/* Metadados: ID, Coleção, Atributos e Compartilhar */}
          <div className="space-y-2 text-xs text-[#9E968F] pt-4 border-t border-[#37271c]/60">
            <div>
              ID do token: <span className="text-[#F3EFEA]">#{nft.tokenId || '0042'}</span>
            </div>
            <div>
              Coleção: <span className="text-[#F3EFEA]">{nft.collection || 'Kurio Apes'}</span>
            </div>
            <div>
              Atributos:{' '}
              <span className="text-[#F3EFEA]">
                {nft.attributes && nft.attributes.length > 0
                  ? nft.attributes.map((a) => a.value).join(', ')
                  : `${nft.category}, ${nft.rarity}`}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span>Compartilhar este NFT:</span>
              <div className="flex items-center gap-2.5 text-[#F3EFEA]">
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#D98A53] transition-colors"
                  aria-label="Compartilhar no LinkedIn"
                >
                  <LinkedinIcon className="h-3.5 w-3.5 fill-current" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(nft.name)}&body=${encodeURIComponent(window.location.href)}`}
                  className="hover:text-[#D98A53] transition-colors"
                  aria-label="Compartilhar por e-mail"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(nft.name)}&url=${window.location.href}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#D98A53] transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  <TwitterIcon className="h-3.5 w-3.5 fill-current" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Seção de Abas: Detalhes do NFT | Avaliações de colecionadores (19) */}
      <div className="pt-10 space-y-6">
        {/* Cabeçalho das Abas com borda inferior #37271c */}
        <div className="flex items-center gap-8 border-b border-[#37271c] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-bold transition-colors relative ${
              activeTab === 'details'
                ? 'text-[#D98A53]'
                : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            <span>Detalhes do NFT</span>
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-[#D98A53]'
                : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
          >
            <span>Avaliações de colecionadores (19)</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D98A53]" />
            )}
          </button>
        </div>

        {/* Conteúdo da Aba */}
        {activeTab === 'details' ? (
          <div className="space-y-4 text-xs text-[#9E968F] leading-relaxed max-w-4xl">
            <p>
              {nft.name} é uma obra digital {activeEdition?.name || '1/50'} finalizada à mão da coleção {nft.collection || 'Kurio Editions'}.
              Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade,
              movimento e luz em um mundo digital sem fronteiras.
            </p>
            <p>
              A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro
              permanente de procedência registrada na rede. Novo Sato recebe 5% de direitos autorais nas vendas
              secundárias, apoiando novos trabalhos e lançamentos da comunidade.
            </p>

            <div className="space-y-3 pt-3">
              <div>
                <strong className="text-[#F3EFEA] block mb-0.5">Rede:</strong>
                <p>Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.</p>
              </div>

              <div>
                <strong className="text-[#F3EFEA] block mb-0.5">Contrato:</strong>
                <p>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</p>
              </div>

              <div>
                <strong className="text-[#F3EFEA] block mb-0.5">Direitos autorais:</strong>
                <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-[#9E968F]">
            <div className="p-4 rounded-xl bg-[#291C19] border border-[#37271c] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F3EFEA]">Alex (VIP Hunter)</span>
                <span className="text-[#D98A53]">★★★★★</span>
              </div>
              <p>Obra impressionante com qualidade impecável. A finalização e os contrastes ficaram incríveis.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#291C19] border border-[#37271c] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F3EFEA]">Sara (Crypto Whale)</span>
                <span className="text-[#D98A53]">★★★★★</span>
              </div>
              <p>Coleção histórica da Kurio. Vale cada fração de ETH pela exclusividade e procedência verificada.</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Seção "Mais desta coleção" (5 itens conforme Figma) */}
      <div className="pt-12 space-y-6">
        <h2 className="font-mono text-base font-bold text-[#D98A53]">
          Mais desta coleção
        </h2>

        {/* Grade de 5 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {collectionNfts.map((item) => (
            <NftCard key={item.id} nft={item} />
          ))}
        </div>

        {/* Três pequenos pontos de paginação centralizados conforme Figma: ○ ● ○ */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="h-1.5 w-1.5 rounded-full border border-[#D98A53] bg-transparent" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D98A53]" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full border border-[#D98A53] bg-transparent" aria-hidden="true" />
        </div>
      </div>

      {/* Lightbox Modal de Zoom ao clicar na Lupa */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-10 right-0 text-[#F3EFEA] hover:text-[#D98A53] transition-colors p-1"
              aria-label="Fechar zoom"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activeImage}
              alt={nft.name}
              className="w-full h-auto rounded-2xl shadow-2xl border border-[#37271c]"
            />
          </div>
        </div>
      )}
    </div>
  </>
)
}
