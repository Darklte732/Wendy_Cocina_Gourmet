'use client'

import { useState } from 'react'
import { MenuItem } from './MenuSection'

interface OrderModalProps {
  item: MenuItem
  onClose: () => void
}

export function OrderModal({ item, onClose }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>('pickup')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const total = item.price * quantity
  const deliveryFee = serviceType === 'delivery' ? 50 : 0
  const finalTotal = total + deliveryFee

  const handleOrder = () => {
    const whatsappNumber = '8293450059'
    const message = `¡Hola! Me gustaría hacer el siguiente pedido:

🍽️ *${item.name}*
📝 Descripción: ${item.description}
🔢 Cantidad: ${quantity}
💰 Precio unitario: RD$ ${item.price}
💰 Subtotal: RD$ ${total}

🚚 Tipo de servicio: ${serviceType === 'pickup' ? 'Recogida' : 'Delivery'}
${serviceType === 'delivery' ? `💰 Costo de delivery: RD$ ${deliveryFee}` : ''}
💰 *Total: RD$ ${finalTotal}*

${specialInstructions ? `📋 Instrucciones especiales: ${specialInstructions}` : ''}

¿Está disponible para hoy?`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-elderly-xl font-bold text-primary-green">
            Hacer Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-elderly-xl text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="text-elderly-2xl mb-2">{item.emoji}</div>
          <h3 className="text-elderly-lg font-bold mb-2">{item.name}</h3>
          <p className="text-elderly-base text-gray-600 mb-3">{item.description}</p>
          <div className="text-elderly-lg font-bold text-primary-green">
            RD$ {item.price} por porción
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-elderly-base font-bold mb-2">
              Cantidad:
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 text-gray-800 w-10 h-10 rounded-lg font-bold text-elderly-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-elderly-lg font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 text-gray-800 w-10 h-10 rounded-lg font-bold text-elderly-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-elderly-base font-bold mb-2">
              Tipo de servicio:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="serviceType"
                  value="pickup"
                  checked={serviceType === 'pickup'}
                  onChange={(e) => setServiceType(e.target.value as 'pickup')}
                  className="w-5 h-5"
                />
                <span className="text-elderly-base">🏠 Recogida (Sin costo adicional)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="serviceType"
                  value="delivery"
                  checked={serviceType === 'delivery'}
                  onChange={(e) => setServiceType(e.target.value as 'delivery')}
                  className="w-5 h-5"
                />
                <span className="text-elderly-base">🚚 Delivery (+RD$ 50)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-elderly-base font-bold mb-2">
              Instrucciones especiales (opcional):
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: Sin sal, extra vegetales, etc."
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-elderly-base resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="space-y-2 text-elderly-base">
            <div className="flex justify-between">
              <span>Subtotal ({quantity}x):</span>
              <span>RD$ {total}</span>
            </div>
            {serviceType === 'delivery' && (
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>RD$ {deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-elderly-lg text-primary-green border-t pt-2">
              <span>Total:</span>
              <span>RD$ {finalTotal}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-bold text-elderly-base hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleOrder}
            className="flex-1 bg-primary-green text-white py-3 px-4 rounded-lg font-bold text-elderly-base hover:bg-green-700 transition-colors"
          >
            📱 Pedir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
} 