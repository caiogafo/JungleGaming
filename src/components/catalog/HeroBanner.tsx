import { Link } from '@tanstack/react-router'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#262B33] bg-[#181615] p-8 sm:p-12 lg:p-14 mb-16 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Esquerda: Conteúdo */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Subtítulo superior */}
            <p className="font-mono text-xs tracking-wider uppercase text-[#9E968F]">
              Bem-vindo à Kurio
            </p>

            {/* Título Principal (H1) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3EFEA] leading-[1.1] font-sans uppercase">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>

            {/* Descrição */}
            <p className="font-mono text-sm sm:text-base text-[#9E968F] max-w-xl leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados em todo o mundo.
              Colecione, negocie e explore obras de arte digitais raras com segurança garantida.
            </p>

            {/* Botão EXPLORAR */}
            <div className="pt-2">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-md transition-colors shadow-md active:scale-95"
              >
                EXPLORAR
              </a>
            </div>
          </div>

          {/* Indicadores na base: Três pequenos pontos laranjas alinhados */}
          <div className="flex items-center gap-2 pt-6">
            <span className="h-2 w-2 rounded-full bg-[#D98A53]" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-[#D98A53]/50" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-[#D98A53]/30" aria-hidden="true" />
          </div>
        </div>

        {/* Direita: Imagem grande, quadrada, com bordas arredondadas */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-[#ECE5DC] border border-[#282522] shadow-2xl group">
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Emerald Varsity Ape"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
