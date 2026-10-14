import React from 'react'

interface Article {
  id: string
  image: string
  imageAlt: string
  date: string
  readTime: string
  title: string
  description: string
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    image: '/assets/nfts/black_chimpanzee_suit.jpg',
    imageAlt: 'Ape em fato branco',
    date: '14 Out, 2026',
    readTime: '4 min',
    title: 'A Ascensão dos Colecionáveis Digitais',
    description: 'Como os NFTs estão redefinindo o conceito de propriedade intelectual na web3.',
  },
  {
    id: 'art-2',
    image: '/assets/nfts/emerald_ape_hero.jpg',
    imageAlt: 'Ape em casaco varsity verde',
    date: '12 Out, 2026',
    readTime: '6 min',
    title: 'Guia de Segurança para Carteiras',
    description: 'Melhores práticas para proteger seus ativos mais valiosos em redes descentralizadas.',
  },
  {
    id: 'art-3',
    image: '/assets/nfts/cyber_ape_hoodie.jpg',
    imageAlt: 'Ape em casaco roxo e chapéu verde',
    date: '09 Out, 2026',
    readTime: '3 min',
    title: 'O Fenômeno das Comunidades Web3',
    description: 'Por que as maiores coleções prosperam através do poder e engajamento da comunidade.',
  },
  {
    id: 'art-4',
    image: '/assets/nfts/golden_ape_headphones.jpg',
    imageAlt: 'Ape em casaco amarelo com auscultadores',
    date: '05 Out, 2026',
    readTime: '5 min',
    title: 'Áudio e NFTs: O Futuro da Música',
    description: 'Músicos independentes ganham autonomia através da tokenização direta para fãs.',
  },
]

export function MintingJournal() {
  return (
    <section id="diario" className="py-16" aria-label="Diário da Cunhagem">
      {/* Título de seção centralizado em sans-serif bold com subtítulo em monospace */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#F3EFEA]">
          Diário da Cunhagem
        </h2>
        <p className="font-mono text-xs sm:text-sm text-[#9E968F] max-w-xl mx-auto">
          Descubra as últimas notícias, análises de mercado e insights sobre o ecossistema NFT
        </p>
      </div>

      {/* Grid de 4 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARTICLES.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1A1816] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#D98A53]/30 shadow-lg"
          >
            <div>
              {/* Imagem no topo: Fundo creme com ape arredondado */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#ECE5DC] p-3 flex items-center justify-center">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Meta info (monospace pequeno): Data | Leitura de X min */}
              <div className="mt-4 flex items-center text-[11px] font-mono text-[#9E968F]">
                <span>{article.date}</span>
                <span className="mx-1.5">•</span>
                <span>Leitura de {article.readTime}</span>
              </div>

              {/* Título do artigo em sans-serif bold */}
              <h3 className="mt-2 font-sans text-base font-bold text-[#F3EFEA] group-hover:text-[#D98A53] transition-colors line-clamp-2">
                {article.title}
              </h3>

              {/* Descrição curta em monospace */}
              <p className="mt-2 font-mono text-xs text-[#9E968F] leading-relaxed line-clamp-2">
                {article.description}
              </p>
            </div>

            {/* Link "Ler mais ->" em cor laranja */}
            <div className="mt-4 pt-3 border-t border-white/5">
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
