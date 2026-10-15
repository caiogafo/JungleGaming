import { useState } from 'react'
import { mockDb } from '../../mocks/db'
import { nftsApi } from '../../api/nfts.api'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Settings, RefreshCw, Zap, WifiOff, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react'

export function ScenarioControlBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [latency, setLatency] = useState(mockDb.get().scenarios.latencyMs)
  const [is500, setIs500] = useState(mockDb.get().scenarios.simulate500)
  const [isTimeout, setIsTimeout] = useState(mockDb.get().scenarios.simulateTimeoutOnOrder)
  const [isReject, setIsReject] = useState(mockDb.get().scenarios.simulateRejectOrder)
  const [isTriggering, setIsTriggering] = useState(false)

  const handleLatencyChange = (val: number) => {
    setLatency(val)
    mockDb.update((d) => {
      d.scenarios.latencyMs = val
    })
  }

  const toggle500 = () => {
    const next = !is500
    setIs500(next)
    mockDb.update((d) => {
      d.scenarios.simulate500 = next
    })
  }

  const toggleTimeout = () => {
    const next = !isTimeout
    setIsTimeout(next)
    mockDb.update((d) => {
      d.scenarios.simulateTimeoutOnOrder = next
    })
  }

  const toggleReject = () => {
    const next = !isReject
    setIsReject(next)
    mockDb.update((d) => {
      d.scenarios.simulateRejectOrder = next
    })
  }

  const handleSimulateRealtimePriceChange = async () => {
    setIsTriggering(true)
    try {
      // Toggle between a noticeably higher price (1.75 ETH) and the base (1.19 ETH)
      const current = parseFloat(mockDb.get().nfts.find((n) => n.id === 'nft_1')?.basePriceEth || '1.19')
      const newPrice = (current >= 1.5 ? 1.19 : 1.75).toFixed(6)
      await nftsApi.simulatePriceUpdate('nft_1', newPrice)
    } finally {
      setIsTriggering(false)
    }
  }

  const handleResetDb = () => {
    mockDb.reset()
    window.location.reload()
  }

  return (
    <div className="bg-surface-elevated/95 border-b border-border text-xs text-stone-300">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono py-0 text-[10px]">
            MSW + Socket.IO Mock Layer
          </Badge>
          <span className="hidden sm:inline text-stone-400">
            Painel de Cenários de Avaliação
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 px-2 text-xs text-amber-400 hover:text-amber-300 gap-1"
          >
            <Settings className="h-3 w-3" />
            <span>Cenários de Teste</span>
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleResetDb}
            className="h-6 px-2 text-[10px] gap-1"
            title="Restaura todos os mocks para os dados originais"
          >
            <RefreshCw className="h-3 w-3" />
            Resetar Mocks
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border/60 bg-black/50 p-4 transition-all">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Latency control */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-200 block">
                Latência de Rede (ms)
              </label>
              <div className="flex gap-1.5">
                {[0, 150, 1200, 2500].map((ms) => (
                  <button
                    key={ms}
                    onClick={() => handleLatencyChange(ms)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                      latency === ms
                        ? 'bg-primary text-black font-bold'
                        : 'bg-surface border border-border hover:bg-surface-hover'
                    }`}
                  >
                    {ms}ms
                  </button>
                ))}
              </div>
            </div>

            {/* Error simulation toggles */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-200 block">
                Simulação de Falhas HTTP
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={toggle500}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    is500
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-surface border border-border hover:bg-surface-hover'
                  }`}
                >
                  <AlertOctagon className="h-3 w-3" />
                  Erro 500 API
                </button>
                <button
                  onClick={toggleTimeout}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    isTimeout
                      ? 'bg-amber-600 text-black font-bold'
                      : 'bg-surface border border-border hover:bg-surface-hover'
                  }`}
                >
                  <WifiOff className="h-3 w-3" />
                  Timeout Pedido
                </button>
              </div>
            </div>

            {/* Payment rejection simulation */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-200 block">
                Fluxo de Pagamento
              </label>
              <button
                onClick={toggleReject}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  isReject
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-surface border border-border hover:bg-surface-hover'
                }`}
              >
                Simular Pagamento Recusado
              </button>
            </div>

            {/* Realtime Socket.IO trigger */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-200 block">
                Tempo Real (Socket.IO Event)
              </label>
              <Button
                size="sm"
                variant="default"
                onClick={handleSimulateRealtimePriceChange}
                isLoading={isTriggering}
                className="h-7 text-xs w-full gap-1.5 font-bold"
              >
                <Zap className="h-3 w-3 fill-current" />
                Disparar Alteração de Preço
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
