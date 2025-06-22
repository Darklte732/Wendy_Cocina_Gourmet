'use client'

import { useState, useEffect } from 'react'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image?: string | null
  emoji: string
  availability: 'available' | 'limited' | 'sold-out'
  availablePortions: number
}

interface MenuSectionProps {
  onOpenOrder: (item: MenuItem) => void
}

export function MenuSection({ onOpenOrder }: MenuSectionProps) {
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<MenuItem[]>([])
  const [todaysSpecials, setTodaysSpecials] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMenuItems()
    loadFavorites()
  }, [])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/menu')
      const data = await response.json()

      if (data.success) {
        setTodaysSpecials(data.menuItems)
      } else {
        setError('Error al cargar el menú')
      }
    } catch (error) {
      console.error('Error loading menu:', error)
      setError('Error al cargar el menú')
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = () => {
    // Load favorites from localStorage or API in the future
    const savedFavorites = localStorage.getItem('comidaCaseraFavorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }

  const getAvailabilityInfo = (availability: string, portions: number) => {
    switch(availability) {
      case 'available':
        return {
          icon: '✅',
          text: `Disponible (${portions} porciones)`,
          className: 'text-green-700 bg-green-50 border-green-200'
        }
      case 'limited':
        return {
          icon: '⚠️',
          text: `¡Pocas disponibles! (${portions} porciones)`,
          className: 'text-amber-700 bg-amber-50 border-amber-200'
        }
      case 'sold-out':
        return {
          icon: '❌',
          text: 'Agotado por hoy',
          className: 'text-red-700 bg-red-50 border-red-200'
        }
      default:
        return {
          icon: '❓',
          text: 'Consultar disponibilidad',
          className: 'text-gray-700 bg-gray-50 border-gray-200'
        }
    }
  }

  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    
    return `${dayName}, ${day} de ${month} ${year}`
  }

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="text-center mb-8 pb-6 border-b-4 border-primary-green">
          <h2 className="text-elderly-3xl font-bold text-primary-green mb-3">
            🍽️ Menú de Hoy
          </h2>
          <p className="text-elderly-lg text-gray-600">
            {formatDate(new Date())}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6 animate-pulse">
              <div className="w-full h-60 bg-gray-200 rounded-xl mb-5"></div>
              <div className="h-8 bg-gray-200 rounded mb-3 w-4/5"></div>
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/5"></div>
              <div className="h-9 bg-gray-200 rounded mx-auto w-2/5 my-5"></div>
              <div className="h-14 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="text-center mb-8 pb-6 border-b-4 border-primary-green">
          <h2 className="text-elderly-3xl font-bold text-primary-green mb-3">
            🍽️ Menú de Hoy
          </h2>
          <p className="text-elderly-lg text-gray-600">
            {formatDate(new Date())}
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-elderly-4xl mb-4">😔</div>
          <h3 className="text-elderly-xl font-bold text-gray-700 mb-4">
            {error}
          </h3>
          <p className="text-elderly-base text-gray-600 mb-6">
            No pudimos cargar el menú en este momento. Por favor intenta de nuevo.
          </p>
          <button
            onClick={loadMenuItems}
            className="bg-primary-green text-white px-8 py-4 rounded-xl text-elderly-lg font-bold hover:bg-primary-green/90 transition-colors min-h-[44px]"
          >
            🔄 Intentar de Nuevo
          </button>
        </div>
      </section>
    )
  }

  if (todaysSpecials.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="text-center mb-8 pb-6 border-b-4 border-primary-green">
          <h2 className="text-elderly-3xl font-bold text-primary-green mb-3">
            🍽️ Menú de Hoy
          </h2>
          <p className="text-elderly-lg text-gray-600">
            {formatDate(new Date())}
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-elderly-4xl mb-4">🍽️</div>
          <h3 className="text-elderly-xl font-bold text-gray-700 mb-4">
            No hay menú disponible
          </h3>
          <p className="text-elderly-base text-gray-600 mb-6">
            Estamos preparando el menú de hoy. Por favor vuelve más tarde.
          </p>
          <button
            onClick={loadMenuItems}
            className="bg-primary-green text-white px-8 py-4 rounded-xl text-elderly-lg font-bold hover:bg-primary-green/90 transition-colors min-h-[44px]"
          >
            🔄 Actualizar
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
      <div className="text-center mb-8 pb-6 border-b-4 border-primary-green">
        <h2 className="text-elderly-3xl font-bold text-primary-green mb-3">
          🍽️ Menú de Hoy
        </h2>
        <p className="text-elderly-lg text-gray-600">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="bg-primary-green/5 border-2 border-primary-green rounded-2xl p-6 mb-8">
          <h3 className="text-elderly-lg font-bold text-primary-green mb-4 text-center">
            ⭐ Tus Favoritos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((item) => (
              <div
                key={`fav-${item.id}`}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-primary-green hover:bg-primary-green/5 transition-all"
                onClick={() => onOpenOrder(item)}
              >
                <div className="text-elderly-2xl mb-2">{item.emoji}</div>
                <div className="text-elderly-base font-bold mb-2">{item.name}</div>
                <div className="text-elderly-sm text-primary-green font-bold">
                  RD$ {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Specials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todaysSpecials.map((special) => {
          const availabilityInfo = getAvailabilityInfo(special.availability, special.availablePortions)
          const isAvailable = special.availability === 'available' || special.availability === 'limited'
          
          return (
            <div
              key={special.id}
              className="bg-white border-4 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-primary-green transition-all relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary-green text-white px-3 py-1 rounded-full text-elderly-sm font-bold">
                Especial del Día
              </div>

              {/* Image */}
              <div className="w-full h-60 bg-gradient-to-br from-primary-green to-green-400 rounded-xl mb-5 flex items-center justify-center text-white font-bold text-elderly-3xl border-2 border-gray-200">
                {special.image ? (
                  <img 
                    src={special.image} 
                    alt={special.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  special.emoji
                )}
              </div>

              {/* Content */}
              <h3 className="text-elderly-xl font-bold mb-3 text-gray-800">
                {special.name}
              </h3>
              
              <p className="text-elderly-base text-gray-600 mb-5 leading-relaxed">
                {special.description}
              </p>

              {/* Availability */}
              <div className={`flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full font-bold text-elderly-sm border-2 ${availabilityInfo.className}`}>
                <span>{availabilityInfo.icon}</span>
                <span>{availabilityInfo.text}</span>
              </div>

              {/* Price */}
              <div className="text-elderly-2xl font-bold text-primary-green text-center mb-5 py-3 bg-primary-green/10 rounded-lg">
                RD$ {special.price}
              </div>

              {/* Order Button */}
              <button
                className={`w-full py-4 px-6 rounded-xl font-bold text-elderly-lg min-h-[56px] transition-all flex items-center justify-center gap-3 ${
                  isAvailable
                    ? 'bg-primary-green text-white hover:bg-green-700 hover:-translate-y-1 shadow-lg hover:shadow-primary-green/30'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!isAvailable}
                onClick={() => isAvailable && onOpenOrder(special)}
              >
                <span>🛒</span>
                <span>{isAvailable ? 'Hacer Pedido' : 'Agotado'}</span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
} 