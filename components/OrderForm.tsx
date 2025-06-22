'use client'

import { useState } from 'react'
import { MenuItem } from './MenuSection'

interface OrderFormProps {
  item: MenuItem
  onSubmit: (orderData: OrderData) => void
  onCancel: () => void
}

export interface OrderData {
  item: MenuItem
  quantity: number
  serviceType: 'pickup' | 'delivery'
  customerInfo: {
    name: string
    phone: string
    email?: string
    address?: string
  }
  specialInstructions?: string
  total: number
}

export function OrderForm({ item, onSubmit, onCancel }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>('pickup')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = item.price * quantity
  const deliveryFee = serviceType === 'delivery' ? 50 : 0
  const total = subtotal + deliveryFee

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Ingrese un teléfono válido (10 dígitos)'
    }

    if (serviceType === 'delivery' && !customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida para delivery'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const orderData: OrderData = {
      item,
      quantity,
      serviceType,
      customerInfo,
      specialInstructions,
      total
    }

    onSubmit(orderData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-elderly-xl font-bold text-primary-green">
            📝 Completar Pedido
          </h2>
          <button
            onClick={onCancel}
            className="text-elderly-xl text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-elderly-2xl">{item.emoji}</span>
            <div>
              <h3 className="text-elderly-lg font-bold">{item.name}</h3>
              <p className="text-elderly-base text-gray-600">RD$ {item.price} c/u</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <label className="text-elderly-base font-bold">Cantidad:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 text-gray-800 w-8 h-8 rounded-lg font-bold hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-elderly-lg font-bold w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 text-gray-800 w-8 h-8 rounded-lg font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-elderly-lg font-bold text-gray-800 border-b pb-2">
              👤 Información del Cliente
            </h3>
            
            <div>
              <label className="block text-elderly-base font-bold mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className={`w-full p-3 border-2 rounded-lg text-elderly-base min-h-[44px] ${
                  errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary-green'
                }`}
                placeholder="Ej: María González"
              />
              {errors.name && <p className="text-red-600 text-elderly-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-elderly-base font-bold mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className={`w-full p-3 border-2 rounded-lg text-elderly-base min-h-[44px] ${
                  errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary-green'
                }`}
                placeholder="Ej: 809-123-4567"
              />
              {errors.phone && <p className="text-red-600 text-elderly-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-elderly-base font-bold mb-2">
                Email (Opcional)
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-elderly-base focus:border-primary-green min-h-[44px]"
                placeholder="Ej: maria@email.com"
              />
            </div>
          </div>

          {/* Service Type */}
          <div>
            <h3 className="text-elderly-lg font-bold text-gray-800 border-b pb-2 mb-4">
              🚚 Tipo de Servicio
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-primary-green">
                <input
                  type="radio"
                  name="serviceType"
                  value="pickup"
                  checked={serviceType === 'pickup'}
                  onChange={(e) => setServiceType(e.target.value as 'pickup')}
                  className="w-5 h-5"
                />
                <div>
                  <div className="text-elderly-base font-bold">🏠 Recogida en Local</div>
                  <div className="text-elderly-sm text-gray-600">Sin costo adicional</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-primary-green">
                <input
                  type="radio"
                  name="serviceType"
                  value="delivery"
                  checked={serviceType === 'delivery'}
                  onChange={(e) => setServiceType(e.target.value as 'delivery')}
                  className="w-5 h-5"
                />
                <div>
                  <div className="text-elderly-base font-bold">🚚 Delivery a Domicilio</div>
                  <div className="text-elderly-sm text-gray-600">+RD$ 50</div>
                </div>
              </label>
            </div>
          </div>

          {/* Delivery Address */}
          {serviceType === 'delivery' && (
            <div>
              <label className="block text-elderly-base font-bold mb-2">
                Dirección de Entrega *
              </label>
              <textarea
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className={`w-full p-3 border-2 rounded-lg text-elderly-base resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-200 focus:border-primary-green'
                }`}
                rows={3}
                placeholder="Ej: Calle Principal #123, Sector Los Pinos, El Seibo"
              />
              {errors.address && <p className="text-red-600 text-elderly-sm mt-1">{errors.address}</p>}
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-elderly-base font-bold mb-2">
              Instrucciones Especiales (Opcional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-elderly-base focus:border-primary-green resize-none"
              rows={3}
              placeholder="Ej: Sin sal, extra vegetales, llamar al llegar, etc."
            />
          </div>

          {/* Order Total */}
          <div className="bg-primary-green/10 rounded-xl p-4">
            <div className="space-y-2 text-elderly-base">
              <div className="flex justify-between">
                <span>Subtotal ({quantity}x):</span>
                <span>RD$ {subtotal}</span>
              </div>
              {serviceType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>RD$ {deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-elderly-lg text-primary-green border-t pt-2">
                <span>Total a Pagar:</span>
                <span>RD$ {total}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-bold text-elderly-base hover:bg-gray-300 transition-colors min-h-[48px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-green text-white py-3 px-4 rounded-lg font-bold text-elderly-base hover:bg-green-700 transition-colors min-h-[48px]"
            >
              🛒 Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 