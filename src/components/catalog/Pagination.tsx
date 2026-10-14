import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Always show pages 1, 2, 3, 4 as requested in the design specification
  const pages = [1, 2, 3, 4]

  return (
    <nav className="flex items-center justify-end gap-1.5 pt-8" aria-label="Paginação">
      {pages.map((p) => {
        const isCurrent = p === currentPage
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-mono text-xs transition-colors ${
              isCurrent
                ? 'bg-[#D98A53] text-black font-bold'
                : 'bg-transparent border border-white/15 text-[#9E968F] hover:border-[#D98A53] hover:text-[#F3EFEA]'
            }`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages || 4))}
        disabled={currentPage >= (totalPages || 4)}
        className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-mono text-xs bg-transparent border border-white/15 text-[#9E968F] hover:border-[#D98A53] hover:text-[#F3EFEA] disabled:opacity-40 disabled:hover:border-white/15"
        aria-label="Próxima página"
      >
        &gt;
      </button>
    </nav>
  )
}
