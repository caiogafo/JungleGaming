import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 pt-8" aria-label="Navegação da paginação">
      <Button
        variant="outline"
        size="iconSm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => {
        const isCurrent = p === currentPage
        return (
          <Button
            key={p}
            variant={isCurrent ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 p-0 text-xs font-mono font-bold ${
              isCurrent ? 'shadow-amber-500/20' : 'text-stone-300'
            }`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="iconSm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
