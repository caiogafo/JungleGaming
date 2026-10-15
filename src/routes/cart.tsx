import { useState } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useCart } from '../hooks/useCart'
import { useNfts } from '../hooks/useNfts'
import { formatEth } from '../lib/eth'
import { NftCard } from '../components/catalog/NftCard'
import { ShoppingBag, Trash2, Plus, Minus, AlertTriangle } from 'lucide-react'

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

function CartPage() {
  const {
    items,
    quote,
    couponCode,
    couponFeedback,
    updateQuantity,
    isUpdatingQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const { data: allNftsData } = useNfts({ pageSize: 10 })
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setIsApplyingCoupon(true)
    await applyCoupon(couponInput.trim())
    setIsApplyingCoupon(false)
  }

  const handleProceed = () => {
    navigate({ to: '/checkout' })
  }

  const featuredNfts = (allNftsData?.items || []).slice(0, 5)

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-10 font-mono text-xs text-[#9E968F]">
      {/* 1. Breadcrumb: Início / Mercado / Carrinho */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#9E968F]">
        <Link to="/" className="hover:text-[#F3EFEA] transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/mercado" className="hover:text-[#F3EFEA] transition-colors">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-[#F3EFEA]">Carrinho</span>
      </nav>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#37271c] bg-[#291C19] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#1B1512] border border-[#37271c] flex items-center justify-center text-[#D98A53] mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-[#F3EFEA]">Seu carrinho está vazio</h2>
          <p className="text-xs text-[#9E968F]">
            Nenhum colecionável adicionado ainda. Explore o catálogo para encontrar NFTs raros.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-bold text-xs uppercase px-6 py-2.5 rounded-md transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabela de Itens (Coluna Esquerda) */}
          <div className="lg:col-span-8 space-y-4">
            {quote?.hasPriceChanges && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Cotação atualizada em tempo real conforme as regras da rede.</p>
              </div>
            )}

            <div className="rounded-2xl border border-[#37271c] bg-[#291C19] overflow-hidden shadow-lg">
              {/* Cabeçalho da Tabela: NFTs, Preço, Edições, Total */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-[#37271c] text-xs font-bold text-[#F3EFEA]">
                <div className="col-span-5">NFTs</div>
                <div className="col-span-2 text-center">Preço</div>
                <div className="col-span-2 text-center">Edições</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-right"></div>
              </div>

              {/* Lista de Itens */}
              <div className="divide-y divide-[#37271c]/60">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* NFTs: Imagem + Nome + ID do Token */}
                    <div className="sm:col-span-5 flex items-center gap-3.5 min-w-0">
                      <Link
                        to="/nft/$id"
                        params={{ id: item.nft.id }}
                        className="h-14 w-14 rounded-xl overflow-hidden bg-[#241F1B] border border-[#37271c] shrink-0 block"
                      >
                        <img
                          src={item.nft.image}
                          alt={item.nft.name}
                          className="h-full w-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          to="/nft/$id"
                          params={{ id: item.nft.id }}
                          className="text-xs font-bold text-[#F3EFEA] hover:text-[#D98A53] transition-colors truncate block"
                        >
                          {item.nft.name}
                        </Link>
                        <span className="text-[11px] text-[#9E968F] block">
                          ID do token: #{item.nft.tokenId || '0042'}
                        </span>
                      </div>
                    </div>

                    {/* Preço Unitário */}
                    <div className="sm:col-span-2 text-left sm:text-center">
                      <span className="sm:hidden text-xs text-[#9E968F] mr-2">Preço:</span>
                      <span className="text-xs text-[#F3EFEA]">
                        {formatEth(item.unitPriceEth)}
                      </span>
                    </div>

                    {/* Edições: [-] Qtd [+] com botões laranjas */}
                    <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          disabled={isUpdatingQuantity || item.quantity <= 1}
                          className="h-5 w-5 rounded-full bg-[#D98A53] text-[#151312] font-bold flex items-center justify-center hover:bg-[#E59864] disabled:opacity-30 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3 stroke-[3]" />
                        </button>
                        <span className="w-5 text-center font-bold text-[#F3EFEA]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          disabled={isUpdatingQuantity || item.quantity >= item.edition.availableSupply}
                          className="h-5 w-5 rounded-full bg-[#D98A53] text-[#151312] font-bold flex items-center justify-center hover:bg-[#E59864] disabled:opacity-30 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Total do Item em Laranja Bold */}
                    <div className="sm:col-span-2 text-left sm:text-right">
                      <span className="sm:hidden text-xs text-[#9E968F] mr-2">Total:</span>
                      <span className="text-xs font-bold text-[#D98A53]">
                        {formatEth(Number(item.unitPriceEth) * item.quantity)}
                      </span>
                    </div>

                    {/* Remover Item */}
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-md text-[#9E968F] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label={`Remover ${item.nft.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo da Carteira (Coluna Direita) */}
          <div className="lg:col-span-4 rounded-2xl border border-[#37271c] bg-[#291C19] p-5 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-[#F3EFEA] border-b border-[#37271c] pb-3">
              Resumo da carteira
            </h3>

            {/* Código Promocional */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[11px] font-semibold text-[#F3EFEA] block">
                Código promocional
              </label>
              <div className="flex rounded-md overflow-hidden border border-[#37271c]">
                <input
                  placeholder="Digite o código promocional..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-[#1B1512] text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon}
                  className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] px-4 h-9 font-bold text-xs uppercase transition-colors shrink-0"
                >
                  {isApplyingCoupon ? '...' : 'Aplicar'}
                </button>
              </div>

              {couponFeedback && (
                <p className={`text-[11px] ${couponFeedback.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponFeedback.message}
                </p>
              )}

              {couponCode && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                  <span>Ativo: <strong>{couponCode}</strong></span>
                  <button type="button" onClick={removeCoupon} className="underline hover:text-white">
                    Remover
                  </button>
                </div>
              )}
            </form>

            {/* Linhas de Preço */}
            <div className="space-y-2.5 text-xs text-[#9E968F] pt-2 border-t border-[#37271c]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-[#F3EFEA] font-bold">{formatEth(quote?.subtotalEth)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Desconto do lançamento</span>
                <span className="text-[#F3EFEA]">
                  {quote?.discountEth && quote.discountEth !== '0.000000'
                    ? `(-) ${formatEth(quote.discountEth)}`
                    : '(-) 00.00'}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[#9E968F] block">Taxa de rede</span>
                  <span className="text-[10px] text-[#9E968F]/70 block">Taxa estimada</span>
                </div>
                <span className="text-[#F3EFEA] font-mono">{formatEth(quote?.networkFeeEth)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-[#37271c]">
                <span className="text-[#F3EFEA]">Total</span>
                <span className="text-[#D98A53] text-base">{formatEth(quote?.totalEth)}</span>
              </div>
            </div>

            {/* Botão Principal: Continuar e conectar */}
            <button
              type="button"
              onClick={handleProceed}
              className="w-full bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase h-10 px-4 rounded-md transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              Continuar e conectar
            </button>

            <div className="text-center pt-1">
              <Link
                to="/"
                className="text-xs text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
              >
                Continuar explorando
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Seção Coleções em alta (5 cards + 3 pontos centralizados conforme Figma) */}
      <div className="pt-10 space-y-6">
        <h2 className="font-mono text-base font-bold text-[#D98A53]">
          Coleções em alta
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featuredNfts.map((item) => (
            <NftCard key={item.id} nft={item} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D98A53]" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D98A53]/50" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D98A53]/20" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
