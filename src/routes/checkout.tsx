import { useState, useEffect } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'
import { useWallets } from '../hooks/useWallets'
import { formatEth } from '../lib/eth'
import { Check, ChevronDown, ShoppingBag, AlertCircle, ChevronLeft, MoreVertical, Wallet } from 'lucide-react'

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

function CheckoutPage() {
  const { items, quote, couponCode, applyCoupon, removeCoupon } = useCart()
  const { createOrder, isCreatingOrder } = useOrders()
  const { user, isAuthenticated } = useAuth()
  const { primaryWallet } = useWallets()
  const navigate = useNavigate()

  // Carrega rascunho anterior de checkout do sessionStorage, se existir
  const savedDraft = typeof window !== 'undefined'
    ? (() => {
        try {
          const raw = sessionStorage.getItem('jungle_checkout_draft')
          return raw ? JSON.parse(raw) : null
        } catch {
          return null
        }
      })()
    : null

  // Form states - Perfil do colecionador
  const [displayName, setDisplayName] = useState(savedDraft?.displayName || '')
  const [username, setUsername] = useState(savedDraft?.username || '')
  const [network, setNetwork] = useState(savedDraft?.network || '')
  const [profileName, setProfileName] = useState(savedDraft?.profileName || '')
  const [walletAddress, setWalletAddress] = useState(savedDraft?.walletAddress || '')
  const [secondaryWallet, setSecondaryWallet] = useState(savedDraft?.secondaryWallet || '')
  const [walletType, setWalletType] = useState(savedDraft?.walletType || '')
  const [referralCode, setReferralCode] = useState(savedDraft?.referralCode || '')
  const [email, setEmail] = useState(savedDraft?.email || '')
  const [ensName, setEnsName] = useState(savedDraft?.ensName || '')
  const [useOtherWallet, setUseOtherWallet] = useState(savedDraft?.useOtherWallet || false)
  const [notes, setNotes] = useState(savedDraft?.notes || '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Preenchimento automático com as informações salvas do usuário quando autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setDisplayName(user.name || user.username)
      setUsername(user.username.startsWith('@') ? user.username : `@${user.username}`)
      setEmail(user.email)
      setProfileName(user.name || user.username)
      setNetwork(primaryWallet?.network || 'Ethereum')
      setWalletAddress(primaryWallet?.address || '0x71C836466D380195A852277d337a85F756F304B1')
      setWalletType(primaryWallet?.label?.includes('Coinbase') ? 'Coinbase Wallet' : 'MetaMask')
      setEnsName('.eth')
      setFieldErrors({})
      setValidationError(null)
    }
  }, [isAuthenticated, user?.id, primaryWallet?.address])

  // Salva alterações do formulário em sessionStorage para persistir entre navegações e refresh
  useEffect(() => {
    try {
      const draft = {
        displayName,
        username,
        network,
        profileName,
        walletAddress,
        secondaryWallet,
        walletType,
        referralCode,
        email,
        ensName,
        useOtherWallet,
        notes,
      }
      sessionStorage.setItem('jungle_checkout_draft', JSON.stringify(draft))
    } catch {}
  }, [
    displayName,
    username,
    network,
    profileName,
    walletAddress,
    secondaryWallet,
    walletType,
    referralCode,
    email,
    ensName,
    useOtherWallet,
    notes,
  ])

  // Carteira e rede selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'multi' | 'metamask' | 'coinbase'>('coinbase')

  // Promo code toggle
  const [isPromoOpen, setIsPromoOpen] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!displayName.trim()) errors.displayName = 'Preencha o nome de exibição'
    if (!username.trim()) errors.username = 'Preencha o nome de usuário'
    if (!network) errors.network = 'Selecione uma rede'
    if (!profileName.trim()) errors.profileName = 'Preencha o nome do perfil'
    if (!walletAddress.trim()) errors.walletAddress = 'Preencha o endereço da carteira'
    if (!walletType) errors.walletType = 'Selecione o tipo de carteira'
    if (!email.trim()) {
      errors.email = 'Preencha o e-mail'
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Formato de e-mail inválido'
    }
    if (!ensName) errors.ensName = 'Selecione o domínio ENS'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    setIsApplyingPromo(true)
    await applyCoupon(promoInput.trim())
    setIsApplyingPromo(false)
  }

  const handleConfirmOrder = async () => {
    setValidationError(null)

    if (!validateForm()) {
      setValidationError('Por favor, preencha todos os campos obrigatórios (*) do perfil antes de confirmar.')
      const firstErrorEl = document.querySelector('[data-has-error="true"]')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    try {
      const chosenWallet = walletType || 'MetaMask'
      const chosenAddress = walletAddress.trim()

      const order = await createOrder({
        idempotencyKey: `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        walletId: 'wallet_1',
        walletName: chosenWallet,
        walletAddress: chosenAddress,
        network: (network as any) || 'Ethereum',
        couponCode: couponCode || undefined,
        customerName: displayName.trim(),
        customerEmail: email.trim(),
        username: username.trim(),
        notes: notes.trim(),
      })

      try {
        sessionStorage.removeItem('jungle_checkout_draft')
      } catch {}

      navigate({ to: '/receipt/$id', params: { id: order.id } })
    } catch (err: any) {
      setValidationError(err.message || 'Falha ao processar pagamento.')
    }
  }

  // Estados específicos para seleção rápida no Mobile
  const [selectedMobileWallet, setSelectedMobileWallet] = useState<'reserva' | 'principal'>('reserva')
  const [selectedMobileProvider, setSelectedMobileProvider] = useState<'walletconnect' | 'metamask' | 'coinbase'>('coinbase')
  const [mobileError, setMobileError] = useState<string | null>(null)

  const handleConfirmOrderMobile = async () => {
    setMobileError(null)
    try {
      const chosenWallet =
        selectedMobileProvider === 'coinbase'
          ? 'Coinbase Wallet'
          : selectedMobileProvider === 'metamask'
            ? 'MetaMask'
            : 'WalletConnect'

      const chosenAddress =
        selectedMobileWallet === 'reserva'
          ? 'nova.kurio.eth'
          : (walletAddress || '0xA91FE82C')

      const chosenNetwork =
        selectedMobileWallet === 'reserva'
          ? 'Polygon'
          : 'Ethereum'

      const order = await createOrder({
        idempotencyKey: `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        walletId: selectedMobileWallet === 'reserva' ? 'wallet_reserva' : 'wallet_principal',
        walletName: chosenWallet,
        walletAddress: chosenAddress,
        network: chosenNetwork as any,
        couponCode: couponCode || undefined,
        customerName: displayName.trim() || user?.name || user?.username || 'Colecionador Kurio',
        customerEmail: email.trim() || user?.email || 'contato@kurio.com',
        username: username.trim() || user?.username || '@colecionador',
        notes: notes.trim(),
      })

      try {
        sessionStorage.removeItem('jungle_checkout_draft')
      } catch {}

      navigate({ to: '/receipt/$id', params: { id: order.id } })
    } catch (err: any) {
      setMobileError(err.message || 'Falha ao processar pagamento.')
    }
  }

  return (
    <>
      {/* =========================================================================
          1. VIEW MOBILE (PAGAMENTO FIGMA MOCKUP) - <= 768px
          ========================================================================= */}
      <div className="block md:hidden min-h-screen px-4 pt-4 pb-12 font-mono text-xs text-[#9E968F] bg-[#140E0C] space-y-5">
        {/* Top Bar Mobile com botão Voltar (<) e Título Pagamento com carteira */}
        <div className="flex items-center justify-between relative pb-1">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="h-10 w-10 rounded-full bg-[#241C19] border border-[#37271c] flex items-center justify-center text-[#F3EFEA] hover:text-[#D98A53] transition-colors shadow-md active:scale-95 shrink-0 z-10"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-sm sm:text-base font-bold text-[#F3EFEA] tracking-wider text-center absolute inset-x-0 pointer-events-none">
            Pagamento com carteira
          </h1>

          <div className="w-10 h-10 shrink-0" aria-hidden="true" />
        </div>

        {mobileError && (
          <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p>{mobileError}</p>
          </div>
        )}

        {/* Seção 1: Carteira conectada */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#F3EFEA] tracking-wide">
              Carteira conectada
            </h2>
            <button
              type="button"
              onClick={() => {
                setSelectedMobileWallet((prev) => (prev === 'reserva' ? 'principal' : 'reserva'))
              }}
              className="text-xs text-[#D98A53] hover:text-[#E59864] transition-colors"
            >
              Trocar carteira
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Card 1: Reserva */}
            <div
              onClick={() => setSelectedMobileWallet('reserva')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between ${
                selectedMobileWallet === 'reserva'
                  ? 'bg-[#261C18] border-[#37271c]/90 shadow-md ring-1 ring-[#D98A53]/30'
                  : 'bg-[#231A17] border-[#37271c]/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Radio Circle */}
                <div className="mt-0.5 shrink-0">
                  {selectedMobileWallet === 'reserva' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#D98A53] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D98A53]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#4A382D]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[#F3EFEA]">Reserva</h3>
                  <p className="text-xs text-[#9E968F]">nova.kurio.eth</p>
                  <p className="text-xs text-[#9E968F]/80">Rede Polygon</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate({ to: '/profile', search: { tab: 'wallets' } })
                }}
                className="p-1.5 text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
                aria-label="Opções da carteira"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Card 2: Principal */}
            <div
              onClick={() => setSelectedMobileWallet('principal')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between ${
                selectedMobileWallet === 'principal'
                  ? 'bg-[#261C18] border-[#37271c]/90 shadow-md ring-1 ring-[#D98A53]/30'
                  : 'bg-[#231A17] border-[#37271c]/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Radio Circle */}
                <div className="mt-0.5 shrink-0">
                  {selectedMobileWallet === 'principal' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#D98A53] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D98A53]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#4A382D]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[#F3EFEA]">Principal</h3>
                  <p className="text-xs text-[#9E968F]">0xA91F…E82C</p>
                  <p className="text-xs text-[#9E968F]/80">Rede principal Ethereum</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate({ to: '/profile', search: { tab: 'wallets' } })
                }}
                className="p-1.5 text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
                aria-label="Opções da carteira"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Seção 2: Carteira e rede */}
        <div className="space-y-2.5 pt-2">
          <h2 className="text-xs font-bold text-[#F3EFEA] tracking-wide">
            Carteira e rede
          </h2>

          <div className="space-y-2.5">
            {/* Provedor 1: WalletConnect */}
            <div
              onClick={() => setSelectedMobileProvider('walletconnect')}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between shadow-md active:scale-98 ${
                selectedMobileProvider === 'walletconnect'
                  ? 'bg-[#261C18] border-[#37271c]/90 ring-1 ring-[#D98A53]/30'
                  : 'bg-[#231A17] border-[#37271c]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#2E201B] border border-[#3D2E27] flex items-center justify-center text-[#D98A53] font-mono font-bold text-xs shrink-0">
                  W
                </div>
                <span className="text-xs font-mono text-[#F3EFEA]">WalletConnect</span>
              </div>

              {selectedMobileProvider === 'walletconnect' ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#D98A53] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D98A53]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#4A382D]" />
              )}
            </div>

            {/* Provedor 2: MetaMask */}
            <div
              onClick={() => setSelectedMobileProvider('metamask')}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between shadow-md active:scale-98 ${
                selectedMobileProvider === 'metamask'
                  ? 'bg-[#261C18] border-[#37271c]/90 ring-1 ring-[#D98A53]/30'
                  : 'bg-[#231A17] border-[#37271c]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#2E201B] border border-[#3D2E27] flex items-center justify-center text-[#D98A53] font-mono font-bold text-xs shrink-0">
                  M
                </div>
                <span className="text-xs font-mono text-[#F3EFEA]">MetaMask</span>
              </div>

              {selectedMobileProvider === 'metamask' ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#D98A53] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D98A53]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#4A382D]" />
              )}
            </div>

            {/* Provedor 3: Coinbase Wallet */}
            <div
              onClick={() => setSelectedMobileProvider('coinbase')}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between shadow-md active:scale-98 ${
                selectedMobileProvider === 'coinbase'
                  ? 'bg-[#261C18] border-[#37271c]/90 ring-1 ring-[#D98A53]/30'
                  : 'bg-[#231A17] border-[#37271c]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#2E201B] border border-[#3D2E27] flex items-center justify-center text-[#D98A53] shrink-0">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-xs font-mono text-[#F3EFEA]">Coinbase Wallet</span>
              </div>

              {selectedMobileProvider === 'coinbase' ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#D98A53] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D98A53]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#4A382D]" />
              )}
            </div>
          </div>
        </div>

        {/* Linha Total */}
        <div className="flex items-center justify-end gap-3 pt-3 pb-2 font-mono">
          <span className="text-sm font-bold text-[#F3EFEA]">Total:</span>
          <span className="text-base sm:text-lg font-bold text-[#D98A53]">
            {formatEth(quote?.totalEth || '8.936000')}
          </span>
        </div>

        {/* Botão de Ação: Confirmar compra */}
        <button
          type="button"
          onClick={handleConfirmOrderMobile}
          disabled={isCreatingOrder}
          className="w-full h-12 bg-[#C48247] hover:bg-[#D98A53] text-[#151312] font-mono font-bold text-xs uppercase rounded-full transition-all shadow-lg active:scale-98 flex items-center justify-center tracking-wider disabled:opacity-50 mt-4"
        >
          {isCreatingOrder ? 'Confirmando transação...' : 'Confirmar compra'}
        </button>
      </div>

      {/* =========================================================================
          2. VIEW DESKTOP (Telas >= 768px - inalterada)
          ========================================================================= */}
      <div className="hidden md:block max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-8 font-mono text-xs text-[#9E968F]">
        {/* 1. Breadcrumb: Início / Mercado / Pagamento */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#9E968F]">
        <Link to="/" className="hover:text-[#F3EFEA] transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/mercado" className="hover:text-[#F3EFEA] transition-colors">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-[#F3EFEA]">Pagamento</span>
      </nav>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#37271c] bg-[#291C19] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#1B1512] border border-[#37271c] flex items-center justify-center text-[#D98A53] mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-[#F3EFEA]">Seu carrinho está vazio</h2>
          <p className="text-xs text-[#9E968F]">
            Nenhum item encontrado para pagamento. Visite o catálogo para adicionar NFTs.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-bold text-xs uppercase px-6 py-2.5 rounded-md transition-colors"
            >
              Voltar ao Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Coluna Esquerda: Perfil do colecionador */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-mono text-sm sm:text-base font-bold text-[#F3EFEA] tracking-wide">
                Perfil do colecionador
              </h2>
              {isAuthenticated && user ? (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Check className="h-3.5 w-3.5" />
                  <span>Conectado como {user.name || user.username}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('jungle:open-auth'))}
                  className="text-xs text-[#D98A53] hover:underline cursor-pointer text-left sm:text-right"
                >
                  Já possui conta? Entrar / Cadastrar
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="p-3 bg-[#1B1512] border border-[#37271c] rounded-md text-xs text-[#9E968F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span>Conecte sua conta para carregar seus dados e carteira automaticamente.</span>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('jungle:open-auth'))}
                  className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-[10px] px-3 py-1.5 rounded transition-colors uppercase shrink-0"
                >
                  Entrar
                </button>
              </div>
            )}

            {/* Grid de Campos em 2 Colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome de exibição */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.displayName}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Nome de exibição<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Novo Sato"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    if (fieldErrors.displayName) setFieldErrors((prev) => ({ ...prev, displayName: '' }))
                  }}
                  className={`w-full h-9 px-3 bg-[#1B1512] border rounded-md text-[#F3EFEA] focus:outline-none transition-colors ${
                    fieldErrors.displayName
                      ? 'border-[#E5484D] focus:border-[#E5484D]'
                      : 'border-[#37271c] focus:border-[#D98A53]'
                  }`}
                />
                {fieldErrors.displayName && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.displayName}</span>
                )}
              </div>

              {/* Nome de usuário */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.username}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Nome de usuário<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: @novosato"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }))
                  }}
                  className={`w-full h-9 px-3 bg-[#1B1512] border rounded-md text-[#F3EFEA] focus:outline-none transition-colors ${
                    fieldErrors.username
                      ? 'border-[#E5484D] focus:border-[#E5484D]'
                      : 'border-[#37271c] focus:border-[#D98A53]'
                  }`}
                />
                {fieldErrors.username && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.username}</span>
                )}
              </div>

              {/* Rede */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.network}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Rede<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={network}
                    onChange={(e) => {
                      setNetwork(e.target.value)
                      if (fieldErrors.network) setFieldErrors((prev) => ({ ...prev, network: '' }))
                    }}
                    className={`w-full h-9 px-3 pr-8 bg-[#1B1512] border rounded-md appearance-none focus:outline-none transition-colors cursor-pointer ${
                      fieldErrors.network
                        ? 'border-[#E5484D] focus:border-[#E5484D]'
                        : 'border-[#37271c] focus:border-[#D98A53]'
                    } ${network ? 'text-[#F3EFEA]' : 'text-[#9E968F]/60'}`}
                  >
                    <option value="" disabled className="bg-[#1B1512] text-[#9E968F]">
                      Selecione uma rede
                    </option>
                    <option value="Ethereum" className="bg-[#1B1512] text-[#F3EFEA]">Ethereum</option>
                    <option value="Polygon" className="bg-[#1B1512] text-[#F3EFEA]">Polygon</option>
                    <option value="Arbitrum" className="bg-[#1B1512] text-[#F3EFEA]">Arbitrum</option>
                    <option value="Solana" className="bg-[#1B1512] text-[#F3EFEA]">Solana</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-[#9E968F] pointer-events-none" />
                </div>
                {fieldErrors.network && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.network}</span>
                )}
              </div>

              {/* Nome do perfil */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.profileName}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Nome do perfil<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Colecionador VIP"
                  value={profileName}
                  onChange={(e) => {
                    setProfileName(e.target.value)
                    if (fieldErrors.profileName) setFieldErrors((prev) => ({ ...prev, profileName: '' }))
                  }}
                  className={`w-full h-9 px-3 bg-[#1B1512] border rounded-md text-[#F3EFEA] focus:outline-none transition-colors ${
                    fieldErrors.profileName
                      ? 'border-[#E5484D] focus:border-[#E5484D]'
                      : 'border-[#37271c] focus:border-[#D98A53]'
                  }`}
                />
                {fieldErrors.profileName && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.profileName}</span>
                )}
              </div>

              {/* Endereço da carteira */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.walletAddress}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Endereço da carteira<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Endereço 0x da carteira"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value)
                    if (fieldErrors.walletAddress) setFieldErrors((prev) => ({ ...prev, walletAddress: '' }))
                  }}
                  className={`w-full h-9 px-3 bg-[#1B1512] border rounded-md text-[#F3EFEA] placeholder:text-[#9E968F]/40 focus:outline-none transition-colors ${
                    fieldErrors.walletAddress
                      ? 'border-[#E5484D] focus:border-[#E5484D]'
                      : 'border-[#37271c] focus:border-[#D98A53]'
                  }`}
                />
                {fieldErrors.walletAddress && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.walletAddress}</span>
                )}
              </div>

              {/* ENS ou carteira secundária */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9E968F] block font-medium">
                  ENS ou carteira secundária (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ENS ou carteira secundária (opcional)"
                  value={secondaryWallet}
                  onChange={(e) => setSecondaryWallet(e.target.value)}
                  className="w-full h-9 px-3 bg-[#1B1512] border border-[#37271c] rounded-md text-[#F3EFEA] placeholder:text-[#9E968F]/40 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
              </div>

              {/* Tipo de carteira */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.walletType}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Tipo de carteira<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={walletType}
                    onChange={(e) => {
                      setWalletType(e.target.value)
                      if (fieldErrors.walletType) setFieldErrors((prev) => ({ ...prev, walletType: '' }))
                    }}
                    className={`w-full h-9 px-3 pr-8 bg-[#1B1512] border rounded-md appearance-none focus:outline-none transition-colors cursor-pointer ${
                      fieldErrors.walletType
                        ? 'border-[#E5484D] focus:border-[#E5484D]'
                        : 'border-[#37271c] focus:border-[#D98A53]'
                    } ${walletType ? 'text-[#F3EFEA]' : 'text-[#9E968F]/60'}`}
                  >
                    <option value="" disabled className="bg-[#1B1512] text-[#9E968F]">
                      Selecione uma carteira
                    </option>
                    <option value="Coinbase Wallet" className="bg-[#1B1512] text-[#F3EFEA]">Coinbase Wallet</option>
                    <option value="MetaMask" className="bg-[#1B1512] text-[#F3EFEA]">MetaMask</option>
                    <option value="WalletConnect" className="bg-[#1B1512] text-[#F3EFEA]">WalletConnect</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-[#9E968F] pointer-events-none" />
                </div>
                {fieldErrors.walletType && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.walletType}</span>
                )}
              </div>

              {/* Código de indicação */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9E968F] block font-medium">
                  Código de indicação (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Código de indicação"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full h-9 px-3 bg-[#1B1512] border border-[#37271c] rounded-md text-[#F3EFEA] placeholder:text-[#9E968F]/40 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
              </div>

              {/* E-mail */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.email}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  E-mail<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Ex: colecionador@kurio.art"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  className={`w-full h-9 px-3 bg-[#1B1512] border rounded-md text-[#F3EFEA] placeholder:text-[#9E968F]/40 focus:outline-none transition-colors ${
                    fieldErrors.email
                      ? 'border-[#E5484D] focus:border-[#E5484D]'
                      : 'border-[#37271c] focus:border-[#D98A53]'
                  }`}
                />
                {fieldErrors.email && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.email}</span>
                )}
              </div>

              {/* Nome ENS */}
              <div className="space-y-1.5" data-has-error={!!fieldErrors.ensName}>
                <label className="text-[11px] text-[#F3EFEA] block font-medium">
                  Nome ENS<span className="text-[#D98A53] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={ensName}
                    onChange={(e) => {
                      setEnsName(e.target.value)
                      if (fieldErrors.ensName) setFieldErrors((prev) => ({ ...prev, ensName: '' }))
                    }}
                    className={`w-full h-9 px-3 pr-8 bg-[#1B1512] border rounded-md appearance-none focus:outline-none transition-colors cursor-pointer ${
                      fieldErrors.ensName
                        ? 'border-[#E5484D] focus:border-[#E5484D]'
                        : 'border-[#37271c] focus:border-[#D98A53]'
                    } ${ensName ? 'text-[#F3EFEA]' : 'text-[#9E968F]/60'}`}
                  >
                    <option value="" disabled className="bg-[#1B1512] text-[#9E968F]">
                      Selecione
                    </option>
                    <option value=".eth" className="bg-[#1B1512] text-[#F3EFEA]">.eth</option>
                    <option value=".crypto" className="bg-[#1B1512] text-[#F3EFEA]">.crypto</option>
                    <option value=".xyz" className="bg-[#1B1512] text-[#F3EFEA]">.xyz</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-[#9E968F] pointer-events-none" />
                </div>
                {fieldErrors.ensName && (
                  <span className="text-[10px] text-[#E5484D] block">{fieldErrors.ensName}</span>
                )}
              </div>
            </div>

            {/* Toggle: Usar outra carteira? */}
            <div className="pt-1">
              <label
                onClick={() => setUseOtherWallet(!useOtherWallet)}
                className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#F3EFEA] select-none"
              >
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                    useOtherWallet ? 'border-[#D98A53] bg-[#D98A53]' : 'border-[#D98A53] bg-transparent'
                  }`}
                >
                  {useOtherWallet && <Check className="h-2.5 w-2.5 text-[#151312] stroke-[3]" />}
                </span>
                <span>Usar outra carteira?</span>
              </label>
            </div>

            {/* Observação do colecionador (opcional) */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#9E968F] block font-medium">
                Observação do colecionador (opcional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-[#1B1512] border border-[#37271c] rounded-md text-[#F3EFEA] placeholder:text-[#9E968F]/40 focus:outline-none focus:border-[#D98A53] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Coluna Direita: Seus NFTs + Resumo + Carteira e Rede */}
          <div className="lg:col-span-5 space-y-6">
            {/* Seus NFTs */}
            <div className="space-y-3">
              <h3 className="font-mono text-sm font-bold text-[#F3EFEA]">
                Seus NFTs
              </h3>

              {/* Subcabeçalho: NFTs | Subtotal */}
              <div className="flex justify-between items-center text-[11px] font-bold text-[#F3EFEA] pb-1 border-b border-[#37271c]">
                <span>NFTs</span>
                <span>Subtotal</span>
              </div>

              {/* Lista de NFTs no Pedido */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.nft.image}
                        alt={item.nft.name}
                        className="h-12 w-12 rounded-xl object-cover bg-[#241F1B] border border-[#37271c] shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#F3EFEA] truncate">
                          {item.nft.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#9E968F]">
                          <span>ID do token: #{item.nft.tokenId || '0042'}</span>
                          <span>(x {item.quantity})</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#D98A53] shrink-0">
                      {formatEth(Number(item.unitPriceEth) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Código Promocional link / input */}
            <div className="pt-2">
              {!isPromoOpen && !couponCode ? (
                <button
                  type="button"
                  onClick={() => setIsPromoOpen(true)}
                  className="text-xs text-[#9E968F] hover:text-[#D98A53] transition-colors block text-right w-full"
                >
                  Tem um código promocional? Aplique aqui
                </button>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex rounded-md overflow-hidden border border-[#37271c]">
                    <input
                      placeholder="Digite o código promocional..."
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full h-8 px-3 text-xs bg-[#1B1512] text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingPromo}
                      className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] px-3 h-8 font-bold text-xs uppercase transition-colors shrink-0"
                    >
                      {isApplyingPromo ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {couponCode && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-400">
                      <span>Cupom ativo: <strong>{couponCode}</strong></span>
                      <button type="button" onClick={removeCoupon} className="underline hover:text-white">
                        Remover
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Linhas de Preço */}
            <div className="space-y-2.5 text-xs text-[#9E968F] pt-2 border-t border-[#37271c]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-[#F3EFEA] font-bold">{formatEth(quote?.subtotalEth)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Desconto do lançamento</span>
                <span className="text-[#F3EFEA]">
                  {quote?.discountEth && quote.discountEth !== '0.000000'
                    ? `(-) ${formatEth(quote.discountEth)}`
                    : '(-) 00.00'}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[#9E968F] block">Taxa de rede</span>
                  <span className="text-[10px] text-[#9E968F]/70 block">Taxa estimada</span>
                </div>
                <span className="text-[#F3EFEA] font-mono">{formatEth(quote?.networkFeeEth)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-[#37271c]">
                <span className="text-[#F3EFEA]">Total</span>
                <span className="text-[#D98A53] text-base">{formatEth(quote?.totalEth)}</span>
              </div>
            </div>

            {/* Seção Carteira e rede */}
            <div className="pt-4 space-y-3">
              <h4 className="text-center text-xs font-bold text-[#F3EFEA]">
                Carteira e rede
              </h4>

              <div className="space-y-2">
                {/* Opção 1: Multi-wallet */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('multi')}
                  className={`w-full p-2.5 rounded-md border text-left flex items-center justify-center gap-3 transition-colors ${
                    selectedPaymentMethod === 'multi'
                      ? 'border-[#D98A53] bg-[#291C19]'
                      : 'border-[#37271c] bg-[#1B1512] hover:border-[#D98A53]/60'
                  }`}
                >
                  <span className="text-[10px] tracking-wider text-[#D98A53] font-bold">
                    METAMASK • WALLETCONNECT • COINBASE
                  </span>
                </button>

                {/* Opção 2: MetaMask */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('metamask')}
                  className={`w-full p-2.5 rounded-md border text-left flex items-center gap-3 transition-colors ${
                    selectedPaymentMethod === 'metamask'
                      ? 'border-[#D98A53] bg-[#291C19]'
                      : 'border-[#37271c] bg-[#1B1512] hover:border-[#D98A53]/60'
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPaymentMethod === 'metamask'
                        ? 'border-[#D98A53] bg-[#D98A53]'
                        : 'border-[#9E968F]'
                    }`}
                  >
                    {selectedPaymentMethod === 'metamask' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#151312]" />
                    )}
                  </span>
                  <span className="text-xs text-[#F3EFEA] font-medium">MetaMask</span>
                </button>

                {/* Opção 3: Coinbase Wallet (ativo conforme screenshot) */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('coinbase')}
                  className={`w-full p-2.5 rounded-md border text-left flex items-center gap-3 transition-colors ${
                    selectedPaymentMethod === 'coinbase'
                      ? 'border-[#D98A53] bg-[#291C19]'
                      : 'border-[#37271c] bg-[#1B1512] hover:border-[#D98A53]/60'
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPaymentMethod === 'coinbase'
                        ? 'border-[#D98A53] bg-[#D98A53]'
                        : 'border-[#9E968F]'
                    }`}
                  >
                    {selectedPaymentMethod === 'coinbase' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#151312]" />
                    )}
                  </span>
                  <span className="text-xs text-[#F3EFEA] font-medium">Coinbase Wallet</span>
                </button>
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/40 rounded-md text-xs text-[#E5484D] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Botão Confirmar compra */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isCreatingOrder}
                className="w-full bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase h-11 px-4 rounded-md transition-colors shadow-md active:scale-95 disabled:opacity-50"
              >
                {isCreatingOrder ? 'Processando transação...' : 'Confirmar compra'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
