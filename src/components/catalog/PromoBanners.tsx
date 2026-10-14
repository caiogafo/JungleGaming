import React from 'react'

export function PromoBanners() {
  return (
    <section className="py-12" aria-label="Banners Promocionais">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Esquerdo: Ape casaco verde */}
        <div className="group relative flex items-center gap-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1C1A17] to-[#151312] p-6 sm:p-8 transition-all duration-300 hover:border-[#D98A53]/30 shadow-lg">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-[#ECE5DC] p-1 shadow-md transition-transform duration-500 group-hover:scale-105">
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Ape de casaco verde"
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-mono text-sm sm:text-base font-bold text-[#F3EFEA]">
              Lançamentos gênesis de edição limitada
            </h3>
            <p className="font-mono text-xs text-[#9E968F] leading-relaxed line-clamp-2">
              Acesse drops exclusivos antes de chegarem ao mercado público com benefícios de governança.
            </p>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#D98A53] hover:text-[#e8a374] pt-1 transition-colors group-hover:translate-x-1 duration-200"
            >
              <span>Explorar</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* Banner Direito: Ape de fato branco */}
        <div className="group relative flex items-center gap-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1C1A17] to-[#151312] p-6 sm:p-8 transition-all duration-300 hover:border-[#D98A53]/30 shadow-lg">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-[#ECE5DC] p-1 shadow-md transition-transform duration-500 group-hover:scale-105">
            <img
              src="/assets/nfts/black_chimpanzee_suit.jpg"
              alt="Ape de fato branco"
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-mono text-sm sm:text-base font-bold text-[#F3EFEA]">
              Arte digital selecionada e muito mais
            </h3>
            <p className="font-mono text-xs text-[#9E968F] leading-relaxed line-clamp-2">
              Curadoria rigorosa das obras mais influentes criadas por artistas contemporâneos consagrados.
            </p>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#D98A53] hover:text-[#e8a374] pt-1 transition-colors group-hover:translate-x-1 duration-200"
            >
              <span>Explorar</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
