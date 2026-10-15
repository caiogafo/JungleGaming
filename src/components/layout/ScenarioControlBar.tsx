import { useState } from 'react'
import { mockDb } from '../../mocks/db'
import { nftsApi } from '../../api/nfts.api'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Settings, RefreshCw, Zap, WifiOff, AlertOctagon, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

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
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch {}
    mockDb.reset()
    window.location.reload()
  }

  const handleLoadDemoCart = () => {
    mockDb.loadDemoCart()
    window.location.reload()
  }

  return (
    <div className="bg-[#19120F] border-b border-[#37271c] text-xs text-[#9E968F] font-mono z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Badge
            variant="outline"
            className="border-[#D98A53]/50 text-[#D98A53] font-mono py-0.5 px-2 text-[10px] whitespace-nowrap shrink-0 inline-flex items-center"
          >
            <span className="hidden sm:inline">MSW + Socket.IO Mock Layer</span>
            <span className="sm:hidden">MSW + Socket.IO</span>
          </Badge>
          <span className="hidden md:inline text-[#7A6C63] text-[11px] whitespace-nowrap">
            Painel de Cenários de Avaliação
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 px-2 text-[11px] font-mono text-[#D98A53] hover:text-[#E59864] hover:bg-[#2A1D18] gap-1 shrink-0 whitespace-nowrap"
          >
            <Settings className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">Cenários de Teste</span>
            <span className="sm:hidden">Cenários</span>
            {isOpen ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleResetDb}
            className="h-6 px-2 text-[10px] font-mono bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 gap-1 shrink-0 whitespace-nowrap"
            title="Restaura todos os mocks para os dados originais"
          >
            <RefreshCw className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">Resetar Mocks</span>
            <span className="sm:hidden">Resetar</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[#37271c] bg-[#160E0B] p-4 transition-all font-mono">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Latency control */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#F3EFEA] block text-xs">
                Latência de Rede (ms)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 150, 1200, 2500].map((ms) => (
                  <button
                    key={ms}
                    onClick={() => handleLatencyChange(ms)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                      latency === ms
                        ? 'bg-[#D98A53] text-[#140E0C] font-bold'
                        : 'bg-[#1F1613] border border-[#37271c] text-[#9E968F] hover:bg-[#2A1D18] hover:text-[#F3EFEA]'
                    }`}
                  >
                    {ms}ms
                  </button>
                ))}
              </div>
            </div>

            {/* Error simulation toggles */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#F3EFEA] block text-xs">
                Simulação de Falhas HTTP
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={toggle500}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    is500
                      ? 'bg-red-700 text-white font-bold'
                      : 'bg-[#1F1613] border border-[#37271c] text-[#9E968F] hover:bg-[#2A1D18] hover:text-[#F3EFEA]'
                  }`}
                >
                  <AlertOctagon className="h-3 w-3" />
                  Erro 500 API
                </button>
                <button
                  onClick={toggleTimeout}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    isTimeout
                      ? 'bg-[#D98A53] text-[#140E0C] font-bold'
                      : 'bg-[#1F1613] border border-[#37271c] text-[#9E968F] hover:bg-[#2A1D18] hover:text-[#F3EFEA]'
                  }`}
                >
                  <WifiOff className="h-3 w-3" />
                  Timeout Pedido
                </button>
              </div>
            </div>

            {/* Payment rejection simulation */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#F3EFEA] block text-xs">
                Fluxo de Pagamento
              </label>
              <button
                onClick={toggleReject}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  isReject
                    ? 'bg-red-700 text-white font-bold'
                    : 'bg-[#1F1613] border border-[#37271c] text-[#9E968F] hover:bg-[#2A1D18] hover:text-[#F3EFEA]'
                }`}
              >
                Simular Pagamento Recusado
              </button>
            </div>

            {/* Realtime Socket.IO trigger */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#F3EFEA] block text-xs">
                Tempo Real (Socket.IO Event)
              </label>
              <Button
                size="sm"
                variant="default"
                onClick={handleSimulateRealtimePriceChange}
                isLoading={isTriggering}
                className="h-7 text-xs w-full gap-1.5 font-bold bg-[#D98A53] hover:bg-[#E59864] text-[#140E0C] font-mono"
              >
                <Zap className="h-3 w-3 fill-current" />
                Disparar Alteração de Preço
              </Button>
            </div>

            {/* Carregar Carrinho Figma */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#F3EFEA] block text-xs">
                Massa de Testes (Figma)
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLoadDemoCart}
                className="h-7 text-xs w-full gap-1.5 font-bold border-[#37271c] bg-[#1F1613] text-[#D98A53] hover:bg-[#2A1D18] hover:text-[#E59864] font-mono"
              >
                <ShoppingBag className="h-3 w-3" />
                Carregar Carrinho Figma
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
