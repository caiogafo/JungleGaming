import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...(handlers as any[]))

export async function enableMocking() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    quiet: true,
  })
}
