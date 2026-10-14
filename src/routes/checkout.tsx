import { useState, useId } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useWallets } from '../hooks/useWallets'
import { useOrders } from '../hooks/useOrders'
import { formatEth } from '../lib/eth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import type { BlockchainNetwork } from '../types/wallet'
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  RefreshCw,
  XCircle,
} from 'lucide-react'

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

function CheckoutPage() {
  const { user, isAuthenticated } = useAuth()
  const { items, quote, couponCode, isLoadingCart } = useCart()
  const { wallets, primaryWallet, isLoading: isLoadingWallets } = useWallets()
  const { createOrder, isCreatingOrder, createOrderError } = useOrders()
  const navigate = useNavigate()

  // Form states
  const [selectedWalletId, setSelectedWalletId] = useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = useState<BlockchainNetwork>('Ethereum')
  const [walletStatus, setWalletStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'rejected'>('connected')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Stable Idempotency Key generated once for this checkout attempt
  const [idempotencyKey] = useState(() => `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Autenticação Necessária</h2>
        <p className="text-xs text-stone-400 mb-6">
          Você precisa estar conectado à sua conta Jungle para finalizar o checkout e assinar a transação.
        </p>
        <Link to="/">
          <Button variant="default" className="font-bold text-sm">
            Fazer Login ou Cadastrar
          </Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Carrinho Vazio</h2>
        <p className="text-xs text-stone-400 mb-6">Não há itens no carrinho para pagamento.</p>
        <Link to="/">
          <Button variant="default" className="font-bold text-sm">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  const activeWalletId = selectedWalletId || primaryWallet?.id || wallets[0]?.id || ''
  const activeWallet = wallets.find((w) => w.id === activeWalletId)

  const handleSimulateDisconnect = () => {
    setWalletStatus('disconnected')
  }

  const handleSimulateConnect = () => {
    setWalletStatus('connecting')
    setTimeout(() => {
      setWalletStatus('connected')
    }, 600)
  }

  const handleSimulateReject = () => {
    setWalletStatus('rejected')
  }

  const handleConfirmOrder = async () => {
    setValidationError(null)

    if (!activeWalletId) {
      setValidationError('Selecione uma carteira Web3 para o pagamento.')
      return
    }

    if (walletStatus !== 'connected') {
      setValidationError('A carteira selecionada precisa estar conectada.')
      return
    }

    if (!agreedTerms) {
      setValidationError('Você precisa aceitar os termos de compra de NFTs.')
      return
    }

    if (quote?.hasPriceChanges) {
      setValidationError('Os preços mudaram durante o checkout. Revise o resumo antes de reenviar.')
      return
    }

    try {
      const order = await createOrder({
        idempotencyKey,
        walletId: activeWalletId,
        network: selectedNetwork,
        couponCode: couponCode || undefined,
      })

      navigate({ to: '/receipt/$id', params: { id: order.id } })
    } catch (err: any) {
      setValidationError(err.message || 'Falha ao processar pagamento.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-amber-400" />
            Pagamento e Finalização de Pedido
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Revisão com chave de idempotência segura e simulação de transação Web3.
          </p>
        </div>
        <Link to="/cart">
          <Button variant="ghost" size="sm" className="text-xs text-stone-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar ao Carrinho
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form & Wallet Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Collector Identity Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                1
              </span>
              <h3 className="font-bold text-white text-sm">Dados do Colecionador</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Nome Completo</label>
                <Input value={user?.name || ''} disabled className="bg-surface-elevated/50 font-semibold text-white" />
              </div>
              <div>
                <label className="text-stone-400 block mb-1">E-mail Cadastrado</label>
                <Input value={user?.email || ''} disabled className="bg-surface-elevated/50 font-mono text-stone-300" />
              </div>
            </div>
          </div>

          {/* Wallet Selection & Network Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <h3 className="font-bold text-white text-sm">Carteira Web3 & Rede Blockchain</h3>
              </div>
              <Link to="/wallets" className="text-xs text-amber-400 hover:underline">
                Gerenciar Carteiras
              </Link>
            </div>

            {/* Wallet Selector Pills */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300 block">
                Selecione a Carteira para Assinatura
              </label>
              {wallets.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-stone-400">
                  Nenhuma carteira cadastrada.{' '}
                  <Link to="/wallets" className="text-amber-400 font-bold hover:underline">
                    Cadastrar agora
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wallets.map((w) => {
                    const isSelected = activeWalletId === w.id
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          setSelectedWalletId(w.id)
                          setSelectedNetwork(w.network)
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10'
                            : 'border-border bg-surface-elevated hover:border-stone-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white truncate max-w-[130px]">{w.label}</span>
                          {w.isPrimary && (
                            <Badge variant="outline" className="text-[10px] py-0 border-amber-500/40 text-amber-400">
                              Principal
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-stone-400 truncate">{w.address}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-amber-400 font-mono font-bold">{w.balanceEth} ETH</span>
                          <span className="text-stone-500">{w.network}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Simulated Wallet Connection Status & Controls */}
            {activeWallet && (
              <div className="rounded-xl border border-border/80 bg-surface-elevated p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Status de Conexão:</span>
                  {walletStatus === 'connected' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Conectado (Pronto)
                    </span>
                  )}
                  {walletStatus === 'connecting' && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Conectando...
                    </span>
                  )}
                  {walletStatus === 'disconnected' && (
                    <span className="text-stone-400 font-bold flex items-center gap-1">
                      Desconectado
                    </span>
                  )}
                  {walletStatus === 'rejected' && (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Conexão Recusada
                    </span>
                  )}
                </div>

                {/* Simulation trigger buttons as required by README Section 3 */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50 text-[11px]">
                  <span className="text-stone-400 self-center">Simular:</span>
                  <button
                    type="button"
                    onClick={handleSimulateConnect}
                    className="px-2 py-1 rounded bg-surface border border-border text-emerald-400 hover:bg-emerald-500/10"
                  >
                    Conectar
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateDisconnect}
                    className="px-2 py-1 rounded bg-surface border border-border text-stone-300 hover:bg-stone-700"
                  >
                    Desconectar
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateReject}
                    className="px-2 py-1 rounded bg-surface border border-border text-red-400 hover:bg-red-500/10"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            )}

            {/* Network Selector */}
            <div className="space-y-2">
              <label htmlFor="network-select" className="text-xs font-semibold text-stone-300 block">
                Rede Blockchain de Destino
              </label>
              <select
                id="network-select"
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value as BlockchainNetwork)}
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Ethereum">Ethereum Mainnet (Padrão)</option>
                <option value="Polygon">Polygon PoS Network</option>
                <option value="Arbitrum">Arbitrum One Layer 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-white text-base">Revisão do Pedido</h3>
            <span className="text-[10px] font-mono text-stone-400">
              Idemp: {idempotencyKey.slice(0, 16)}...
            </span>
          </div>

          {/* Mini items list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.nft.image}
                    alt={item.nft.name}
                    className="h-10 w-10 rounded-lg object-cover bg-stone-900 border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{item.nft.name}</p>
                    <p className="text-[11px] text-stone-400 font-mono">
                      {item.quantity}x {item.edition.name}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-white shrink-0">
                  {formatEth(item.unitPriceEth)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs text-stone-300 pt-3 border-t border-border">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white font-semibold">{formatEth(quote?.subtotalEth)}</span>
            </div>
            {quote?.discountEth && quote.discountEth !== '0.000000' && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Desconto ({couponCode})</span>
                <span className="font-mono">-{formatEth(quote.discountEth)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Taxa de Gás da Rede</span>
              <span className="font-mono">{formatEth(quote?.networkFeeEth)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-border">
              <span>Total Final</span>
              <span className="text-amber-400 font-mono text-xl">{formatEth(quote?.totalEth)}</span>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms-check"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border bg-surface-elevated text-amber-500 focus:ring-primary focus:ring-offset-0"
            />
            <label htmlFor="terms-check" className="text-xs text-stone-400 cursor-pointer select-none">
              Confirmo a aquisição dos colecionáveis e concordo com os termos de transferência na rede blockchain.
            </label>
          </div>

          {validationError && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            variant="default"
            size="lg"
            onClick={handleConfirmOrder}
            isLoading={isCreatingOrder}
            disabled={walletStatus !== 'connected'}
            className="w-full font-extrabold text-sm gap-2 shadow-amber-500/25"
          >
            <span>Confirmar e Finalizar Compra</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-[11px] text-stone-500 text-center">
            Protegido contra cliques repetidos via idempotência RFC-7231
          </p>
        </div>
      </div>
    </div>
  )
}
