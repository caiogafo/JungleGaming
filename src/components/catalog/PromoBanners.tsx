import React from 'react'

export function PromoBanners() {
  return (
    <section className="py-6 sm:py-8" aria-label="Banners Promocionais">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Esquerdo: Lançamentos gênesis */}
        <div className="group relative flex flex-col sm:flex-row items-center p-3.5 sm:p-4 rounded-2xl bg-[#291C19] border border-[#37271c] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Linha decorativa curva âmbar conforme Figma */}
          <svg
            className="absolute bottom-2 left-2 w-28 h-28 pointer-events-none z-20 overflow-visible"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 5 95 C 18 70 38 48 65 30"
              stroke="#D98A53"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Imagem do Macaco em card quadrado arredondado com borda sutil */}
          <div className="w-full sm:w-44 md:w-48 lg:w-52 aspect-square shrink-0 rounded-2xl overflow-hidden bg-[#241F1B] relative">
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Macaco com jaqueta varsity verde e óculos escuros"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Conteúdo textual e botão com espaçamento proporcional e compacto ao Figma */}
          <div className="flex-1 pl-4 sm:pl-5 pr-2 py-3 flex flex-col justify-center space-y-2.5 sm:space-y-3">
            <div className="space-y-1.5">
              <h3 className="font-mono text-sm sm:text-base font-bold text-[#F3EFEA] leading-snug">
                Lançamentos gênesis<br className="hidden sm:inline" /> de edição limitada
              </h3>
              <p className="font-mono text-[11px] sm:text-xs text-[#9E968F] leading-relaxed">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
            </div>

            <div className="pt-1">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-[#151312] font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm"
              >
                <span>Explorar</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Banner Direito: Arte digital selecionada */}
        <div className="group relative flex flex-col sm:flex-row items-center p-3.5 sm:p-4 rounded-2xl bg-[#291C19] border border-[#37271c] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Linha decorativa curva âmbar conforme Figma */}
          <svg
            className="absolute bottom-2 left-2 w-28 h-28 pointer-events-none z-20 overflow-visible"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 5 95 C 18 70 38 48 65 30"
              stroke="#D98A53"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Imagem do Macaco em card quadrado arredondado com borda sutil */}
          <div className="w-full sm:w-44 md:w-48 lg:w-52 aspect-square shrink-0 rounded-2xl overflow-hidden bg-[#241F1B] relative">
            <img
              src="/assets/nfts/black_chimpanzee_suit.jpg"
              alt="Macaco chimpanzé preto com fato marfim"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Conteúdo textual e botão com espaçamento proporcional e compacto ao Figma */}
          <div className="flex-1 pl-4 sm:pl-5 pr-2 py-3 flex flex-col justify-center space-y-2.5 sm:space-y-3">
            <div className="space-y-1.5">
              <h3 className="font-mono text-sm sm:text-base font-bold text-[#F3EFEA] leading-snug">
                Arte digital selecionada<br className="hidden sm:inline" /> e muito mais
              </h3>
              <p className="font-mono text-[11px] sm:text-xs text-[#9E968F] leading-relaxed">
                Explore novos artistas, coleções verificadas e obras digitais que definem a cultura contemporânea.
              </p>
            </div>

            <div className="pt-1">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-[#151312] font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm"
              >
                <span>Explorar</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
