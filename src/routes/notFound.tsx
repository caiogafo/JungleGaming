import { Link } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Compass, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-xl shadow-amber-500/10">
        <Compass className="h-10 w-10 animate-pulseSlow" />
      </div>
      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">
        Erro 404 — Página Não Encontrada
      </span>
      <h1 className="text-3xl font-extrabold text-white mb-3">
        Você se perdeu na Jungle?
      </h1>
      <p className="text-xs text-stone-400 leading-relaxed mb-8">
        A rota solicitada não existe ou foi movida. Explore nossa galeria de colecionáveis no catálogo principal.
      </p>
      <Link to="/">
        <Button variant="default" size="lg" className="font-bold text-sm gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Retornar ao Catálogo</span>
        </Button>
      </Link>
    </div>
  )
}
