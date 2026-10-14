import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import type { NftUpdatedEvent, OrderUpdatedEvent } from '../types/events'

// Define the MSW WebSocket connection for Socket.IO
export const chatLink = ws.link('wss://api.junglegaming.io/socket.io')

// Set of active client socket connections in MSW
const activeClients = new Set<any>()

export const socketHandler = chatLink.addEventListener('connection', (connection) => {
  const { client } = toSocketIo(connection)
  activeClients.add(client)

  client.on('disconnect', () => {
    activeClients.delete(client)
  })

  client.on('ping', () => {
    client.emit('pong')
  })
})

/**
 * Server-side broadcaster simulating WebSocket / Socket.IO server pushes.
 * This pushes events strictly over the MSW WebSocket connection to all listening socket.io-clients.
 */
export const serverSocketEmitter = {
  broadcastNftUpdated(event: NftUpdatedEvent) {
    for (const client of activeClients) {
      try {
        client.emit('nft.updated', event)
      } catch (err) {
        console.warn('Socket emit error:', err)
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jungle:realtime-nft-updated', { detail: event }))
    }
  },

  broadcastOrderUpdated(event: OrderUpdatedEvent) {
    for (const client of activeClients) {
      try {
        client.emit('order.updated', event)
      } catch (err) {
        console.warn('Socket emit error:', err)
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jungle:realtime-order-updated', { detail: event }))
    }
  },
}
