import { Link } from '@tanstack/react-router'

export function HeroBanner() {
  return (
    <section className="relative w-full mb-10 sm:mb-14" aria-label="Apresentação Kurio">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Esquerda: Conteúdo com recuo suave conforme Figma */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 pl-2 sm:pl-4 lg:pl-8">
          <div className="space-y-4">
            {/* Subtítulo superior */}
            <p className="font-mono text-xs tracking-wider text-[#9E968F]">
              Bem-vindo à Kurio
            </p>

            {/* Título Principal (H1) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#F3EFEA] leading-[1.08] font-sans uppercase">
              SEJA DONO DO FUTURO<br />DA ARTE DIGITAL
            </h1>

            {/* Descrição conforme Figma */}
            <p className="font-mono text-xs sm:text-sm text-[#9E968F] max-w-lg leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>

            {/* Botão EXPLORAR */}
            <div className="pt-2">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded-md transition-colors shadow-md active:scale-95"
              >
                EXPLORAR
              </a>
            </div>
          </div>
        </div>

        {/* Direita: Imagem NFT grande alinhada com os cards da direita abaixo */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <Link
            to="/nft/$id"
            params={{ id: 'nft_1' }}
            className="relative aspect-square w-full max-w-[340px] sm:max-w-sm lg:max-w-none overflow-hidden rounded-3xl shadow-xl group block focus:outline-none focus:ring-2 focus:ring-[#D98A53]"
            aria-label="Ver detalhes de Emerald Ape #042"
          >
            <img
              src="/assets/nfts/emerald_ape_hero.jpg"
              alt="Emerald Ape #042"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
          </Link>
        </div>
      </div>

      {/* Indicadores: Três pequenos pontos laranjas alinhados na base do Hero conforme Figma */}
      <div className="flex justify-center items-center gap-2.5 pt-8 sm:pt-10">
        <span className="h-2 w-2 rounded-full bg-[#D98A53]" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[#D98A53]/40" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[#D98A53]/20" aria-hidden="true" />
      </div>
    </section>
  )
}

