import React, { useState, useEffect, useRef } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useWallets } from '../hooks/useWallets'
import {
  User,
  MapPin,
  ShoppingCart,
  Heart,
  Tag,
  Download,
  AlertTriangle,
  LogOut,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Camera,
  ChevronLeft,
  Home,
  Copy,
  Check,
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { AuthForm } from '../components/auth/AuthForm'

export interface ProfileSearchParams {
  tab?: 'profile' | 'wallets' | 'activity' | 'wishlist' | 'offers' | 'downloads' | 'support'
}

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  validateSearch: (search: Record<string, unknown>): ProfileSearchParams => {
    const validTabs = ['profile', 'wallets', 'activity', 'wishlist', 'offers', 'downloads', 'support']
    return {
      tab:
        typeof search.tab === 'string' && validTabs.includes(search.tab)
          ? (search.tab as any)
          : undefined,
    }
  },
  component: ProfilePage,
})

export function ProfilePage() {
  const { user, isAuthenticated, isLoadingSession, logout } = useAuth()
  const { profile, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useProfile()
  const { primaryWallet, wallets, createWallet, updateWallet, removeWallet } = useWallets()
  const { totalItemsCount } = useCart()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const handleCopyAddress = (addr: string) => {
    if (!addr) return
    navigator.clipboard.writeText(addr)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  useEffect(() => {
    if (!isAuthenticated && !user && !isLoadingSession) {
      navigate({ to: '/login', replace: true })
    }
  }, [isAuthenticated, user, isLoadingSession, navigate])

  const search = profileRoute.useSearch()
  const [activeTab, setActiveTab] = useState<string>(search.tab || 'profile')

  // Form states - Perfil do colecionador
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [ensSuffix, setEnsSuffix] = useState('.eth')
  const [ensName, setEnsName] = useState('')
  const [walletNickname, setWalletNickname] = useState('')
  const [avatar, setAvatar] = useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Visibility toggles for passwords
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states - Carteiras
  const [walletDisplayName, setWalletDisplayName] = useState('')
  const [walletNicknameField, setWalletNicknameField] = useState('')
  const [walletNetwork, setWalletNetwork] = useState('Ethereum')
  const [walletProfileName, setWalletProfileName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [secondaryWalletAddress, setSecondaryWalletAddress] = useState('')
  const [walletType, setWalletType] = useState('MetaMask')
  const [referralCode, setReferralCode] = useState('')
  const [walletEmail, setWalletEmail] = useState('')
  const [walletEnsSuffix, setWalletEnsSuffix] = useState('.eth')
  const [walletEnsName, setWalletEnsName] = useState('')

  // Secondary wallet section states
  const [isSameAsPrimary, setIsSameAsPrimary] = useState(false)
  const [showSecondaryForm, setShowSecondaryForm] = useState(false)
  const [newSecondaryLabel, setNewSecondaryLabel] = useState('')
  const [newSecondaryAddress, setNewSecondaryAddress] = useState('')
  const [isSavingWallet, setIsSavingWallet] = useState(false)

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null)

  const secondaryWallets = wallets.filter(
    (w) => !w.isPrimary && w.address.toLowerCase() !== primaryWallet?.address?.toLowerCase()
  )

  useEffect(() => {
    if (search.tab && search.tab !== activeTab) {
      setActiveTab(search.tab)
    }
  }, [search.tab])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    navigate({
      to: '/profile',
      search: { tab: tab === 'profile' ? undefined : (tab as any) },
      replace: true,
    })
  }

  // Sincroniza campos quando perfil/usuário for carregado
  useEffect(() => {
    if (profile || user) {
      const activeUser = profile || user
      if (activeUser) {
        setDisplayName(activeUser.name || '')
        setUsername(activeUser.username ? activeUser.username.replace(/^@/, '') : '')
        setEmail(activeUser.email || '')
        setAvatar(activeUser.avatar || '')
        setWalletNickname(activeUser.walletNickname || primaryWallet?.label || 'MetaMask')
        setEnsName(activeUser.ensName || '')
        setEnsSuffix(activeUser.ensSuffix || '.eth')

        // Sincroniza campos do formulário de carteiras
        setWalletDisplayName(activeUser.name || '')
        setWalletProfileName(activeUser.username ? activeUser.username.replace(/^@/, '') : (activeUser.name || ''))
        setWalletEmail(activeUser.email || '')
        setWalletEnsName(activeUser.ensName || '')
        setWalletEnsSuffix(activeUser.ensSuffix || '.eth')
        setWalletNicknameField(activeUser.walletNickname || primaryWallet?.label || 'MetaMask')
        setWalletAddress(primaryWallet?.address || '0x71C836466D380195A852277d337a85F756F304B1')
        setWalletNetwork(primaryWallet?.network || 'Ethereum')
        setWalletType(primaryWallet?.label?.includes('Coinbase') ? 'Coinbase Wallet' : 'MetaMask')

        // Tentar obter rascunho de checkout em sessionStorage
        try {
          const draftStr = sessionStorage.getItem('jungle_checkout_draft')
          if (draftStr) {
            const draft = JSON.parse(draftStr)
            if (draft.referralCode) setReferralCode(draft.referralCode)
            if (draft.secondaryWallet) setSecondaryWalletAddress(draft.secondaryWallet)
            if (draft.walletType) setWalletType(draft.walletType)
            if (draft.network) setWalletNetwork(draft.network)
            if (draft.useOtherWallet) setIsSameAsPrimary(false)
          }
        } catch {
          // ignore
        }
      }
    }
  }, [profile, user, primaryWallet?.address, primaryWallet?.label, primaryWallet?.network])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatar('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!displayName.trim()) {
      setFeedback({ message: 'O nome de exibição é obrigatório.', isSuccess: false })
      return
    }

    if (!username.trim()) {
      setFeedback({ message: 'O nome de usuário é obrigatório.', isSuccess: false })
      return
    }

    if (!email.trim()) {
      setFeedback({ message: 'O e-mail é obrigatório.', isSuccess: false })
      return
    }

    try {
      // 1. Atualizar dados do perfil
      await updateProfile({
        name: displayName.trim(),
        username: username.trim(),
        email: email.trim(),
        avatar: avatar || undefined,
        walletNickname: walletNickname.trim() || undefined,
        ensName: ensName.trim() || undefined,
        ensSuffix,
      })

      // 2. Se preencheu algum campo de senha, valida e atualiza
      if (newPassword || currentPassword || confirmPassword) {
        if (!newPassword || newPassword.length < 6) {
          setFeedback({
            message: 'Dados salvos, mas a nova senha deve conter pelo menos 6 caracteres.',
            isSuccess: false,
          })
          return
        }
        if (newPassword !== confirmPassword) {
          setFeedback({
            message: 'Dados salvos, mas a nova senha e confirmação não conferem.',
            isSuccess: false,
          })
          return
        }
        await changePassword({ currentPassword, newPassword })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }

      setFeedback({ message: 'Perfil do colecionador atualizado com sucesso!', isSuccess: true })
      setTimeout(() => setFeedback(null), 4000)
    } catch (err: any) {
      setFeedback({ message: err.message || 'Falha ao salvar alterações.', isSuccess: false })
    }
  }

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!walletAddress.trim()) {
      setFeedback({ message: 'O endereço da carteira é obrigatório.', isSuccess: false })
      return
    }

    if (!walletAddress.trim().startsWith('0x') || walletAddress.trim().length !== 42) {
      setFeedback({
        message: 'Endereço da carteira inválido. Deve começar com 0x e conter 42 caracteres.',
        isSuccess: false,
      })
      return
    }

    if (!walletNicknameField.trim()) {
      setFeedback({ message: 'O apelido da carteira é obrigatório.', isSuccess: false })
      return
    }

    if (!walletNetwork) {
      setFeedback({ message: 'Selecione uma rede para a carteira.', isSuccess: false })
      return
    }

    setIsSavingWallet(true)
    try {
      // 1. Atualizar ou criar a carteira principal
      if (primaryWallet) {
        await updateWallet({
          id: primaryWallet.id,
          payload: {
            label: walletNicknameField.trim(),
            network: (walletNetwork as any) || 'Ethereum',
            isPrimary: true,
          },
        })
      } else {
        await createWallet({
          address: walletAddress.trim(),
          label: walletNicknameField.trim() || 'MetaMask',
          network: (walletNetwork as any) || 'Ethereum',
          isPrimary: true,
        })
      }

      // 2. Atualizar perfil do usuário com nome, apelido da carteira, ENS e email
      await updateProfile({
        name: walletDisplayName.trim() || undefined,
        walletNickname: walletNicknameField.trim() || undefined,
        ensName: walletEnsName.trim() || undefined,
        ensSuffix: walletEnsSuffix,
        email: walletEmail.trim() || undefined,
      })

      // 3. Persistir no draft de checkout para sincronização total
      try {
        const existing = sessionStorage.getItem('jungle_checkout_draft')
        const parsed = existing ? JSON.parse(existing) : {}
        const updated = {
          ...parsed,
          displayName: walletDisplayName.trim() || parsed.displayName,
          walletNickname: walletNicknameField.trim(),
          network: walletNetwork,
          profileName: walletProfileName.trim(),
          walletAddress: walletAddress.trim(),
          secondaryWallet: isSameAsPrimary
            ? walletAddress.trim()
            : (secondaryWalletAddress.trim() || parsed.secondaryWallet),
          walletType,
          referralCode: referralCode.trim(),
          email: walletEmail.trim(),
          ensName: walletEnsName ? `${walletEnsName.trim()}${walletEnsSuffix}` : '',
        }
        sessionStorage.setItem('jungle_checkout_draft', JSON.stringify(updated))
      } catch {
        // no-op
      }

      setFeedback({
        message: 'Carteira principal salva com sucesso!',
        isSuccess: true,
      })
      setTimeout(() => setFeedback(null), 4000)
    } catch (err: any) {
      setFeedback({
        message: err.message || 'Falha ao salvar carteira.',
        isSuccess: false,
      })
    } finally {
      setIsSavingWallet(false)
    }
  }

  const handleResetPrimaryForm = () => {
    setWalletAddress('0x')
    setWalletNicknameField('')
    setFeedback({
      message: 'Insira o endereço e apelido da nova carteira principal e clique em Salvar.',
      isSuccess: true,
    })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleAddSecondaryWallet = async () => {
    if (!newSecondaryAddress.trim().startsWith('0x') || newSecondaryAddress.trim().length !== 42) {
      setFeedback({
        message: 'Endereço secundário inválido. Deve começar com 0x e conter 42 caracteres.',
        isSuccess: false,
      })
      return
    }

    try {
      await createWallet({
        address: newSecondaryAddress.trim(),
        label: newSecondaryLabel.trim() || 'Carteira Secundária',
        network: (walletNetwork as any) || 'Ethereum',
        isPrimary: false,
      })
      setNewSecondaryAddress('')
      setNewSecondaryLabel('')
      setShowSecondaryForm(false)
      setFeedback({
        message: 'Carteira secundária adicionada com sucesso!',
        isSuccess: true,
      })
      setTimeout(() => setFeedback(null), 4000)
    } catch (err: any) {
      setFeedback({
        message: err.message || 'Falha ao adicionar carteira secundária.',
        isSuccess: false,
      })
    }
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-[85vh] bg-[#140E0C] text-[#F3EFEA] font-mono px-4 py-8 sm:py-16 flex flex-col items-center justify-center">
        <AuthForm
          initialMode="login"
          className="bg-[#140E0C]"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#140E0C] font-mono text-xs text-[#9E968F] pb-24 md:pb-16">
      {/* =========================================================================
          1. VIEW MOBILE (TOP BAR, PROFILE CARD, TABS SCROLL) - <= 768px
          ========================================================================= */}
      <div className="block md:hidden">
        {/* Top Bar Mobile com botão Voltar (<) e Título Meu Perfil */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2D201A] bg-[#140E0C] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="h-9 w-9 rounded-full bg-[#18110E] border border-[#2D201A] flex items-center justify-center text-[#F3EFEA] hover:text-[#D98A53] hover:border-[#D98A53]/50 transition-colors cursor-pointer"
            aria-label="Voltar para a página inicial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold text-[#F3EFEA] tracking-wide">
            Meu Perfil
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="h-9 w-9 rounded-full bg-[#18110E] border border-[#2D201A] flex items-center justify-center text-[#9E968F] hover:text-[#E5484D] hover:border-[#E5484D]/50 transition-colors cursor-pointer"
            aria-label="Sair da conta"
            title="Sair da conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Card do Colecionador */}
        <div className="px-4 py-4 border-b border-[#2D201A] bg-[#18110E]/70 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <img
                src={avatar || user?.avatar || '/assets/avatars/collector_1.jpg'}
                alt={displayName || user?.name || 'Colecionador'}
                className="h-14 w-14 rounded-full object-cover border-2 border-[#D98A53]/50 bg-[#1F1613]"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#D98A53] text-[#140E0C] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#E59864]"
                aria-label="Alterar foto de perfil"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-[#F3EFEA] truncate">
                  {displayName || user?.name || 'Novo Sato'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#D98A53]/40 bg-[#D98A53]/10 text-[#D98A53] font-semibold">
                  Colecionador Web3
                </span>
              </div>
              <p className="text-[11px] text-[#7A6C63] font-mono mt-0.5">
                @{username || user?.username || 'novosato'}
              </p>
            </div>
          </div>

          {/* Chip de Carteira Principal */}
          {primaryWallet && (
            <div className="flex items-center justify-between bg-[#140E0C] border border-[#2D201A] rounded-lg px-3 py-2 text-[11px]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[#F3EFEA] font-bold shrink-0">{primaryWallet.label || 'MetaMask'}:</span>
                <span className="text-[#7A6C63] truncate font-mono">
                  {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAddress(primaryWallet.address)}
                  className="text-[#7A6C63] hover:text-[#D98A53] transition-colors p-0.5 shrink-0"
                  aria-label="Copiar endereço"
                >
                  {copiedAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <span className="text-[#D98A53] font-bold font-mono ml-2 shrink-0">
                {parseFloat(primaryWallet.balanceEth).toFixed(3)} ETH
              </span>
            </div>
          )}
        </div>

        {/* Abas Horizontais com Scroll Suave (Chips) */}
        <div className="px-4 py-3 border-b border-[#2D201A] bg-[#140E0C] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {[
              { id: 'profile', label: 'Dados do perfil', icon: User },
              { id: 'wallets', label: 'Carteiras', icon: MapPin },
              { id: 'activity', label: 'Atividade', icon: ShoppingCart },
              { id: 'wishlist', label: 'Favoritos', icon: Heart },
              { id: 'offers', label: 'Ofertas', icon: Tag },
              { id: 'downloads', label: 'Downloads', icon: Download },
              { id: 'support', label: 'Suporte', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#D98A53] text-[#140E0C]'
                      : 'bg-[#18110E] border border-[#2D201A] text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#201612]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal (Desktop e Mobile) */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0 py-6 md:py-10 font-mono text-xs text-[#9E968F]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Menu "Meu perfil" (Apenas Desktop) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3.5 bg-[#1F1613] border border-[#37271c] rounded-xl overflow-hidden py-4 shadow-xl">
            <h3 className="px-5 pb-3 text-sm font-bold text-[#F3EFEA]">Meu perfil</h3>

          <nav className="space-y-0.5" aria-label="Navegação do perfil">
            {/* 1. Dados do perfil */}
            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold text-left transition-colors border-l-[3px] ${
                activeTab === 'profile'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <User className={`h-4 w-4 shrink-0 ${activeTab === 'profile' ? 'text-[#D98A53]' : 'text-[#9E968F]'}`} />
              <span>Dados do perfil</span>
            </button>

            {/* 2. Carteiras */}
            <button
              type="button"
              onClick={() => handleTabChange('wallets')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold text-left transition-colors border-l-[3px] ${
                activeTab === 'wallets'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <MapPin className={`h-4 w-4 shrink-0 ${activeTab === 'wallets' ? 'text-[#D98A53]' : 'text-[#9E968F]'}`} />
              <span>Carteiras</span>
            </button>

            {/* 3. Atividade */}
            <button
              type="button"
              onClick={() => handleTabChange('activity')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] ${
                activeTab === 'activity'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70 font-semibold'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span>Atividade</span>
            </button>

            {/* 4. Lista de interesse */}
            <button
              type="button"
              onClick={() => handleTabChange('wishlist')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] ${
                activeTab === 'wishlist'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70 font-semibold'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <Heart className="h-4 w-4 shrink-0" />
              <span>Lista de interesse</span>
            </button>

            {/* 5. Ofertas */}
            <button
              type="button"
              onClick={() => handleTabChange('offers')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] ${
                activeTab === 'offers'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70 font-semibold'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <Tag className="h-4 w-4 shrink-0" />
              <span>Ofertas</span>
            </button>

            {/* 6. Arquivos baixados */}
            <button
              type="button"
              onClick={() => handleTabChange('downloads')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] ${
                activeTab === 'downloads'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70 font-semibold'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <Download className="h-4 w-4 shrink-0" />
              <span>Arquivos baixados</span>
            </button>

            {/* 7. Suporte */}
            <button
              type="button"
              onClick={() => handleTabChange('support')}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] ${
                activeTab === 'support'
                  ? 'border-[#D98A53] text-[#D98A53] bg-[#291C19]/70 font-semibold'
                  : 'border-transparent text-[#9E968F] hover:text-[#F3EFEA] hover:bg-[#251A16]'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Suporte</span>
            </button>

            {/* Linha divisória antes de Sair */}
            <div className="pt-2 pb-1 px-4">
              <div className="border-t border-[#37271c]" />
            </div>

            {/* 8. Sair */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-xs text-left transition-colors border-l-[3px] border-transparent text-[#9E968F] hover:text-[#D98A53] hover:bg-[#251A16]"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair</span>
            </button>
          </nav>
        </aside>

        {/* Coluna Direita: Conteúdo dinâmico de acordo com a aba */}
        <main className="md:col-span-8 lg:col-span-8.5 space-y-6">
          {feedback && (
            <div
              className={`p-3 rounded-md border flex items-center gap-2.5 text-xs ${
                feedback.isSuccess
                  ? 'bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399]'
                  : 'bg-[#E5484D]/10 border-[#E5484D]/40 text-[#E5484D]'
              }`}
            >
              {feedback.isSuccess ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'wallets' ? (
            <div className="space-y-8">
              <form onSubmit={handleSaveWallet} className="space-y-6">
                {/* Header Carteira principal */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#F3EFEA]">Carteira principal</h2>
                    <p className="text-xs text-[#9E968F] mt-1">
                      Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetPrimaryForm}
                    className="text-xs font-mono text-[#D98A53] hover:underline hover:text-[#E59864] transition-colors"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Grid 2 colunas para os campos de carteira principal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Linha 1: Nome de exibição* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Nome de exibição<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletDisplayName}
                      onChange={(e) => setWalletDisplayName(e.target.value)}
                      placeholder="Nome de exibição"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Linha 1: Apelido da carteira* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Apelido da carteira<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletNicknameField}
                      onChange={(e) => setWalletNicknameField(e.target.value)}
                      placeholder="MetaMask"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Linha 2: Rede * */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Rede <span className="text-[#D98A53]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={walletNetwork}
                        onChange={(e) => setWalletNetwork(e.target.value)}
                        className="w-full h-10 px-3.5 pr-8 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none transition-colors appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Selecione uma rede</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Arbitrum">Arbitrum</option>
                        <option value="Optimism">Optimism</option>
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-[#9E968F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Linha 2: Nome do perfil* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Nome do perfil<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletProfileName}
                      onChange={(e) => setWalletProfileName(e.target.value)}
                      placeholder="Nome do perfil"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Linha 3: Endereço da carteira* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Endereço da carteira<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Endereço 0x da carteira"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors font-mono"
                      required
                    />
                  </div>

                  {/* Linha 3: ENS ou carteira secundária (opcional) */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      ENS ou carteira secundária (opcional)
                    </label>
                    <input
                      type="text"
                      value={secondaryWalletAddress}
                      onChange={(e) => setSecondaryWalletAddress(e.target.value)}
                      placeholder="ENS ou carteira secundária (opcional)"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Linha 4: Tipo de carteira* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Tipo de carteira<span className="text-[#D98A53]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
                        className="w-full h-10 px-3.5 pr-8 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none transition-colors appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Selecione uma carteira</option>
                        <option value="MetaMask">MetaMask</option>
                        <option value="Coinbase Wallet">Coinbase Wallet</option>
                        <option value="WalletConnect">WalletConnect</option>
                        <option value="Phantom">Phantom</option>
                        <option value="Rainbow">Rainbow</option>
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-[#9E968F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Linha 4: Código de indicação* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Código de indicação<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Código de indicação"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Linha 5: E-mail* */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      E-mail<span className="text-[#D98A53]">*</span>
                    </label>
                    <input
                      type="email"
                      value={walletEmail}
                      onChange={(e) => setWalletEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Linha 5: Nome ENS * */}
                  <div>
                    <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                      Nome ENS <span className="text-[#D98A53]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative shrink-0">
                        <select
                          value={walletEnsSuffix}
                          onChange={(e) => setWalletEnsSuffix(e.target.value)}
                          className="h-10 px-3 pr-7 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value=".eth">.eth</option>
                          <option value=".crypto">.crypto</option>
                          <option value=".nft">.nft</option>
                          <option value=".dao">.dao</option>
                        </select>
                        <ChevronDown className="h-3.5 w-3.5 text-[#9E968F] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        value={walletEnsName}
                        onChange={(e) => setWalletEnsName(e.target.value)}
                        placeholder="carteira"
                        className="flex-1 h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Botão Salvar carteira */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingWallet}
                    className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase px-6 h-9 rounded-md transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSavingWallet ? 'Salvando...' : 'Salvar carteira'}
                  </button>
                </div>
              </form>

              {/* Seção Carteira secundária */}
              <div className="pt-8 border-t border-[#37271c]/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#F3EFEA]">Carteira secundária</h3>
                    <p className="text-xs text-[#9E968F] mt-1">
                      {secondaryWallets.length > 0 || isSameAsPrimary
                        ? isSameAsPrimary
                          ? 'Configurada como espelho da carteira principal.'
                          : `${secondaryWallets.length} carteira(s) secundária(s) vinculada(s).`
                        : 'Você ainda não adicionou uma carteira secundária.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setIsSameAsPrimary(!isSameAsPrimary)}
                      className="flex items-center gap-2 cursor-pointer text-xs text-[#9E968F] hover:text-[#F3EFEA] transition-colors select-none group"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSameAsPrimary
                            ? 'border-[#D98A53] bg-[#D98A53]/20'
                            : 'border-[#9E968F]/60 group-hover:border-[#9E968F]'
                        }`}
                      >
                        {isSameAsPrimary && (
                          <span className="w-2 h-2 rounded-full bg-[#D98A53]" />
                        )}
                      </span>
                      <span>Igual à carteira principal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSecondaryForm(!showSecondaryForm)}
                      className="text-xs font-mono text-[#D98A53] hover:underline hover:text-[#E59864] transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Formulário expansível para adicionar carteira secundária */}
                {showSecondaryForm && (
                  <div className="mt-4 p-4 rounded-lg border border-[#37271c] bg-[#18120F] space-y-4">
                    <h4 className="text-xs font-bold text-[#F3EFEA]">Cadastrar carteira secundária</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#9E968F] mb-1">Apelido</label>
                        <input
                          type="text"
                          value={newSecondaryLabel}
                          onChange={(e) => setNewSecondaryLabel(e.target.value)}
                          placeholder="Ex: Carteira de Backup"
                          className="w-full h-9 px-3 rounded border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9E968F] mb-1">Endereço 0x</label>
                        <input
                          type="text"
                          value={newSecondaryAddress}
                          onChange={(e) => setNewSecondaryAddress(e.target.value)}
                          placeholder="0x..."
                          className="w-full h-9 px-3 rounded border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSecondaryForm(false)}
                        className="text-xs font-mono text-[#9E968F] hover:text-[#F3EFEA] px-3 py-1.5"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSecondaryWallet}
                        className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase px-4 py-1.5 rounded transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de carteiras secundárias existentes */}
                {secondaryWallets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {secondaryWallets.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-[#37271c] bg-[#18120F]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F3EFEA] text-xs">{w.label}</span>
                            <span className="text-[10px] text-[#9E968F] px-1.5 py-0.5 rounded border border-[#37271c] bg-[#1B1512]">
                              {w.network}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-[#9E968F] mt-0.5">{w.address}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWallet(w.id)}
                          className="text-xs text-[#9E968F] hover:text-[#E5484D] px-2 py-1 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-sm font-bold text-[#F3EFEA]">Perfil do colecionador</h2>

              {/* Grid 2 colunas para os campos de perfil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Linha 1: Nome de exibição* */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    Nome de exibição<span className="text-[#D98A53]">*</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nome de exibição"
                    className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Linha 1: Nome de usuário* */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    Nome de usuário<span className="text-[#D98A53]">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nome_usuario"
                    className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Linha 2: E-mail* */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    E-mail<span className="text-[#D98A53]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Linha 2: Nome ENS * (.eth + input) */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    Nome ENS <span className="text-[#D98A53]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select
                        value={ensSuffix}
                        onChange={(e) => setEnsSuffix(e.target.value)}
                        className="h-10 px-3 pr-7 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] focus:border-[#D98A53] focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value=".eth">.eth</option>
                        <option value=".crypto">.crypto</option>
                        <option value=".nft">.nft</option>
                        <option value=".dao">.dao</option>
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-[#9E968F] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <input
                      type="text"
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder="carteira"
                      className="flex-1 h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Linha 3: Apelido da carteira* */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    Apelido da carteira<span className="text-[#D98A53]">*</span>
                  </label>
                  <input
                    type="text"
                    value={walletNickname}
                    onChange={(e) => setWalletNickname(e.target.value)}
                    placeholder="MetaMask"
                    className="w-full h-10 px-3.5 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Linha 3: Avatar com preview, botão Alterar e botão Remover */}
                <div>
                  <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                    Avatar
                  </label>
                  <div className="flex items-center gap-3 h-10">
                    <div className="h-10 w-10 rounded-full border border-[#37271c] bg-[#1B1512] flex items-center justify-center overflow-hidden shrink-0">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-4 w-4 text-[#9E968F]" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFile}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs px-4 h-9 rounded-md transition-colors shadow-sm"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-[#9E968F] hover:text-[#F3EFEA] text-xs font-mono px-2 py-1 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>

              {/* Seção "Alterar senha" */}
              <div className="pt-4 space-y-4">
                <h3 className="text-sm font-bold text-[#F3EFEA]">Alterar senha</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Coluna Esquerda: Campos de Senha empilhados */}
                  <div className="space-y-4">
                    {/* Senha atual */}
                    <div>
                      <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                        Senha atual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-3.5 pr-10 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
                          aria-label={showCurrentPassword ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Nova senha */}
                    <div>
                      <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                        Nova senha
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-3.5 pr-10 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
                          aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar nova senha */}
                    <div>
                      <label className="block text-xs font-medium text-[#9E968F] mb-1.5">
                        Confirmar nova senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-3.5 pr-10 rounded-md border border-[#37271c] bg-[#1B1512] text-xs text-[#F3EFEA] placeholder-[#9E968F]/40 focus:border-[#D98A53] focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors"
                          aria-label={showConfirmPassword ? 'Ocultar confirmação de nova senha' : 'Mostrar confirmação de nova senha'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Botão Salvar alinhado com a coluna esquerda */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile || isChangingPassword}
                        className="bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase px-8 h-9 rounded-md transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUpdatingProfile ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>

                  {/* Coluna Direita: Espaço em branco conforme o Figma */}
                  <div className="hidden sm:block" />
                </div>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-xl border border-[#37271c] bg-[#1F1613] text-center space-y-3">
              <h3 className="text-sm font-bold text-[#F3EFEA] capitalize">
                {activeTab === 'activity' && 'Atividade da Conta'}
                {activeTab === 'wishlist' && 'Lista de Interesse'}
                {activeTab === 'offers' && 'Ofertas e Lances'}
                {activeTab === 'downloads' && 'Arquivos Baixados'}
                {activeTab === 'support' && 'Suporte & Ajuda'}
              </h3>
              <p className="text-xs text-[#9E968F]">
                Nenhum registro encontrado nesta categoria no momento.
              </p>
              <button
                type="button"
                onClick={() => handleTabChange('profile')}
                className="mt-2 text-xs font-semibold text-[#D98A53] hover:underline"
              >
                Voltar aos dados do perfil
              </button>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* Barra de Navegação Inferior (Dock Mobile) */}
      <nav
        aria-label="Navegação mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#19120F]/95 backdrop-blur-md border-t border-[#37271c] px-6 py-2 shadow-2xl"
      >
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* 1. Home */}
          <Link
            to="/"
            className="p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors flex flex-col items-center"
            aria-label="Início"
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* 2. Favoritos */}
          <button
            type="button"
            onClick={() => handleTabChange('wishlist')}
            className={`p-2 transition-colors flex flex-col items-center cursor-pointer ${
              activeTab === 'wishlist' ? 'text-[#D98A53]' : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
          </button>

          {/* 3. Botão Central Flutuante com Ícone Scan */}
          <div className="relative -top-5 flex items-center justify-center">
            <Link
              to="/"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B87038] via-[#D98A53] to-[#E59864] text-[#151312] shadow-xl shadow-[#D98A53]/30 flex items-center justify-center border-4 border-[#16110E] active:scale-95 transition-transform"
              aria-label="Explorar Coleções"
            >
              <svg
                className="h-6 w-6 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 3H5a2 2 0 0 0-2 2v2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M3 17v2a2 2 0 0 0 2 2h2" />
                <line x1="4" y1="12" x2="20" y2="12" />
              </svg>
            </Link>
          </div>

          {/* 4. Carrinho */}
          <button
            type="button"
            onClick={() => navigate({ to: '/cart' })}
            className="p-2 text-[#9E968F] hover:text-[#F3EFEA] transition-colors flex flex-col items-center relative cursor-pointer"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#D98A53] text-[#151312] text-[9px] font-mono font-bold flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* 5. Perfil (Ativo) */}
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`p-2 transition-colors flex flex-col items-center cursor-pointer ${
              activeTab === 'profile' ? 'text-[#D98A53]' : 'text-[#9E968F] hover:text-[#F3EFEA]'
            }`}
            aria-label="Meu Perfil"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </div>
  )
}
