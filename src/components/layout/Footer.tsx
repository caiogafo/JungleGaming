import { Shield, Zap, Award, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#070605] text-stone-400">
      {/* Value propositions banner (as shown in Figma) */}
      <div className="border-b border-border/60 py-10 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Segurança e Idempotência</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Todas as transações operam com chaves idempotentes contra duplicação de ordens e snapshots imutáveis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Tempo Real via WebSockets</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Sincronização imediata de preços e disponibilidade de estoque via protocolo Socket.IO integrado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Coleções Verificadas</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Colecionáveis digitais autênticos no padrão ERC-721 e ERC-1155 com atributos e raridades certificadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links and copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                JUNGLE <span className="text-amber-400">NFT</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              O ecossistema oficial de colecionáveis digitais e gaming Web3 da Jungle Gaming.
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Mercado</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Coleção BAYC Jungle</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Cyber Primates</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">High Society Chimps</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Audio Metaverse</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Redes Blockchain</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="text-stone-300">Ethereum Mainnet</span></li>
              <li><span className="text-stone-300">Polygon Network</span></li>
              <li><span className="text-stone-300">Arbitrum One</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Desafio Técnico</h5>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              Desenvolvido com React, TypeScript, TanStack Router, TanStack Query, Axios, Socket.IO, Tailwind CSS e MSW.
            </p>
            <span className="inline-block text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              Jungle Gaming Frontend Challenge
            </span>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Jungle Gaming. Todos os direitos reservados. Dados e blockchains simulados para avaliação.</p>
          <div className="flex gap-4">
            <span>Termos de Uso</span>
            <span>Privacidade</span>
            <span>Smart Contracts</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
