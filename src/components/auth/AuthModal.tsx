import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { login, isLoggingIn, loginError, register, isRegistering, registerError } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail)
    setPassword('jungle123')
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!email.trim()) {
      setFormError('Por favor, informe seu e-mail.')
      return
    }

    try {
      if (mode === 'login') {
        await login({ email: email.trim(), password })
      } else {
        if (!name.trim() || !username.trim()) {
          setFormError('Nome e nome de usuário são obrigatórios para cadastro.')
          return
        }
        await register({ name: name.trim(), username: username.trim(), email: email.trim(), password })
      }
      onClose()
    } catch (err: any) {
      setFormError(err.message || 'Falha ao autenticar')
    }
  }

  const activeError = formError || (mode === 'login' ? loginError?.message : registerError?.message)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface border-border text-stone-100 p-6 sm:p-8">
        <DialogHeader className="space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-1">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-center text-white font-sans">
            {mode === 'login' ? 'Acessar Conta Jungle' : 'Criar Conta de Colecionador'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-stone-400">
            {mode === 'login'
              ? 'Entre para gerenciar seus NFTs, favoritos e carteiras Web3'
              : 'Junte-se à comunidade oficial e adquira colecionáveis raros'}
          </DialogDescription>
        </DialogHeader>

        {/* Quick credential buttons for evaluators */}
        <div className="my-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
          <p className="font-semibold text-amber-400 mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Credenciais de Avaliação Rápida
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('alex@junglegaming.io')}
              className="text-[11px] h-7 flex-1 border-border bg-surface text-stone-200 hover:border-amber-400"
            >
              Alex (VIP Hunter)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('sara@junglegaming.io')}
              className="text-[11px] h-7 flex-1 border-border bg-surface text-stone-200 hover:border-amber-400"
            >
              Sara (Curadora)
            </Button>
          </div>
        </div>

        {activeError && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
            {activeError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">Nome Completo</label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">Nome de Usuário (@)</label>
                <Input
                  placeholder="ex: colecionador_jungle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-300">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300">Senha</label>
              {mode === 'login' && (
                <span className="text-[11px] text-amber-400/80 cursor-pointer hover:underline">
                  Esqueci minha senha
                </span>
              )}
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold text-sm shadow-amber-500/20"
            isLoading={isLoggingIn || isRegistering}
          >
            {mode === 'login' ? 'Entrar na Plataforma' : 'Criar Minha Conta'}
          </Button>

          <div className="text-center pt-2 border-t border-border/60">
            {mode === 'login' ? (
              <p className="text-xs text-stone-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setFormError(null)
                  }}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Cadastre-se aqui
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setFormError(null)
                  }}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Faça login
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
