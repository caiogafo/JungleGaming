import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { enableMocking } from './mocks/browser'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const status = error?.response?.status ?? error?.status
        // Não retentar em erros 401 ou 403
        if (status === 401 || status === 403) return false
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    },
  },
})

async function initApp() {
  try {
    // Inicia worker do MSW para interceptar REST e WebSockets do Socket.IO no navegador
    await enableMocking()
  } catch (err) {
    console.warn('Aviso: Mock Service Worker não pôde ser ativado:', err)
  }

  const rootElement = document.getElementById('root')
  if (!rootElement) return

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

initApp()
