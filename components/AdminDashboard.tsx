'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  service_type: 'pickup' | 'delivery'
  delivery_address?: string
  total_amount: number
  status: 'submitted' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
  created_at: string
  order_items: Array<{
    menu_item_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

interface AdminDashboardProps {
  onClose: () => void
}

const statusOptions = [
  { value: 'submitted', label: '📝 Recibida', color: 'bg-blue-100 text-blue-800' },
  { value: 'confirmed', label: '✅ Confirmada', color: 'bg-green-100 text-green-800' },
  { value: 'preparing', label: '👨‍🍳 Preparando', color: 'bg-orange-100 text-orange-800' },
  { value: 'ready', label: '🍽️ Lista', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivering', label: '🚚 En camino', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'completed', label: '🎉 Completada', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: '❌ Cancelada', color: 'bg-red-100 text-red-800' }
]

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      params.append('limit', '50')

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          notes: `Estado cambiado a ${newStatus} desde el panel de administración`
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update the order in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus as any }
              : order
          )
        )
        
        // Show success message
        alert('Estado de la orden actualizado exitosamente')
      } else {
        alert('Error al actualizar el estado de la orden')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar el estado de la orden')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-green text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏪 Panel de Administración</h1>
            <p className="text-green-100">Gestión de Pedidos - Wendy Cocina Gourmet</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Órdenes</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  RD$ {summary.totalRevenue?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Ingresos</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.statusCounts?.preparing || 0}
                </div>
                <div className="text-sm text-gray-600">Preparando</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.statusCounts?.ready || 0}
                </div>
                <div className="text-sm text-gray-600">Listas</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-primary-green text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Cargando órdenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600">No hay órdenes para mostrar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-green transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">#{order.order_number}</h3>
                        <p className="text-gray-600">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">👤 Cliente</h4>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-gray-600">{order.customer_phone}</p>
                        {order.service_type === 'delivery' && order.delivery_address && (
                          <p className="text-gray-600 text-sm">📍 {order.delivery_address}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">🍽️ Pedido</h4>
                        {order.order_items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.menu_item_name} - RD$ {item.total_price}
                          </div>
                        ))}
                        <div className="font-bold mt-2">
                          Total: RD$ {order.total_amount}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          onClick={() => updateOrderStatus(order.id, status.value)}
                          disabled={order.status === status.value}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            order.status === status.value
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-primary-green hover:text-white'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 