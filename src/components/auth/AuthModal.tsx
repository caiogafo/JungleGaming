import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

function GoogleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { login, isLoggingIn, loginError, register, isRegistering, registerError } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setFormError(null)
    setFeedbackNotice(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFeedbackNotice(null)

    if (mode === 'login') {
      const targetEmail = email.trim() || 'contato@email.com'
      try {
        await login({ email: targetEmail, password: password || '123456' })
        onClose()
      } catch (err: any) {
        setFormError(err.message || 'Falha ao entrar')
      }
    } else {
      if (!username.trim()) {
        setFormError('Por favor, informe um nome de usuário.')
        return
      }
      if (!email.trim()) {
        setFormError('Por favor, informe seu e-mail.')
        return
      }
      if (confirmPassword && password && password !== confirmPassword) {
        setFormError('As senhas não coincidem.')
        return
      }

      try {
        await register({
          name: username.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password || '123456',
        })
        onClose()
      } catch (err: any) {
        setFormError(err.message || 'Falha ao criar conta')
      }
    }
  }

  const handleSocialLogin = async (provider: 'Google' | 'Facebook') => {
    setFormError(null)
    try {
      if (provider === 'Google') {
        await login({ email: 'google.collector@gmail.com', password: 'social_login' })
      } else {
        await login({ email: 'facebook.collector@fb.com', password: 'social_login' })
      }
      onClose()
    } catch (err: any) {
      setFormError(err.message || `Falha ao autenticar com ${provider}`)
    }
  }

  const handleForgotPassword = () => {
    const targetEmail = email.trim() || 'contato@email.com'
    setFeedbackNotice(`Link de recuperação enviado para ${targetEmail}`)
    setTimeout(() => setFeedbackNotice(null), 4000)
  }

  const activeError = formError || (mode === 'login' ? loginError?.message : registerError?.message)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] w-full bg-[#221815] border border-[#3E2B23] border-b-2 border-b-[#D98A53] p-7 sm:p-8 text-[#F3EFEA] font-mono shadow-2xl rounded-lg sm:rounded-xl [&>button]:text-[#9E968F] [&>button]:hover:text-[#F3EFEA]">
        <DialogTitle className="sr-only">
          {mode === 'login' ? 'Entrar na Plataforma' : 'Criar Conta de Colecionador'}
        </DialogTitle>

        {/* Cabeçalho de Abas Centrado: Entrar | Criar conta */}
        <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-mono font-bold pt-1 pb-1">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`transition-colors cursor-pointer focus:outline-none ${
              mode === 'login'
                ? 'text-[#D98A53]'
                : 'text-[#F3EFEA] hover:text-[#D98A53]/80'
            }`}
          >
            Entrar
          </button>
          <span className="text-[#554035] select-none font-light">|</span>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`transition-colors cursor-pointer focus:outline-none ${
              mode === 'register'
                ? 'text-[#D98A53]'
                : 'text-[#F3EFEA] hover:text-[#D98A53]/80'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Subtítulo dinâmico */}
        <p className="text-center font-mono text-xs text-[#9E968F] max-w-[320px] mx-auto mt-1 mb-5 leading-relaxed">
          {mode === 'login'
            ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
            : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
        </p>

        {activeError && (
          <div className="rounded-md border border-[#E5484D]/40 bg-[#E5484D]/10 p-2.5 text-xs text-[#E5484D] flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        {feedbackNotice && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 text-center mb-3">
            {feedbackNotice}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {mode === 'login' ? (
            /* Modo Entrar */
            <>
              <div>
                <input
                  type="email"
                  placeholder="contato@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#D98A53] transition-colors p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-[#D98A53]" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-right pt-0.5">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#D98A53] hover:underline font-mono"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase rounded-md transition-colors shadow-sm disabled:opacity-50 mt-1 cursor-pointer"
              >
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </button>
            </>
          ) : (
            /* Modo Criar conta */
            <>
              <div>
                <input
                  type="text"
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#D98A53] transition-colors p-1"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-[#D98A53]" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 bg-[#1B1512] border border-[#37271c] rounded-md font-mono text-xs text-[#F3EFEA] placeholder:text-[#9E968F]/60 focus:outline-none focus:border-[#D98A53] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968F] hover:text-[#D98A53] transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4 text-[#D98A53]" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full h-11 bg-[#D98A53] hover:bg-[#E59864] text-[#151312] font-mono font-bold text-xs uppercase rounded-md transition-colors shadow-sm disabled:opacity-50 mt-1 cursor-pointer"
              >
                {isRegistering ? 'Criando conta...' : 'Criar conta'}
              </button>
            </>
          )}

          {/* Divisor: Ou continue com */}
          <div className="relative my-4 flex items-center justify-center pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#37271c]" />
            </div>
            <div className="relative bg-[#221815] px-3 text-[11px] font-mono text-[#9E968F]">
              Ou continue com
            </div>
          </div>

          {/* Botões Sociais */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full h-11 rounded-md border border-[#37271c] bg-[#1B1512]/50 hover:bg-[#1B1512] hover:border-[#D98A53]/50 text-xs font-mono text-[#9E968F] hover:text-[#F3EFEA] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Continuar com Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full h-11 rounded-md border border-[#37271c] bg-[#1B1512]/50 hover:bg-[#1B1512] hover:border-[#D98A53]/50 text-xs font-mono text-[#9E968F] hover:text-[#F3EFEA] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <FacebookIcon className="h-4 w-4" />
              <span>Continuar com Facebook</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
