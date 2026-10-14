import { useState } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useAuth } from '../hooks/useAuth'
import { useWallets } from '../hooks/useWallets'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import type { BlockchainNetwork } from '../types/wallet'
import { Wallet, Plus, Trash2, CheckCircle2, ArrowLeft, Star, ExternalLink, AlertTriangle } from 'lucide-react'

export const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: WalletsPage,
})

function WalletsPage() {
  const { isAuthenticated } = useAuth()
  const { wallets, isLoading, createWallet, isCreatingWallet, updateWallet, removeWallet } = useWallets()

  const [address, setAddress] = useState('')
  const [label, setLabel] = useState('')
  const [network, setNetwork] = useState<BlockchainNetwork>('Ethereum')
  const [isPrimary, setIsPrimary] = useState(false)
  const [formFeedback, setFormFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null)

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-xs text-stone-400 mb-6">
          Você precisa estar conectado para visualizar suas carteiras cadastradas.
        </p>
        <Link to="/">
          <Button variant="default">Voltar ao Início</Button>
        </Link>
      </div>
    )
  }

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormFeedback(null)

    if (!address.startsWith('0x') || address.length !== 42) {
      setFormFeedback({
        message: 'Endereço inválido. O endereço deve começar com 0x e conter 42 caracteres.',
        isSuccess: false,
      })
      return
    }

    try {
      await createWallet({ address, label, network, isPrimary })
      setFormFeedback({ message: 'Carteira cadastrada com sucesso!', isSuccess: true })
      setAddress('')
      setLabel('')
      setIsPrimary(false)
    } catch (err: any) {
      setFormFeedback({ message: err.message || 'Falha ao cadastrar carteira.', isSuccess: false })
    }
  }

  const handleSetPrimary = async (walletId: string) => {
    await updateWallet({ id: walletId, payload: { isPrimary: true } })
  }

  const handleRemove = async (walletId: string) => {
    await removeWallet(walletId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Wallet className="h-7 w-7 text-amber-400" />
            Carteiras Web3 Conectadas
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Cadastre suas carteiras para pagamentos em ETH e custódia de colecionáveis.
          </p>
        </div>
        <Link to="/profile">
          <Button variant="ghost" size="sm" className="text-xs text-stone-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar ao Perfil
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Registered Wallets List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Carteiras Ativas ({wallets.length})</span>
            <span className="text-xs text-stone-400 font-normal">Máximo de carteiras suportadas</span>
          </h2>

          {wallets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <p className="text-sm font-bold text-white mb-1">Nenhuma carteira cadastrada</p>
              <p className="text-xs text-stone-400">
                Utilize o formulário ao lado para cadastrar sua carteira principal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className={`rounded-2xl border p-5 bg-surface transition-all ${
                    w.isPrimary
                      ? 'border-amber-400/60 bg-amber-500/5 shadow-md shadow-amber-500/5'
                      : 'border-border hover:border-stone-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{w.label}</h3>
                      {w.isPrimary ? (
                        <Badge variant="default" className="text-[10px] font-bold">
                          ★ Principal
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Secundária
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {w.balanceEth} ETH
                    </span>
                  </div>

                  <p className="text-xs font-mono text-stone-300 break-all bg-black/40 p-2.5 rounded-lg border border-border/50">
                    {w.address}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      Rede: <strong className="text-stone-200">{w.network}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {!w.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(w.id)}
                          className="text-stone-300 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1"
                        >
                          <Star className="h-3.5 w-3.5" />
                          Tornar Principal
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(w.id)}
                        className="text-stone-400 hover:text-red-400 p-1 transition-colors"
                        aria-label={`Remover carteira ${w.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Add Wallet Form */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-border pb-3">
            <Plus className="h-4 w-4 text-amber-400" />
            Cadastrar Nova Carteira
          </h2>

          {formFeedback && (
            <div
              className={`rounded-xl border p-3 text-xs flex items-center gap-2 ${
                formFeedback.isSuccess
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-red-500/40 bg-red-950/40 text-red-300'
              }`}
            >
              {formFeedback.isSuccess ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              <span>{formFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleAddWallet} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-stone-300 font-semibold block">Apelido da Carteira</label>
              <Input
                placeholder="Ex: Minha MetaMask Ledger"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-semibold block">Endereço Público (0x...)</label>
              <Input
                placeholder="0x71C836466D380195A852277d337a85F756F304B1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-semibold block">Rede Blockchain</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as BlockchainNetwork)}
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Ethereum">Ethereum Mainnet</option>
                <option value="Polygon">Polygon Network</option>
                <option value="Arbitrum">Arbitrum One</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is-primary-check"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface-elevated text-amber-500 focus:ring-primary"
              />
              <label htmlFor="is-primary-check" className="text-stone-300 select-none cursor-pointer">
                Definir como carteira principal para checkout padrão
              </label>
            </div>

            <Button
              type="submit"
              variant="default"
              isLoading={isCreatingWallet}
              className="w-full font-bold text-xs shadow-amber-500/20"
            >
              Adicionar Carteira
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
