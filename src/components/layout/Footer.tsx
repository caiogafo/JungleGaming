import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

function FacebookIcon() {
  return (
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubscribed(true)
    setTimeout(() => {
      setIsSubscribed(false)
      setEmail('')
    }, 4000)
  }

  return (
    <footer className="w-full text-[#9E968F] font-mono" aria-label="Rodapé do site">
      {/* 1. Faixa Superior (Newsletter & Destaques) - Fundo em tom marrom escuro */}
      <div className="bg-[#1A1816] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Coluna 1: W - Segurança da carteira */}
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-[#D98A53] text-[#151312] font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                W
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#F3EFEA]">
                  Segurança da carteira
                </h4>
                <p className="font-mono text-xs text-[#9E968F] leading-relaxed">
                  Custódia segura e suporte total a carteiras não-custodiais com proteção avançada.
                </p>
              </div>
            </div>

            {/* Coluna 2: C - Criadores em destaque */}
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-[#D98A53] text-[#151312] font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                C
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#F3EFEA]">
                  Criadores em destaque
                </h4>
                <p className="font-mono text-xs text-[#9E968F] leading-relaxed">
                  Artistas verificados e curadoria exclusiva dos nomes mais promissores da arte digital.
                </p>
              </div>
            </div>

            {/* Coluna 3: D - Alertas de lançamentos */}
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-[#D98A53] text-[#151312] font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                D
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#F3EFEA]">
                  Alertas de lançamentos
                </h4>
                <p className="font-mono text-xs text-[#9E968F] leading-relaxed">
                  Notificações instantâneas para nunca perder um drop de edição limitada.
                </p>
              </div>
            </div>

            {/* Coluna 4: Newsletter */}
            <div className="space-y-2">
              <h4 className="font-sans font-bold text-sm text-[#F3EFEA]">
                Antecipe-se ao próximo lançamento
              </h4>
              <form onSubmit={handleSubscribe} className="flex items-center">
                <input
                  type="text"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="digite seu e-mail..."
                  className="w-full bg-[#151312] border border-white/10 rounded-l-md px-3 py-2 text-xs font-mono text-[#F3EFEA] placeholder:text-[#9E968F] focus:outline-none focus:border-[#D98A53]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#D98A53] hover:bg-[#c77a46] text-[#151312] font-mono font-bold text-xs px-3.5 py-2 rounded-r-md transition-colors shrink-0"
                >
                  {isSubscribed ? <CheckCircle2 className="h-4 w-4" /> : 'Enviar'}
                </button>
              </form>
              <p className="font-mono text-[11px] text-[#9E968F] leading-tight">
                Receba atualizações semanais e convites para mints privados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Faixa Intermédia (Contato) - Flexbox distribuído */}
      <div className="bg-[#151312] border-t border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span className="text-xl font-bold tracking-[0.2em] text-[#F3EFEA]">
              KURIO
            </span>
            <span className="text-[#9E968F]">
              Feito para colecionadores e entusiastas da arte digital.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#9E968F]">
            <a
              href="mailto:contato@email.com"
              className="hover:text-[#D98A53] transition-colors"
            >
              contato@email.com
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="tel:+551140028922"
              className="hover:text-[#D98A53] transition-colors"
            >
              +55 11 4002 8922
            </a>
          </div>
        </div>
      </div>

      {/* 3. Faixa Inferior (Links & Carteiras) */}
      <div className="bg-[#181614] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
            {/* Coluna 1: Meu perfil */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#F3EFEA] uppercase tracking-wider">
                Meu perfil
              </h5>
              <ul className="space-y-2">
                <li><a href="/profile" className="hover:text-[#D98A53] transition-colors">Visão geral</a></li>
                <li><a href="/profile" className="hover:text-[#D98A53] transition-colors">Meus NFTs</a></li>
                <li><a href="/profile" className="hover:text-[#D98A53] transition-colors">Favoritos</a></li>
                <li><a href="/profile" className="hover:text-[#D98A53] transition-colors">Histórico</a></li>
                <li><a href="/profile" className="hover:text-[#D98A53] transition-colors">Configurações</a></li>
              </ul>
            </div>

            {/* Coluna 2: Central de ajuda */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#F3EFEA] uppercase tracking-wider">
                Central de ajuda
              </h5>
              <ul className="space-y-2">
                <li><a href="#ajuda" className="hover:text-[#D98A53] transition-colors">Suporte ao cliente</a></li>
                <li><a href="#ajuda" className="hover:text-[#D98A53] transition-colors">Perguntas frequentes</a></li>
                <li><a href="#ajuda" className="hover:text-[#D98A53] transition-colors">Como comprar</a></li>
                <li><a href="#ajuda" className="hover:text-[#D98A53] transition-colors">Taxas de gás</a></li>
                <li><a href="#ajuda" className="hover:text-[#D98A53] transition-colors">Termos de serviço</a></li>
              </ul>
            </div>

            {/* Coluna 3: Coleções */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#F3EFEA] uppercase tracking-wider">
                Coleções
              </h5>
              <ul className="space-y-2">
                <li><a href="#catalogo" className="hover:text-[#D98A53] transition-colors">Genesis Apes</a></li>
                <li><a href="#catalogo" className="hover:text-[#D98A53] transition-colors">Nomad Society</a></li>
                <li><a href="#catalogo" className="hover:text-[#D98A53] transition-colors">Cyberpunk Primates</a></li>
                <li><a href="#catalogo" className="hover:text-[#D98A53] transition-colors">Golden Beats</a></li>
                <li><a href="#catalogo" className="hover:text-[#D98A53] transition-colors">Todas as Coleções</a></li>
              </ul>
            </div>

            {/* Coluna 4: Redes sociais e Carteiras compatíveis */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#F3EFEA] uppercase tracking-wider">
                Redes sociais
              </h5>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded border border-white/15 flex items-center justify-center text-[#9E968F] hover:text-[#D98A53] hover:border-[#D98A53] transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded border border-white/15 flex items-center justify-center text-[#9E968F] hover:text-[#D98A53] hover:border-[#D98A53] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded border border-white/15 flex items-center justify-center text-[#9E968F] hover:text-[#D98A53] hover:border-[#D98A53] transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded border border-white/15 flex items-center justify-center text-[#9E968F] hover:text-[#D98A53] hover:border-[#D98A53] transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded border border-white/15 flex items-center justify-center text-[#9E968F] hover:text-[#D98A53] hover:border-[#D98A53] transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              </div>

              {/* Carteiras compatíveis */}
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-[#9E968F] mb-1.5 font-bold">
                  Carteiras compatíveis
                </p>
                <p className="text-[11px] font-bold text-[#F3EFEA] tracking-wider">
                  METAMASK — WALLETCONNECT — COINBASE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Base Absoluta: Copyright centralizado */}
      <div className="bg-[#12100F] border-t border-white/5 py-6 text-center">
        <p className="font-mono text-xs text-[#9E968F]">
          &copy; 2026 Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  )
}
