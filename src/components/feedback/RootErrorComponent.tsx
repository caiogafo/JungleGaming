import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertCircle, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface RootErrorProps {
  error: unknown
  reset?: () => void
}

export function RootErrorComponent({ error, reset }: RootErrorProps) {
  const [showDetails, setShowDetails] = useState(false)
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Erro inesperado na aplicação'

  const handleRetry = () => {
    if (typeof reset === 'function') {
      reset()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 font-mono text-xs text-[#9E968F] bg-[#140E0C]">
      <div className="max-w-lg w-full bg-[#18110E] border border-[#2D201A] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
        {/* Icon */}
        <div className="h-16 w-16 rounded-2xl bg-[#D98A53]/10 border border-[#D98A53]/30 flex items-center justify-center text-[#D98A53] mx-auto shadow-lg shadow-[#D98A53]/10">
          <AlertCircle className="h-8 w-8" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-[#D98A53] uppercase tracking-widest block">
            Instabilidade Temporária
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3EFEA]">
            Não foi possível carregar esta seção
          </h1>
          <p className="text-xs text-[#7A6C63] leading-relaxed pt-1">
            Houve uma falha momentânea na sincronização de dados ou na camada de mock. Tente recarregar a visualização.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D98A53] hover:bg-[#E59864] text-[#140E0C] font-mono font-bold text-xs uppercase px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Tentar novamente</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#241C19] hover:bg-[#2F2420] text-[#F3EFEA] border border-[#37271c] font-mono font-bold text-xs uppercase px-6 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Catálogo</span>
          </Link>
        </div>

        {/* Technical Details Accordion */}
        <div className="pt-2 border-t border-[#2D201A]">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#7A6C63] hover:text-[#9E968F] transition-colors"
          >
            <span>{showDetails ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 rounded-lg bg-[#120C0A] border border-[#2D201A] text-left overflow-x-auto text-[11px] text-[#C48247] font-mono">
              <pre className="whitespace-pre-wrap break-all">{errorMessage}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
