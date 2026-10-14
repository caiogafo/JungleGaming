import { Link } from '@tanstack/react-router'
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-[#18140F] via-[#120F0B] to-[#0D0B08] p-6 sm:p-10 lg:p-14 shadow-2xl mb-12">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 h-64 w-64 rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline and Call-to-action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>Coleção Oficial Jungle Gaming Season 1</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
            SEJA DONO DO FUTURO DA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">ARTE DIGITAL.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
            Descubra, colecione e negocie NFTs exclusivos e personagens do ecossistema Jungle.
            Arquitetura resiliente, contratos seguros e sincronização de preço em tempo real.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#catalogo">
              <Button size="lg" className="font-extrabold text-base gap-2 px-8 shadow-amber-500/30">
                <span>Explorar Catálogo</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <Link to="/nft/$id" params={{ id: 'nft_1' }}>
              <Button variant="outline" size="lg" className="border-border hover:border-amber-500/50 text-stone-200">
                Ver Destaque da Semana
              </Button>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60 max-w-lg">
            <div>
              <p className="text-2xl font-extrabold text-white">12+</p>
              <p className="text-xs text-stone-400">Artes Raras</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-400">0.35 ETH</p>
              <p className="text-xs text-stone-400">Preço Mínimo</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">100%</p>
              <p className="text-xs text-stone-400">Idempotente</p>
            </div>
          </div>
        </div>

        {/* Right Column: Featured NFT Spotlight Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-md">
            {/* Ambient card aura */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

            <div className="relative rounded-2xl border border-border bg-surface p-4 shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-900">
                <img
                  src="/assets/nfts/emerald_ape_hero.jpg"
                  alt="Emerald Varsity Ape #042"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="rarityLegendary">★ Lendário</Badge>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-amber-500/30">
                  Edição Limitada 1/50
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    Emerald Varsity Ape #042
                  </h3>
                  <p className="text-xs text-stone-400">Jungle Ape Yacht Club</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Preço Base</p>
                  <p className="text-base font-extrabold text-amber-400 font-mono">0.8500 ETH</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-4 w-4" /> Verificado na Blockchain
                </span>
                <Link to="/nft/$id" params={{ id: 'nft_1' }}>
                  <Button size="sm" variant="default" className="text-xs font-bold">
                    Comprar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
