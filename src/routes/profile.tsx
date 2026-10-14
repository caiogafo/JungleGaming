import { useState, useEffect } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { User, Lock, Wallet, ArrowLeft, CheckCircle2, Shield, Camera } from 'lucide-react'

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { profile, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useProfile()

  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setUsername(profile.username || '')
      setBio(profile.bio || '')
      setAvatar(profile.avatar || '')
    }
  }, [profile])

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-xs text-stone-400 mb-6">
          Você precisa estar conectado para acessar o painel do colecionador.
        </p>
        <Link to="/">
          <Button variant="default">Voltar ao Início</Button>
        </Link>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    try {
      await updateProfile({ name, username, bio, avatar })
      setFeedback({ message: 'Dados do colecionador salvos com sucesso!', isSuccess: true })
    } catch (err: any) {
      setFeedback({ message: err.message || 'Falha ao salvar dados.', isSuccess: false })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    if (newPassword !== confirmPassword) {
      setFeedback({ message: 'A nova senha e a confirmação não coincidem.', isSuccess: false })
      return
    }
    try {
      await changePassword({ currentPassword, newPassword })
      setFeedback({ message: 'Senha atualizada com sucesso!', isSuccess: true })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setFeedback({ message: err.message || 'Falha ao alterar senha.', isSuccess: false })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <User className="h-7 w-7 text-amber-400" />
            Painel do Colecionador
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Gerencie seus dados pessoais, avatar e credenciais de segurança.
          </p>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-xs text-stone-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-4 rounded-2xl border border-border bg-surface p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('info')
              setFeedback(null)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
              activeTab === 'info'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-stone-300 hover:bg-surface-elevated'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Dados do Perfil</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('password')
              setFeedback(null)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
              activeTab === 'password'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-stone-300 hover:bg-surface-elevated'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Alterar Senha</span>
          </button>

          <Link
            to="/wallets"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-stone-300 hover:bg-surface-elevated transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>Carteiras Conectadas</span>
          </Link>
        </aside>

        {/* Main Content Area */}
        <div className="md:col-span-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
          {feedback && (
            <div
              className={`rounded-xl border p-3.5 mb-6 text-xs flex items-center gap-2 ${
                feedback.isSuccess
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-red-500/40 bg-red-950/40 text-red-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'info' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-base font-bold text-white border-b border-border pb-3">
                Informações Pessoais
              </h3>

              {/* Avatar section */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <img
                    src={avatar || user?.avatar || '/assets/avatars/collector_1.jpg'}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover border-2 border-amber-500/40 bg-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">Foto de Perfil</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatar('/assets/avatars/collector_1.jpg')}
                      className="text-[11px] h-7"
                    >
                      Avatar 1
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatar('/assets/avatars/collector_2.jpg')}
                      className="text-[11px] h-7"
                    >
                      Avatar 2
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Nome Completo</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Nome de Usuário (@)</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-stone-300 font-semibold">E-mail (Imutável)</label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-surface-elevated/40 font-mono text-stone-400"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-stone-300 font-semibold">Biografia do Colecionador</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-surface-elevated p-3 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Escreva um resumo sobre sua coleção..."
                />
              </div>

              <Button
                type="submit"
                variant="default"
                isLoading={isUpdatingProfile}
                className="font-bold text-xs px-6 shadow-amber-500/20"
              >
                Salvar Alterações
              </Button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <h3 className="text-base font-bold text-white border-b border-border pb-3">
                Alteração de Senha
              </h3>

              <div className="space-y-1 text-xs">
                <label className="text-stone-300 font-semibold">Senha Atual</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Nova Senha</label>
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Confirmar Nova Senha</label>
                  <Input
                    type="password"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                isLoading={isChangingPassword}
                className="font-bold text-xs px-6 shadow-amber-500/20"
              >
                Atualizar Senha
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
