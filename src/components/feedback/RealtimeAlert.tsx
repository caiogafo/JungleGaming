import { Radio, AlertTriangle, CheckCircle, X } from 'lucide-react'
import type { RealtimeNotice } from '../../socket/useRealtimeSync'
import { cn } from '../../lib/utils'

interface RealtimeAlertProps {
  notice: RealtimeNotice | null
  onDismiss: () => void
}

export function RealtimeAlert({ notice, onDismiss }: RealtimeAlertProps) {
  if (!notice) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative flex items-center justify-between border-b px-4 py-3 text-sm font-medium transition-all animate-in slide-in-from-top-2 duration-300',
        notice.type === 'warning' && 'bg-amber-950/80 border-amber-500/40 text-amber-200',
        notice.type === 'success' && 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
        notice.type === 'info' && 'bg-surface-elevated border-border text-stone-200'
      )}
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
        {notice.type === 'warning' ? (
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold tracking-wide uppercase text-xs px-2 py-0.5 rounded bg-black/40">
            Tempo Real (Socket.IO)
          </span>
          <span>{notice.message}</span>
          <span className="text-xs opacity-60">({notice.timestamp})</span>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
        aria-label="Dispensar aviso"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
