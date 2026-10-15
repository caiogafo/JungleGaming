import React from 'react'

interface Article {
  id: string
  image: string
  imageAlt: string
  meta: string
  title: string
  description: string
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    imageAlt: 'Como funciona a propriedade de NFTs',
    meta: '12 de setembro  |  Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
  },
  {
    id: 'art-2',
    image: '/assets/nfts/emerald_ape_hero.jpg',
    imageAlt: '10 artistas digitais para acompanhar',
    meta: '13 de setembro  |  Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
  },
  {
    id: 'art-3',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    imageAlt: 'Raridade, atributos e procedência',
    meta: '15 de setembro  |  Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
  },
  {
    id: 'art-4',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    imageAlt: 'Como proteger sua carteira',
    meta: '15 de setembro  |  Leitura de 2 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
  },
]

export function MintingJournal() {
  return (
    <section id="diario" className="py-16" aria-label="Diário da Cunhagem">
      {/* Título de seção centralizado em monospace conforme Figma */}
      <div className="text-center space-y-3 mb-10">
        <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#F3EFEA]">
          Diário da Cunhagem
        </h2>
        <p className="font-mono text-xs sm:text-sm text-[#9E968F] max-w-2xl mx-auto leading-relaxed">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>

      {/* Grid de 4 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARTICLES.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col justify-between rounded-2xl bg-[#291C19] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 shadow-md"
          >
            <div>
              {/* Imagem no topo */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#241F1B]">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Meta info (monospace pequeno): Data | Leitura de X min */}
              <div className="mt-4 font-mono text-[11px] sm:text-xs text-[#9E968F]">
                {article.meta}
              </div>

              {/* Título do artigo em monospace bold conforme Figma */}
              <h3 className="mt-2.5 font-mono text-base font-bold text-[#F3EFEA] group-hover:text-[#D98A53] transition-colors leading-snug">
                {article.title}
              </h3>

              {/* Descrição em monospace */}
              <p className="mt-2.5 font-mono text-xs text-[#9E968F] leading-relaxed">
                {article.description}
              </p>
            </div>

            {/* Link "Ler mais ->" em cor laranja sem divisória conforme Figma */}
            <div className="mt-5">
              <a
                href="#diario"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#D98A53] hover:text-[#e8a374] transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Ler mais</span>
                <span>&rarr;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
