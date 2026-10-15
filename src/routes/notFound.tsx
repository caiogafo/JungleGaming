import { Link } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Compass, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 font-mono text-xs text-[#9E968F] bg-[#140E0C]">
      <div className="max-w-md w-full bg-[#18110E] border border-[#2D201A] rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-[#D98A53]/10 border border-[#D98A53]/30 flex items-center justify-center text-[#D98A53] mx-auto shadow-lg shadow-[#D98A53]/10">
          <Compass className="h-8 w-8 animate-pulse" />
        </div>
        <span className="text-[11px] font-mono font-bold text-[#D98A53] uppercase tracking-widest block">
          Erro 404 — Página Não Encontrada
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3EFEA]">
          Você se perdeu na Kurio?
        </h1>
        <p className="text-xs text-[#7A6C63] leading-relaxed">
          A rota solicitada não existe ou foi movida. Explore nossa galeria de colecionáveis no catálogo principal.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-[#D98A53] hover:bg-[#E59864] text-[#140E0C] font-mono font-bold text-xs uppercase px-8 py-3 rounded-lg transition-colors gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retornar ao Catálogo</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
