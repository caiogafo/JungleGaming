import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { AuthForm } from './AuthForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-sm:fixed max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:top-0 max-sm:left-0 max-sm:rounded-none max-sm:border-none max-sm:overflow-y-auto max-sm:p-6 sm:max-w-[420px] w-full bg-[#140E0C] border border-[#2D201A] p-6 sm:p-8 text-[#F3EFEA] font-mono shadow-2xl rounded-2xl [&>button]:text-[#6A5D54] [&>button]:hover:text-[#F3EFEA]"
      >
        <DialogTitle className="sr-only">
          {initialMode === 'login' ? 'Entrar na Plataforma' : 'Criar Perfil de Colecionador'}
        </DialogTitle>

        <AuthForm
          initialMode={initialMode}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
