'use client'

import { useState, useEffect } from 'react'
import { OrderData } from './OrderForm'

interface OrderWaitingPageProps {
  orderData: OrderData
  orderId: string
  onBackToMenu: () => void
}

type OrderStatus = 'submitted' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

interface StatusInfo {
  icon: string
  title: string
  description: string | ((orderData: OrderData) => string)
  color: string
  bgColor: string
}

const statusConfig: Record<OrderStatus, StatusInfo> = {
  submitted: {
    icon: '📝',
    title: 'Pedido Enviado',
    description: 'Hemos recibido tu pedido y lo estamos revisando',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  confirmed: {
    icon: '✅',
    title: 'Pedido Confirmado',
    description: 'Tu pedido ha sido confirmado y está en cola de preparación',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200'
  },
  preparing: {
    icon: '👨‍🍳',
    title: 'Preparando tu Comida',
    description: 'Nuestro chef está preparando tu pedido con mucho cariño',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200'
  },
  ready: {
    icon: '🍽️',
    title: 'Pedido Listo',
    description: (orderData: OrderData) => orderData.serviceType === 'pickup' 
      ? 'Tu pedido está listo para recoger' 
      : 'Tu pedido está listo y en camino',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200'
  },
  completed: {
    icon: '🎉',
    title: 'Pedido Completado',
    description: '¡Gracias por tu pedido! Esperamos que disfrutes tu comida',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200'
  },
  cancelled: {
    icon: '❌',
    title: 'Pedido Cancelado',
    description: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200'
  }
}

export function OrderWaitingPage({ orderData, orderId, onBackToMenu }: OrderWaitingPageProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('submitted')
  const [estimatedTime, setEstimatedTime] = useState(45)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch order details and set up real-time updates
  useEffect(() => {
    fetchOrderDetails()
    
    // Set up polling for order updates
    const interval = setInterval(fetchOrderDetails, 5000) // Poll every 5 seconds
    
    return () => clearInterval(interval)
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`)
      const data = await response.json()

      if (data.success) {
        setOrderDetails(data.order)
        setCurrentStatus(data.order.status as OrderStatus)
        setEstimatedTime(data.order.estimatedTime || 0)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setLoading(false)
    }
  }

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentStatusInfo = statusConfig[currentStatus]
  const description = typeof currentStatusInfo.description === 'function' 
    ? currentStatusInfo.description(orderData) 
    : currentStatusInfo.description

  const handleContactSupport = () => {
    const whatsappNumber = '8293450059'
    const orderNumber = orderDetails?.orderNumber || orderId
    const message = `Hola, tengo una consulta sobre mi pedido #${orderNumber}:

📋 Pedido: ${orderData.item.name} (x${orderData.quantity})
👤 Cliente: ${orderData.customerInfo.name}
📞 Teléfono: ${orderData.customerInfo.phone}
🚚 Servicio: ${orderData.serviceType === 'pickup' ? 'Recogida' : 'Delivery'}
💰 Total: RD$ ${orderData.total}

¿Podrían ayudarme?`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-elderly-bg p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="text-center">
              <h1 className="text-elderly-2xl font-bold text-primary-green mb-2">
                🛒 Estado de tu Pedido
              </h1>
              <p className="text-elderly-lg text-gray-600">
                Cargando información...
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center py-12">
              <div className="animate-spin text-elderly-3xl mb-4">⏳</div>
              <p className="text-elderly-lg text-gray-600">
                Obteniendo el estado de tu pedido...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-elderly-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <h1 className="text-elderly-2xl font-bold text-primary-green mb-2">
              🛒 Estado de tu Pedido
            </h1>
            <p className="text-elderly-lg text-gray-600">
              Pedido #{orderDetails?.orderNumber || orderId}
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className={`rounded-2xl p-6 shadow-lg mb-6 border-2 ${currentStatusInfo.bgColor}`}>
          <div className="text-center">
            <div className="text-elderly-3xl mb-4">{currentStatusInfo.icon}</div>
            <h2 className={`text-elderly-xl font-bold mb-3 ${currentStatusInfo.color}`}>
              {currentStatusInfo.title}
            </h2>
            <p className={`text-elderly-base ${currentStatusInfo.color}`}>
              {description}
            </p>
            
            {estimatedTime > 0 && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-elderly-base font-bold">
                  ⏱️ Tiempo estimado restante: {estimatedTime} minutos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-elderly-lg font-bold text-gray-800 mb-4 border-b pb-2">
            📋 Resumen del Pedido
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-elderly-xl">{orderData.item.emoji}</span>
              <div className="flex-1">
                <div className="text-elderly-base font-bold">{orderData.item.name}</div>
                <div className="text-elderly-sm text-gray-600">
                  Cantidad: {orderData.quantity} | RD$ {orderData.item.price} c/u
                </div>
              </div>
              <div className="text-elderly-base font-bold">
                RD$ {orderData.item.price * orderData.quantity}
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between text-elderly-base">
                <span>Subtotal:</span>
                <span>RD$ {orderData.item.price * orderData.quantity}</span>
              </div>
              {orderData.serviceType === 'delivery' && (
                <div className="flex justify-between text-elderly-base">
                  <span>Delivery:</span>
                  <span>RD$ 50</span>
                </div>
              )}
              <div className="flex justify-between text-elderly-lg font-bold text-primary-green border-t pt-2 mt-2">
                <span>Total:</span>
                <span>RD$ {orderData.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-elderly-lg font-bold text-gray-800 mb-4 border-b pb-2">
            👤 Información de Entrega
          </h3>
          
          <div className="space-y-2 text-elderly-base">
            <div><strong>Cliente:</strong> {orderData.customerInfo.name}</div>
            <div><strong>Teléfono:</strong> {orderData.customerInfo.phone}</div>
            {orderData.customerInfo.email && (
              <div><strong>Email:</strong> {orderData.customerInfo.email}</div>
            )}
            <div>
              <strong>Servicio:</strong> {orderData.serviceType === 'pickup' ? '🏠 Recogida' : '🚚 Delivery'}
            </div>
            {orderData.serviceType === 'delivery' && orderData.customerInfo.address && (
              <div><strong>Dirección:</strong> {orderData.customerInfo.address}</div>
            )}
            {orderData.specialInstructions && (
              <div><strong>Instrucciones:</strong> {orderData.specialInstructions}</div>
            )}
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-elderly-lg font-bold text-gray-800 mb-4 border-b pb-2">
            📈 Progreso del Pedido
          </h3>
          
          <div className="space-y-4">
            {Object.entries(statusConfig).slice(0, 4).map(([status, info], index) => {
              const isCompleted = ['submitted', 'confirmed', 'preparing', 'ready'].indexOf(currentStatus) >= index
              const isCurrent = status === currentStatus
              
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-elderly-sm font-bold ${
                    isCompleted ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-elderly-base font-bold ${
                      isCurrent ? 'text-primary-green' : isCompleted ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {info.title}
                    </div>
                    {isCurrent && (
                      <div className="text-elderly-sm text-gray-600">
                        Tiempo transcurrido: {formatTime(elapsedTime)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContactSupport}
            className="w-full bg-primary-green text-white py-4 px-6 rounded-lg font-bold text-elderly-base hover:bg-green-700 transition-colors min-h-[48px]"
          >
            📞 Contactar Soporte
          </button>
          
          <button
            onClick={onBackToMenu}
            className="w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-bold text-elderly-base hover:bg-gray-300 transition-colors min-h-[48px]"
          >
            🍽️ Volver al Menú
          </button>
        </div>
      </div>
    </div>
  )
} 