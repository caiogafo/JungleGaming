import { io, Socket } from 'socket.io-client'
import type { NftUpdatedEvent, OrderUpdatedEvent } from '../types/events'

class RealtimeSocketService {
  private socket: Socket | null = null
  private seenEventIds = new Set<string>()
  private resourceVersions = new Map<string, number>()
  private reconnectCallbacks = new Set<() => void>()

  public init() {
    if (this.socket) return

    // Connects using standard socket.io-client options.
    // In dev / preview / demo with MSW, the WebSocket transport is intercepted by @mswjs/socket.io-binding
    this.socket = io('wss://api.junglegaming.io', {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Conectado ao servidor de tempo real')
      window.dispatchEvent(new CustomEvent('jungle:socket-status', { detail: { connected: true } }))
      // Trigger reconciliation callbacks on reconnect
      this.reconnectCallbacks.forEach((cb) => cb())
    })

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ [Socket.IO] Desconectado:', reason)
      window.dispatchEvent(new CustomEvent('jungle:socket-status', { detail: { connected: false } }))
    })
  }

  public onReconnect(callback: () => void) {
    this.reconnectCallbacks.add(callback)
    return () => {
      this.reconnectCallbacks.delete(callback)
    }
  }

  public subscribeNftUpdated(handler: (event: NftUpdatedEvent) => void) {
    if (!this.socket) this.init()

    const listener = (event: NftUpdatedEvent) => {
      // Tolerate and discard duplicate events
      if (this.seenEventIds.has(event.eventId)) {
        return
      }
      this.seenEventIds.add(event.eventId)

      // Guard against out-of-order or older version events
      const currentVersion = this.resourceVersions.get(event.nftId) || 0
      if (event.version <= currentVersion) {
        return
      }
      this.resourceVersions.set(event.nftId, event.version)

      handler(event)
    }

    this.socket?.on('nft.updated', listener)

    const windowListener = (e: Event) => {
      const customEvent = e as CustomEvent<NftUpdatedEvent>
      if (customEvent.detail) {
        listener(customEvent.detail)
      }
    }
    window.addEventListener('jungle:realtime-nft-updated', windowListener)

    return () => {
      this.socket?.off('nft.updated', listener)
      window.removeEventListener('jungle:realtime-nft-updated', windowListener)
    }
  }

  public subscribeOrderUpdated(handler: (event: OrderUpdatedEvent) => void) {
    if (!this.socket) this.init()

    const listener = (event: OrderUpdatedEvent) => {
      if (this.seenEventIds.has(event.eventId)) {
        return
      }
      this.seenEventIds.add(event.eventId)

      const currentVersion = this.resourceVersions.get(event.orderId) || 0
      if (event.version < currentVersion) {
        return
      }
      this.resourceVersions.set(event.orderId, event.version)

      handler(event)
    }

    this.socket?.on('order.updated', listener)

    const windowListener = (e: Event) => {
      const customEvent = e as CustomEvent<OrderUpdatedEvent>
      if (customEvent.detail) {
        listener(customEvent.detail)
      }
    }
    window.addEventListener('jungle:realtime-order-updated', windowListener)

    return () => {
      this.socket?.off('order.updated', listener)
      window.removeEventListener('jungle:realtime-order-updated', windowListener)
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.seenEventIds.clear()
    this.resourceVersions.clear()
  }
}

export const realtimeSocket = new RealtimeSocketService()
