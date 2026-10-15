import { useState, useEffect } from 'react'
import { createRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { rootRoute } from './__root'
import { useOrderDetail } from '../hooks/useOrders'
import { formatEth } from '../lib/eth'
import { realtimeSocket } from '../socket/socketClient'
import { X, ExternalLink, Check, Copy, AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react'

export const receiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipt/$id',
  component: ReceiptPage,
})

function formatOrderDate(dateStr?: string): string {
  if (!dateStr) return '29 Jul, 2026'
  try {
    const d = new Date(dateStr)
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month}, ${year}`
  } catch {
    return '29 Jul, 2026'
  }
}

function formatShortTxHash(hash?: string): string {
  if (!hash) return '0xA91F...E82C'
  if (hash.includes('...')) return hash
  if (hash.length <= 14) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4).toUpperCase()}`
}

function ThankYouEnvelopeIcon({ className = 'h-16 w-16' }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[#D98A53] mx-auto`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Back flap */}
      <path d="M12 28L32 12L52 28" />
      {/* Letter sheet */}
      <rect x="18" y="10" width="28" height="26" rx="2" fill="#201713" stroke="currentColor" strokeWidth="2" />
      {/* THANK YOU text */}
      <text
        x="32"
        y="21"
        textAnchor="middle"
        fill="#D98A53"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
        letterSpacing="0.5"
      >
        THANK
      </text>
      <text
        x="32"
        y="29"
        textAnchor="middle"
        fill="#D98A53"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
        letterSpacing="0.5"
      >
        YOU
      </text>
      {/* Envelope body */}
      <path d="M12 26V52H52V26" />
      {/* Front V fold */}
      <path d="M12 26L32 40L52 26" />
      {/* Diagonal folds */}
      <path d="M12 52L26 36" />
      <path d="M52 52L38 36" />
    </svg>
  )
}

function PendingClockIcon({ className = 'h-16 w-16' }: { className?: string }) {
  return (
    <div className="relative mx-auto flex items-center justify-center h-16 w-16">
      <div className="absolute inset-0 rounded-full border-2 border-[#D98A53]/20 border-t-[#D98A53] animate-spin" />
      <svg
        className={`${className} text-[#D98A53] p-3.5`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  )
}

function RejectedAlertIcon({ className = 'h-16 w-16' }: { className?: string }) {
  return (
    <div className="relative mx-auto flex items-center justify-center h-16 w-16">
      <svg
        className={`${className} text-[#E5484D] mx-auto`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
  )
}

function ReceiptPage() {
  const { id } = useParams({ from: '/receipt/$id' })
  const { data: order, isLoading, isError } = useOrderDetail(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [copiedHash, setCopiedHash] = useState(false)
  const [showExplorerModal, setShowExplorerModal] = useState(false)

  // Socket.IO real-time listener for order.updated
  useEffect(() => {
    const unsubscribe = realtimeSocket.subscribeOrderUpdated((event) => {
      if (event.orderId === id) {
        queryClient.setQueryData(['order', id], (prev: any) => {
          if (!prev) return prev
          return {
            ...prev,
            status: event.status,
            transactionHash: event.transactionHash || prev.transactionHash,
            errorMessage: event.errorMessage || prev.errorMessage,
            confirmedAt: event.status === 'confirmed' ? new Date().toISOString() : prev.confirmedAt,
          }
        })
        queryClient.invalidateQueries({ queryKey: ['order', id] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
    return () => unsubscribe()
  }, [id, queryClient])

  // Polling & auto-transition fallback while status is pending (takes 2-3s)
  useEffect(() => {
    if (order?.status === 'pending') {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['order', id] })
      }, 800)

      const timer = setTimeout(() => {
        queryClient.setQueryData(['order', id], (prev: any) => {
          if (!prev || prev.status !== 'pending') return prev
          return {
            ...prev,
            status: 'confirmed',
            transactionHash:
              prev.transactionHash && !prev.transactionHash.includes('...')
                ? prev.transactionHash
                : '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            confirmedAt: new Date().toISOString(),
          }
        })
        queryClient.invalidateQueries({ queryKey: ['order', id] })
      }, 2600)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [order?.status, id, queryClient])

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-[#9E968F]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-2 border-[#D98A53]/30 border-t-[#D98A53] rounded-full animate-spin mx-auto" />
          <p>Carregando dados da transação...</p>
        </div>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-[#9E968F] px-4">
        <div className="max-w-md w-full bg-[#201713] border border-[#37271c] rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-[#F3EFEA]">Pedido Não Encontrado</h2>
          <p className="text-[#9E968F]">Não foi possível localizar o recibo para a transação #{id}.</p>
          <div className="pt-2">
            <Link
              to="/mercado"
              className="inline-flex bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-bold text-xs uppercase px-6 py-2.5 rounded-md transition-colors"
            >
              Voltar ao Mercado
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isPending = order.status === 'pending'
  const isRejected = order.status === 'rejected'
  const isConfirmed = order.status === 'confirmed'

  const handleCopyHash = () => {
    if (order.transactionHash) {
      navigator.clipboard.writeText(order.transactionHash)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#140E0C] font-mono text-xs text-[#9E968F] flex flex-col justify-between">
      {/* Mobile Top Bar (<= 768px) */}
      <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2D201A] bg-[#140E0C] sticky top-0 z-30">
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          className="h-9 w-9 rounded-full bg-[#18110E] border border-[#2D201A] flex items-center justify-center text-[#F3EFEA] hover:text-[#D98A53] hover:border-[#D98A53]/50 transition-colors cursor-pointer"
          aria-label="Voltar ao início"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-bold text-[#F3EFEA] tracking-wide">
          Comprovante de Compra
        </h1>
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          className="h-9 w-9 rounded-full bg-[#18110E] border border-[#2D201A] flex items-center justify-center text-[#9E968F] hover:text-[#F3EFEA] transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Modal / Container */}
        <div className="w-full max-w-[560px] bg-[#18110E] border border-[#2D201A] border-b-4 border-b-[#D98A53] rounded-2xl p-5 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
          {/* Close Button X (desktop only) */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="hidden md:block absolute top-5 right-5 text-[#9E968F] hover:text-[#F3EFEA] transition-colors p-1 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          {/* 1. Top Section (Status Icon + Subtitle) */}
          <div className="text-center space-y-2 pt-1">
            {isPending && (
              <>
                <PendingClockIcon />
                <p className="text-xs sm:text-sm font-medium text-[#D98A53]">
                  Processando transação na rede...
                </p>
              </>
            )}

            {isConfirmed && (
              <>
                <ThankYouEnvelopeIcon />
                <p className="text-xs sm:text-sm font-medium text-[#F3EFEA]">
                  Seus NFTs agora estão na sua carteira
                </p>
              </>
            )}

            {isRejected && (
              <>
                <RejectedAlertIcon />
                <p className="text-xs sm:text-sm font-medium text-[#E5484D]">
                  Transação Recusada ou Cancelada
                </p>
              </>
            )}
          </div>

          {/* 2. Metadata Bar: 2x2 grid on mobile, 4 columns on tablet/desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 sm:border-y sm:border-[#2D201A] py-2 sm:py-3 text-left">
            {/* ID da transação */}
            <div className="p-2 sm:p-0 sm:pr-2 sm:border-r sm:border-[#2D201A] bg-[#140E0C] sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-[#2D201A]">
              <span className="block text-[10px] text-[#7A6C63]">ID da transação</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-[#F3EFEA] truncate">
                  {formatShortTxHash(order.transactionHash)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-[#7A6C63] hover:text-[#D98A53] transition-colors shrink-0"
                  title="Copiar hash"
                >
                  {copiedHash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Data */}
            <div className="p-2 sm:p-0 sm:px-2 sm:border-r sm:border-[#2D201A] bg-[#140E0C] sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-[#2D201A]">
              <span className="block text-[10px] text-[#7A6C63]">Data</span>
              <span className="block text-xs font-bold text-[#F3EFEA] mt-0.5">
                {formatOrderDate(order.createdAt)}
              </span>
            </div>

            {/* Total */}
            <div className="p-2 sm:p-0 sm:px-2 sm:border-r sm:border-[#2D201A] bg-[#140E0C] sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-[#2D201A]">
              <span className="block text-[10px] text-[#7A6C63]">Total</span>
              <span className="block text-xs font-bold text-[#D98A53] mt-0.5">
                {formatEth(order.totalEth)}
              </span>
            </div>

            {/* Carteira */}
            <div className="p-2 sm:p-0 sm:pl-2 bg-[#140E0C] sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-[#2D201A]">
              <span className="block text-[10px] text-[#7A6C63]">Carteira</span>
              <span className="block text-xs font-bold text-[#F3EFEA] truncate mt-0.5">
                {order.walletName || 'MetaMask'}
              </span>
            </div>
          </div>

          {/* 3. Detalhes da transação */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-[#F3EFEA]">Detalhes da transação</h3>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-[#7A6C63] pb-1 border-b border-[#2D201A]">
              <span className="col-span-6">NFTs</span>
              <span className="col-span-3 text-center">Edições</span>
              <span className="col-span-3 text-right">Subtotal</span>
            </div>

            {/* Items List */}
            <div className="space-y-3 pt-1">
              {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center text-xs">
                  {/* NFT thumbnail + name + token id */}
                  <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={item.nftImage}
                      alt={item.nftName}
                      className="h-10 w-10 rounded-lg object-cover bg-[#140E0C] border border-[#2D201A] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#F3EFEA] truncate">{item.nftName}</p>
                      <p className="text-[10px] text-[#7A6C63]">ID do token: #{item.tokenId || '0042'}</p>
                    </div>
                  </div>

                  {/* Edições (quantity) */}
                  <div className="col-span-3 text-center text-[#9E968F]">
                    (x {item.quantity})
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-3 text-right font-bold text-[#D98A53]">
                    {formatEth(item.subtotalEth)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Financial Summary (Taxa de rede & Total) */}
          <div className="space-y-1.5 pt-2 border-t border-[#2D201A] text-xs">
            <div className="flex justify-between items-center text-[#9E968F]">
              <span className="text-right flex-1 pr-6">Taxa de rede</span>
              <span className="text-[#F3EFEA] font-medium">{formatEth(order.networkFeeEth)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-right flex-1 pr-6 text-[#F3EFEA] font-bold">Total</span>
              <span className="text-sm font-bold text-[#D98A53]">{formatEth(order.totalEth)}</span>
            </div>
          </div>

          {/* 5. Informative Note */}
          <div className="text-center text-[11px] text-[#9E968F] px-4 leading-relaxed">
            {isPending && (
              <p>
                Aguardando confirmação na rede {order.network || 'Ethereum'}. Seus itens estão reservados enquanto os
                blocos são validados (cerca de 2 a 3 segundos).
              </p>
            )}
            {isConfirmed && (
              <p>
                Transação confirmada na rede {order.network || 'Ethereum'}. A propriedade foi transferida para sua carteira
                conectada e registrada na blockchain.
              </p>
            )}
            {isRejected && (
              <p className="text-[#E5484D]">
                {order.errorMessage ||
                  'Transação recusada pela rede blockchain ou saldo insuficiente. Seus itens continuam salvos no carrinho.'}
              </p>
            )}
          </div>

          {/* 6. Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isConfirmed && (
              <>
                <button
                  type="button"
                  onClick={() => setShowExplorerModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D98A53] hover:bg-[#E59864] text-[#140E0C] font-bold text-xs uppercase px-6 py-3 rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Ver no Etherscan</span>
                </button>
                <Link
                  to="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-[#1F1613] hover:bg-[#2A1D18] border border-[#2D201A] text-[#F3EFEA] font-bold text-xs uppercase px-6 py-3 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Ver no Meu Perfil
                </Link>
              </>
            )}

            {isPending && (
              <div className="inline-flex items-center gap-2 bg-[#291C19] border border-[#3D291F] text-[#D98A53] font-bold text-xs uppercase px-6 py-3 rounded-lg">
                <div className="h-4 w-4 border-2 border-[#D98A53] border-t-transparent rounded-full animate-spin" />
                <span>Aguardando Confirmação...</span>
              </div>
            )}

            {isRejected && (
              <Link
                to="/checkout"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#D98A53] hover:bg-[#E59864] text-[#140E0C] font-bold text-xs uppercase px-8 py-3 rounded-lg transition-colors text-center"
              >
                Tentar Novamente
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Explorer Modal / Dialog */}
      {showExplorerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#201713] border border-[#3D291F] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowExplorerModal(false)}
              className="absolute top-4 right-4 text-[#9E968F] hover:text-[#F3EFEA]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-[#D98A53] font-bold text-sm">
              <ExternalLink className="h-4 w-4" />
              <span>Simulador de Blockchain Explorer ({order.network})</span>
            </div>

            <div className="space-y-2 text-xs text-[#9E968F]">
              <div className="bg-[#1B1512] p-3 rounded-lg border border-[#37271c] space-y-1.5 font-mono text-[11px]">
                <div>
                  <span className="text-[#9E968F]">Status: </span>
                  <span className="text-emerald-400 font-bold">Success (24 Block Confirmations)</span>
                </div>
                <div>
                  <span className="text-[#9E968F]">Tx Hash: </span>
                  <span className="text-[#F3EFEA] break-all">{order.transactionHash}</span>
                </div>
                <div>
                  <span className="text-[#9E968F]">From: </span>
                  <span className="text-[#F3EFEA] break-all">{order.walletAddress}</span>
                </div>
                <div>
                  <span className="text-[#9E968F]">Rede: </span>
                  <span className="text-[#D98A53] font-bold">{order.network}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopyHash}
                className="flex-1 bg-[#1B1512] hover:bg-[#291C19] border border-[#37271c] text-[#F3EFEA] font-bold text-xs py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedHash ? 'Hash Copiado!' : 'Copiar Hash'}</span>
              </button>
              <button
                onClick={() => setShowExplorerModal(false)}
                className="flex-1 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-bold text-xs py-2 rounded-md transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
