import { useState } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatEth } from '../lib/eth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ShoppingBag, Trash2, Plus, Minus, Tag, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'

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

  const { isAuthenticated } = useAuth()
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

  const handleCheckout = () => {
    navigate({ to: '/checkout' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShoppingBag className="h-7 w-7 text-amber-400" />
            Carrinho de NFTs
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Revise os itens selecionados e avance para o pagamento seguro na blockchain.
          </p>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-xs text-stone-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Continuar Comprando
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mx-auto mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-xs text-stone-400 mb-6">
            Você ainda não adicionou nenhum colecionável. Visite o catálogo e encontre NFTs raros.
          </p>
          <Link to="/">
            <Button variant="default" className="font-bold text-sm">
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {quote?.hasPriceChanges && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-xs text-amber-300 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Atualização de Cotação em Tempo Real</p>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    Os valores de um ou mais itens foram ajustados de acordo com a última cotação do servidor.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-lg">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-surface-elevated/60 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <div className="col-span-6">Item Colecionável</div>
                <div className="col-span-3 text-center">Quantidade</div>
                <div className="col-span-2 text-right">Preço Unitário</div>
                <div className="col-span-1 text-right">Ação</div>
              </div>

              <div className="divide-y divide-border/60">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Item Info */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <img
                        src={item.nft.image}
                        alt={item.nft.name}
                        className="h-16 w-16 rounded-xl object-cover bg-stone-900 border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.nft.name}</h4>
                        <p className="text-xs text-amber-400 font-medium">{item.edition.name}</p>
                        <span className="text-[11px] text-stone-400 font-mono">#{item.nft.tokenId}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center gap-2 border border-border rounded-lg bg-surface-elevated px-2 py-1">
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          disabled={isUpdatingQuantity || item.quantity <= 1}
                          className="h-6 w-6 rounded flex items-center justify-center text-stone-400 hover:text-white disabled:opacity-30"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          disabled={isUpdatingQuantity || item.quantity >= item.edition.availableSupply}
                          className="h-6 w-6 rounded flex items-center justify-center text-stone-400 hover:text-white disabled:opacity-30"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-right">
                      <span className="sm:hidden text-xs text-stone-400 mr-2">Preço:</span>
                      <span className="text-sm font-extrabold text-white font-mono">
                        {formatEth(item.unitPriceEth)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <div className="sm:col-span-1 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-border pb-3">
              Resumo do Pedido
            </h3>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 block">Cupom Promocional</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Código (ex: JUNGLE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="h-9 text-xs uppercase font-mono"
                  leftIcon={<Tag className="h-3.5 w-3.5" />}
                />
                <Button type="submit" size="sm" variant="outline" isLoading={isApplyingCoupon} className="text-xs">
                  Aplicar
                </Button>
              </div>
              {couponFeedback && (
                <p className={`text-xs ${couponFeedback.isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
              {couponCode && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                  <span>Ativo: <strong>{couponCode}</strong></span>
                  <button type="button" onClick={removeCoupon} className="text-xs underline hover:text-white">
                    Remover
                  </button>
                </div>
              )}
            </form>

            {/* Financial Details */}
            <div className="space-y-2.5 text-xs text-stone-300 pt-3 border-t border-border">
              <div className="flex justify-between">
                <span>Subtotal dos Itens</span>
                <span className="font-mono text-white font-semibold">{formatEth(quote?.subtotalEth)}</span>
              </div>
              {quote?.discountEth && quote.discountEth !== '0.000000' && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Desconto Aplicado</span>
                  <span className="font-mono">-{formatEth(quote.discountEth)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Taxa Estimada de Rede (Gas)</span>
                <span className="font-mono">{formatEth(quote?.networkFeeEth)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-border">
                <span>Total Estimado</span>
                <span className="text-amber-400 font-mono text-xl">{formatEth(quote?.totalEth)}</span>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={handleCheckout}
              className="w-full font-extrabold text-sm gap-2 shadow-amber-500/25"
            >
              <span>Avançar para Pagamento</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
