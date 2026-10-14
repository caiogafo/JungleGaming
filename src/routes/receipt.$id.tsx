import { useState } from 'react'
import { createRoute, Link, useParams } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useOrderDetail } from '../hooks/useOrders'
import { formatEth } from '../lib/eth'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'

export const receiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipt/$id',
  component: ReceiptPage,
})

function ReceiptPage() {
  const { id } = useParams({ from: '/receipt/$id' })
  const { data: order, isLoading, isError } = useOrderDetail(id)
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-stone-400">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm">Carregando recibo da transação...</p>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Pedido Não Encontrado</h2>
        <p className="text-xs text-stone-400 mb-6">
          Não foi possível localizar o recibo para o identificador #{id}.
        </p>
        <Link to="/">
          <Button variant="default">Voltar ao Início</Button>
        </Link>
      </div>
    )
  }

  const handleCopyHash = () => {
    if (order.transactionHash) {
      navigator.clipboard.writeText(order.transactionHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <Badge variant="success" className="font-bold text-xs uppercase tracking-wide">
            Transação Confirmada
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Os NFTs foram transferidos com segurança para sua carteira Web3. Um snapshot imutável foi registrado.
          </p>
        </div>

        {/* Transaction Metadata Card */}
        <div className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-stone-400">Identificador do Pedido</span>
            <span className="font-mono font-bold text-white">#{order.id}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-stone-400">Rede Blockchain</span>
            <span className="text-amber-400 font-bold">{order.network}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-stone-400">Carteira de Destino</span>
            <span className="font-mono text-stone-300 truncate max-w-[220px]">
              {order.walletAddress}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Hash da Transação (TX)</span>
              <button
                onClick={handleCopyHash}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copiado!' : 'Copiar Hash'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-stone-300 break-all bg-black/40 p-2 rounded-lg border border-border/40">
              {order.transactionHash || '0xSimulatedPendingTxHash...'}
            </p>
          </div>
        </div>

        {/* Purchased Items Snapshot */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Itens Adquiridos ({order.items.length})
          </h3>
          <div className="divide-y divide-border/60 rounded-xl border border-border bg-surface-elevated/40 overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.nftImage}
                    alt={item.nftName}
                    className="h-12 w-12 rounded-lg object-cover bg-stone-900 border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{item.nftName}</p>
                    <p className="text-[11px] text-amber-400">{item.editionName}</p>
                    <p className="text-[11px] text-stone-400 font-mono">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white">{formatEth(item.subtotalEth)}</p>
                  <p className="text-[10px] text-stone-500 font-mono">
                    ({formatEth(item.unitPriceEth)} un.)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-border">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-white">{formatEth(order.subtotalEth)}</span>
          </div>
          {order.discountEth && order.discountEth !== '0.000000' && (
            <div className="flex justify-between text-emerald-400">
              <span>Desconto Cupom ({order.couponCode})</span>
              <span className="font-mono">-{formatEth(order.discountEth)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-400">
            <span>Taxa de Rede (Gas)</span>
            <span className="font-mono">{formatEth(order.networkFeeEth)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-border">
            <span>Total Pago</span>
            <span className="text-amber-400 font-mono text-xl">{formatEth(order.totalEth)}</span>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-2">
          <Link to="/" className="w-full inline-flex">
            <Button variant="default" size="lg" className="w-full font-bold text-sm gap-2 shadow-amber-500/20">
              <span>Explorar Mais Colecionáveis</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
