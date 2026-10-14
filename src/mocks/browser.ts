import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...(handlers as any[]))

export async function enableMocking() {
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
