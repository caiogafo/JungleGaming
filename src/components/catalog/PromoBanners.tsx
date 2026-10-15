import React from 'react'

export function PromoBanners() {
  return (
    <section className="py-8" aria-label="Banners Promocionais">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Esquerdo: Lançamentos gênesis */}
        <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-[#291C19] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Imagem preenchendo a lateral esquerda */}
          <div className="w-full sm:w-[42%] aspect-square sm:aspect-auto shrink-0 relative overflow-hidden bg-[#241F1B]">
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Macaco com jaqueta varsity verde e óculos escuros"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Conteúdo textual e botão na lateral direita */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#F3EFEA] leading-snug">
                Lançamentos gênesis<br className="hidden sm:inline" /> de edição limitada
              </h3>
              <p className="font-mono text-xs text-[#9E968F] leading-relaxed">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
            </div>

            <div>
              <a
                href="#catalogo"
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-black font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm"
              >
                <span>Explorar</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Banner Direito: Arte digital selecionada */}
        <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-[#291C19] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Imagem preenchendo a lateral esquerda */}
          <div className="w-full sm:w-[42%] aspect-square sm:aspect-auto shrink-0 relative overflow-hidden bg-[#241F1B]">
            <img
              src="/assets/nfts/black_chimpanzee_suit.jpg"
              alt="Macaco chimpanzé preto com fato marfim"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Conteúdo textual e botão na lateral direita */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#F3EFEA] leading-snug">
                Arte digital selecionada<br className="hidden sm:inline" /> e muito mais
              </h3>
              <p className="font-mono text-xs text-[#9E968F] leading-relaxed">
                Explore novos artistas, coleções verificadas e obras digitais que definem a cultura contemporânea.
              </p>
            </div>

            <div>
              <a
                href="#catalogo"
                className="inline-flex items-center gap-1.5 bg-[#D98A53] hover:bg-[#c67945] text-black font-mono font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm"
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
