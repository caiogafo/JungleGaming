import React from 'react'

export function PromoBanners() {
  return (
    <section className="py-6 sm:py-8" aria-label="Banners Promocionais">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Esquerdo: Lançamentos gênesis */}
        <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-[#291C19] border border-[#37271c] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Imagem preenchendo 50% da lateral esquerda */}
          <div className="w-full sm:w-1/2 aspect-square sm:aspect-auto shrink-0 relative overflow-hidden bg-[#241F1B]">
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Macaco com jaqueta varsity verde e óculos escuros"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Linhas decorativas curvas âmbar no canto inferior esquerdo conforme Figma */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              {/* Linha externa */}
              <path
                d="M 0 62.6 C 11.5 68, 21.5 84, 24.7 100"
                stroke="#D98A53"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeOpacity="0.95"
                fill="none"
              />
              {/* Linha interna paralela (de baixo, mais fina conforme solicitado) */}
              <path
                d="M 0 64 C 9.8 70, 19.2 85.5, 22.1 100"
                stroke="#D98A53"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeOpacity="0.85"
                fill="none"
              />
            </svg>
          </div>

          {/* Conteúdo textual e botão: alinhados à DIREITA (text-right) conforme Figma */}
          <div className="w-full sm:w-1/2 p-5 sm:p-6 flex flex-col justify-center text-right items-end space-y-3">
            <div className="space-y-1.5 w-full">
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
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-[#151312] font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm active:scale-95"
              >
                <span>Explorar</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Banner Direito: Arte digital selecionada */}
        <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-[#291C19] border border-[#37271c] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Imagem preenchendo 50% da lateral esquerda */}
          <div className="w-full sm:w-1/2 aspect-square sm:aspect-auto shrink-0 relative overflow-hidden bg-[#241F1B]">
            <img
              src="/assets/nfts/black_chimpanzee_suit.jpg"
              alt="Macaco chimpanzé preto com fato marfim"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Linhas decorativas curvas âmbar no canto inferior esquerdo conforme Figma */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              {/* Linha externa */}
              <path
                d="M 0 62.6 C 11.5 68, 21.5 84, 24.7 100"
                stroke="#D98A53"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeOpacity="0.95"
                fill="none"
              />
              {/* Linha interna paralela (de baixo, mais fina conforme solicitado) */}
              <path
                d="M 0 64 C 9.8 70, 19.2 85.5, 22.1 100"
                stroke="#D98A53"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeOpacity="0.85"
                fill="none"
              />
            </svg>
          </div>

          {/* Conteúdo textual e botão: alinhados à DIREITA (text-right) conforme Figma */}
          <div className="w-full sm:w-1/2 p-5 sm:p-6 flex flex-col justify-center text-right items-end space-y-3">
            <div className="space-y-1.5 w-full">
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
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-[#151312] font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm active:scale-95"
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
