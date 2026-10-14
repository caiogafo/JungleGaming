import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { X, Trash2, Plus, Minus, Tag, AlertTriangle, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { formatEth } from '../../lib/eth'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenAuth: () => void
}

export function CartDrawer({ isOpen, onClose, onOpenAuth }: CartDrawerProps) {
  const {
    items,
    isLoadingCart,
    quote,
    couponCode,
    couponFeedback,
    updateQuantity,
    isUpdatingQuantity,
    removeItem,
    isRemovingItem,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  if (!isOpen) return null

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setIsApplyingCoupon(true)
    await applyCoupon(couponInput.trim())
    setIsApplyingCoupon(false)
  }

  const handleProceedToCheckout = () => {
    onClose()
    if (!isAuthenticated) {
      onOpenAuth()
    } else {
      navigate({ to: '/checkout' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Carrinho de Compras">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Carrinho de NFTs</h2>
              <span className="rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold px-2 py-0.5">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="h-14 w-14 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500 mb-3">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-white">Seu carrinho está vazio</h3>
                <p className="mt-1 text-xs text-stone-400 max-w-xs">
                  Navegue pelo catálogo para adicionar colecionáveis raros da Jungle Gaming.
                </p>
                <Button variant="default" size="sm" onClick={onClose} className="mt-4 font-bold text-xs">
                  Explorar Coleções
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl border border-border/80 bg-surface-elevated transition-colors"
                  >
                    <img
                      src={item.nft.image}
                      alt={item.nft.name}
                      className="h-20 w-20 rounded-lg object-cover bg-stone-900 shrink-0 border border-border/60"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">{item.nft.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-red-400 p-0.5 transition-colors"
                            aria-label={`Remover ${item.nft.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-400 font-medium">{item.edition.name}</p>
                        <p className="text-xs font-mono font-bold text-white mt-1">
                          {formatEth(item.unitPriceEth)}
                        </p>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 border border-border rounded-lg bg-surface px-1 py-0.5">
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

                        <span className="text-xs font-mono text-stone-400">
                          {item.edition.availableSupply} disponíveis
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price change or availability warning notice */}
            {quote?.hasPriceChanges && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Valores recalculados em tempo real</p>
                  <p className="text-[11px] text-amber-200/80">
                    O valor de um ou mais itens no carrinho foi atualizado pela cotação do servidor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-border bg-surface-elevated/70 p-6 space-y-4">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <Input
                    placeholder="Cupom (ex: JUNGLE10)"
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
                    <span>Cupom ativo: <strong>{couponCode}</strong></span>
                    <button type="button" onClick={removeCoupon} className="text-xs underline hover:text-white">
                      Remover
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-border/60 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatEth(quote?.subtotalEth)}</span>
                </div>
                {quote?.discountEth && quote.discountEth !== '0.000000' && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto ({couponCode})</span>
                    <span className="font-mono">-{formatEth(quote.discountEth)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Taxa estimada de rede (Gas)</span>
                  <span className="font-mono">{formatEth(quote?.networkFeeEth)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-amber-400 font-mono text-base">{formatEth(quote?.totalEth)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="default"
                size="lg"
                onClick={handleProceedToCheckout}
                className="w-full font-extrabold text-sm gap-2 shadow-amber-500/20"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
