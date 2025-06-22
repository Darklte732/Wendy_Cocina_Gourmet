import { supabase } from './supabase'

export function subscribeToOrderUpdates(orderId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToMenuUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('menu-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_menu'
      },
      callback
    )
    .subscribe()
}

export function subscribeToOrderStatusHistory(orderId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`order-status-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'order_status_history',
        filter: `order_id=eq.${orderId}`
      },
      callback
    )
    .subscribe()
}

export function unsubscribeFromChannel(channel: any) {
  if (channel) {
    supabase.removeChannel(channel)
  }
} 