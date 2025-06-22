'use client'

import { useState, useEffect } from 'react'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  status: 'delivered' | 'cancelled' | 'pending'
  serviceType: 'pickup' | 'delivery'
}

const sampleOrderHistory: Order[] = [
  {
    id: 'ORD001',
    date: '2024-12-08',
    items: [
      { name: 'Pollo Guisado con Vegetales', quantity: 2, price: 350 },
      { name: 'Arroz con Habichuelas', quantity: 1, price: 220 }
    ],
    total: 920,
    status: 'delivered',
    serviceType: 'pickup'
  },
  {
    id: 'ORD002',
    date: '2024-12-05',
    items: [
      { name: 'Carne Guisada con Yuca', quantity: 1, price: 380 }
    ],
    total: 380,
    status: 'delivered',
    serviceType: 'delivery'
  },
  {
    id: 'ORD003',
    date: '2024-12-01',
    items: [
      { name: 'Pescado Frito con Tostones', quantity: 1, price: 420 },
      { name: 'Arroz con Habichuelas', quantity: 1, price: 220 }
    ],
    total: 640,
    status: 'cancelled',
    serviceType: 'pickup'
  }
]

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load orders from localStorage or API
    const loadOrders = () => {
      const saved = localStorage.getItem('comidaCaseraOrderHistory')
      if (saved) {
        try {
          setOrders(JSON.parse(saved))
        } catch (error) {
          console.error('Error parsing order history:', error)
          setOrders(sampleOrderHistory)
        }
      } else {
        setOrders(sampleOrderHistory)
        localStorage.setItem('comidaCaseraOrderHistory', JSON.stringify(sampleOrderHistory))
      }
      setLoading(false)
    }

    const timer = setTimeout(loadOrders, 500)
    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName}, ${day} de ${month}`
  }

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'delivered':
        return { icon: '✅', text: 'Entregado', className: 'text-green-700 bg-green-50 border-green-200' }
      case 'cancelled':
        return { icon: '❌', text: 'Cancelado', className: 'text-red-700 bg-red-50 border-red-200' }
      case 'pending':
        return { icon: '🕐', text: 'Pendiente', className: 'text-amber-700 bg-amber-50 border-amber-200' }
      default:
        return { icon: '❓', text: 'Desconocido', className: 'text-gray-700 bg-gray-50 border-gray-200' }
    }
  }

  const handleReorder = (order: Order) => {
    const whatsappNumber = '8293450059'
    const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
    const message = `¡Hola! Me gustaría repetir mi pedido #${order.id}:

${itemsList}

Tipo de servicio: ${order.serviceType === 'pickup' ? 'Recogida' : 'Delivery'}
Total anterior: RD$ ${order.total}

¿Está disponible para hoy?`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="text-center">
          <div className="text-elderly-2xl font-bold text-primary-green mb-4">📋 Cargando historial...</div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-2 border-gray-200 rounded-xl p-5">
                <div className="h-6 bg-gray-200 rounded mb-3 w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="text-center p-10 text-gray-600 text-elderly-lg">
          📋 No tienes pedidos anteriores aún.<br/>
          ¡Haz tu primer pedido hoy!
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-primary-green">
        <h2 className="text-elderly-2xl font-bold text-primary-green">
          📋 Mis Pedidos Anteriores
        </h2>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
          
          return (
            <div
              key={order.id}
              className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-green hover:bg-primary-green/5 transition-all"
            >
              <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                <div className="text-elderly-lg font-bold text-gray-800">
                  {formatDate(order.date)}
                </div>
                <div className={`px-3 py-1 rounded-full font-bold text-elderly-sm border-2 ${statusInfo.className}`}>
                  <span>{statusInfo.icon}</span>
                  <span className="ml-1">{statusInfo.text}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-elderly-base mb-1">{itemsList}</div>
                <div className="text-elderly-sm text-gray-600 mb-2">
                  {order.serviceType === 'pickup' ? '🏠 Recogida' : '🚚 Delivery'} • Pedido #{order.id}
                </div>
              </div>
              
              <div className="text-elderly-lg font-bold text-primary-green mb-4">
                Total: RD$ {order.total}
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleReorder(order)}
                  className="bg-primary-green text-white px-4 py-2 rounded-lg font-bold text-elderly-sm hover:bg-green-700 transition-colors min-h-[40px]"
                >
                  🔄 Volver a Pedir
                </button>
                <button
                  onClick={() => alert(`Detalles del pedido #${order.id}:\n\n${itemsList}\n\nTotal: RD$ ${order.total}\nEstado: ${statusInfo.text}`)}
                  className="bg-gray-100 text-gray-800 border-2 border-gray-200 px-4 py-2 rounded-lg font-bold text-elderly-sm hover:border-primary-green transition-colors min-h-[40px]"
                >
                  👁️ Ver Detalles
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
} 