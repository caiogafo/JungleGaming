import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { realtimeSocket } from './socketClient'
import type { NftUpdatedEvent, OrderUpdatedEvent } from '../types/events'

export interface RealtimeNotice {
  id: string
  message: string
  timestamp: string
  type: 'info' | 'warning' | 'success'
}

export function useRealtimeSync() {
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(true)
  const [latestNotice, setLatestNotice] = useState<RealtimeNotice | null>(null)

  useEffect(() => {
    realtimeSocket.init()

    const handleSocketStatus = (e: any) => {
      setIsConnected(e.detail?.connected ?? false)
    }
    window.addEventListener('jungle:socket-status', handleSocketStatus)

    // Reconcile active resources on reconnect
    const unsubscribeReconnect = realtimeSocket.onReconnect(() => {
      console.log('🔄 Reconciliando dados com a API REST após reconexão...')
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    })

    // Listen for NFT updates (price, stock)
    const unsubscribeNft = realtimeSocket.subscribeNftUpdated((event: NftUpdatedEvent) => {
      console.log('🔔 [Realtime] NFT atualizado:', event)

      // 1. Instantly update all NFT list and detail cache in TanStack Query
      queryClient.setQueriesData({ queryKey: ['nfts'] }, (oldData: any) => {
        if (!oldData) return oldData
        if (oldData.items && Array.isArray(oldData.items)) {
          return {
            ...oldData,
            items: oldData.items.map((item: any) => {
              if (item.id === event.nftId) {
                return {
                  ...item,
                  basePriceEth: event.changes.basePriceEth || item.basePriceEth,
                  editions: item.editions?.map((ed: any) => ({
                    ...ed,
                    priceEth: event.changes.basePriceEth || ed.priceEth,
                    availableSupply:
                      event.changes.availableSupply !== undefined ? event.changes.availableSupply : ed.availableSupply,
                  })),
                }
              }
              return item
            }),
          }
        }
        if (Array.isArray(oldData)) {
          return oldData.map((item: any) =>
            item.id === event.nftId
              ? {
                  ...item,
                  basePriceEth: event.changes.basePriceEth || item.basePriceEth,
                }
              : item
          )
        }
        return oldData
      })

      queryClient.setQueryData(['nft', event.nftId], (oldNft: any) => {
        if (!oldNft) return oldNft
        return {
          ...oldNft,
          basePriceEth: event.changes.basePriceEth || oldNft.basePriceEth,
          editions: oldNft.editions?.map((ed: any) => ({
            ...ed,
            priceEth: event.changes.basePriceEth || ed.priceEth,
            availableSupply:
              event.changes.availableSupply !== undefined ? event.changes.availableSupply : ed.availableSupply,
          })),
        }
      })

      // 2. Invalidate catalog & details
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['nft', event.nftId] })

      // 3. Invalidate cart & quote to reflect changes
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })

      const priceMsg = event.changes.basePriceEth ? `Novo preço: ${event.changes.basePriceEth} ETH.` : ''
      const supplyMsg = event.changes.availableSupply !== undefined ? `Estoque: ${event.changes.availableSupply} unid.` : ''

      setLatestNotice({
        id: event.eventId,
        message: `Atenção: O NFT #${event.nftId} teve atualizações em tempo real! ${priceMsg} ${supplyMsg}`.trim(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'warning',
      })
    })

    // Listen for Order updates
    const unsubscribeOrder = realtimeSocket.subscribeOrderUpdated((event: OrderUpdatedEvent) => {
      console.log('🔔 [Realtime] Pedido atualizado:', event)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', event.orderId] })

      setLatestNotice({
        id: event.eventId,
        message: `Pedido #${event.orderId} status: ${event.status === 'confirmed' ? 'Confirmado com sucesso!' : 'Transação recusada.'}`,
        timestamp: new Date().toLocaleTimeString(),
        type: event.status === 'confirmed' ? 'success' : 'warning',
      })
    })

    return () => {
      window.removeEventListener('jungle:socket-status', handleSocketStatus)
      unsubscribeReconnect()
      unsubscribeNft()
      unsubscribeOrder()
    }
  }, [queryClient])

  return {
    isConnected,
    latestNotice,
    clearNotice: () => setLatestNotice(null),
  }
}
