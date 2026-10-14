import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/20 text-amber-400 border border-amber-500/30',
        secondary: 'border-transparent bg-stone-800 text-stone-300',
        destructive: 'border-transparent bg-destructive/20 text-red-400 border border-red-500/30',
        outline: 'text-stone-300 border border-border',
        success: 'border-transparent bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        rarityCommon: 'bg-stone-800/80 text-stone-300 border border-stone-700',
        rarityRare: 'bg-blue-900/40 text-blue-400 border border-blue-600/40',
        rarityEpic: 'bg-purple-900/40 text-purple-300 border border-purple-600/40',
        rarityLegendary: 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
