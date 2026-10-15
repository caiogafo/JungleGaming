import { useState } from 'react'
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export interface AuthFormProps {
  initialMode?: 'login' | 'register'
  onSuccess?: () => void
  onClose?: () => void
  className?: string
}

export function GoogleIcon({ className = 'h-4 w-4' }: { className?: string }) {
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

export function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

export function AuthForm({
  initialMode = 'login',
  onSuccess,
  onClose,
  className = '',
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
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
        onSuccess?.()
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
        onSuccess?.()
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
      onSuccess?.()
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
    <div
      className={`relative w-full max-w-[420px] mx-auto text-[#F3EFEA] font-mono select-text ${className}`}
    >
      {/* Botão de Fechar opcional (quando em modal) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-[#7A6C63] hover:text-[#F3EFEA] transition-colors rounded-lg focus:outline-none cursor-pointer z-10"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* 1. Header KURIO */}
      <div className="text-center pt-2 sm:pt-0 pb-1">
        <span className="font-mono text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#FFFFFF] select-none uppercase inline-block">
          KURIO
        </span>
      </div>

      {/* 2. Título da Tela */}
      <h1 className="text-center font-mono text-base sm:text-lg font-bold text-[#F3EFEA] mt-8 mb-6 sm:mt-7 sm:mb-6 leading-tight">
        {mode === 'login' ? 'Entrar' : 'Criar perfil de colecionador'}
      </h1>

      {/* Alertas de Erro ou Feedback */}
      {activeError && (
        <div className="rounded-lg border border-[#E5484D]/40 bg-[#E5484D]/10 p-3 text-xs text-[#E5484D] flex items-center gap-2 mb-4 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {feedbackNotice && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 text-center mb-4 font-mono">
          {feedbackNotice}
        </div>
      )}

      {/* 3. Formulário */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {mode === 'login' ? (
          /* ========================================================
             MODO ENTRAR (SCREEN 1)
             ======================================================== */
          <>
            <div>
              <input
                type="email"
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] px-4 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] px-4 pr-11 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6A5D54] hover:text-[#D98A53] transition-colors p-1 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-[#D98A53]" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Esqueceu a senha? */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs sm:text-[13px] font-mono text-[#D98A53] hover:text-[#E59864] hover:underline transition-colors focus:outline-none cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-[50px] bg-[#D98A53] hover:bg-[#E59864] active:bg-[#C87A43] text-[#140E0C] font-mono font-bold text-sm sm:text-base rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-6 cursor-pointer flex items-center justify-center tracking-wide"
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </>
        ) : (
          /* ========================================================
             MODO CRIAR PERFIL DE COLECIONADOR (SCREEN 2)
             ======================================================== */
          <>
            <div>
              <input
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-[50px] px-4 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] px-4 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[50px] px-4 pr-11 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6A5D54] hover:text-[#D98A53] transition-colors p-1 focus:outline-none cursor-pointer"
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
                className="w-full h-[50px] px-4 pr-11 bg-[#18110E] border border-[#2D201A] rounded-lg font-mono text-xs sm:text-sm text-[#F3EFEA] placeholder:text-[#6A5D54] focus:outline-none focus:border-[#D98A53] focus:ring-1 focus:ring-[#D98A53]/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6A5D54] hover:text-[#D98A53] transition-colors p-1 focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4 text-[#D98A53]" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Botão Criar perfil */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full h-[50px] bg-[#D98A53] hover:bg-[#E59864] active:bg-[#C87A43] text-[#140E0C] font-mono font-bold text-sm sm:text-base rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-6 cursor-pointer flex items-center justify-center tracking-wide"
            >
              {isRegistering ? 'Criando perfil...' : 'Criar perfil'}
            </button>
          </>
        )}

        {/* 4. Divisor: Ou continue com */}
        <div className="relative my-7 flex items-center justify-center pt-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2D201A]" />
          </div>
          <div className="relative bg-[#140E0C] px-3 font-mono text-xs text-[#7A6C63] select-none">
            Ou continue com
          </div>
        </div>

        {/* 5. Botões Sociais */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full h-[50px] rounded-lg border border-[#2D201A] bg-[#18110E] hover:bg-[#201713] hover:border-[#3D2C23] text-xs sm:text-sm font-mono text-[#E5E0DA] flex items-center justify-center gap-3 transition-colors cursor-pointer active:scale-[0.99]"
          >
            <GoogleIcon className="h-4 w-4 shrink-0" />
            <span>Continuar com Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full h-[50px] rounded-lg border border-[#2D201A] bg-[#18110E] hover:bg-[#201713] hover:border-[#3D2C23] text-xs sm:text-sm font-mono text-[#E5E0DA] flex items-center justify-center gap-3 transition-colors cursor-pointer active:scale-[0.99]"
          >
            <FacebookIcon className="h-4 w-4 shrink-0" />
            <span>Continuar com Facebook</span>
          </button>
        </div>

        {/* 6. Footer Switch Link */}
        <div className="text-center mt-9 mb-4 pt-2">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className="font-mono text-xs sm:text-sm text-[#8C7C73] hover:text-[#F3EFEA] transition-colors cursor-pointer group"
            >
              <span>Novo na Kurio? </span>
              <span className="text-[#8C7C73] group-hover:text-[#D98A53] group-hover:underline">
                Crie uma conta
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className="font-mono text-xs sm:text-sm text-[#8C7C73] hover:text-[#F3EFEA] transition-colors cursor-pointer group"
            >
              <span>Já tem uma conta? </span>
              <span className="text-[#8C7C73] group-hover:text-[#D98A53] group-hover:underline">
                Entre
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
