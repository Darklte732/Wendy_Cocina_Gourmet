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
      <section className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-8 shadow-lg mb-4 sm:mb-6 md:mb-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8 pb-3 sm:pb-4 md:pb-6 border-b-2 sm:border-b-4 border-primary-green">
          <h2 className="text-lg sm:text-xl md:text-elderly-3xl font-bold text-primary-green mb-2 sm:mb-3">
            🍽️ Menú de Hoy
          </h2>
          <p className="text-sm sm:text-base md:text-elderly-lg text-gray-600">
            {formatDate(new Date())}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 animate-pulse">
              <div className="w-full h-40 sm:h-48 md:h-60 bg-gray-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-5"></div>
              <div className="h-4 sm:h-6 md:h-8 bg-gray-200 rounded mb-2 sm:mb-3 w-4/5"></div>
              <div className="h-3 sm:h-4 md:h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 md:h-5 bg-gray-200 rounded mb-2 w-3/5"></div>
              <div className="h-6 sm:h-8 md:h-9 bg-gray-200 rounded mx-auto w-2/5 my-3 sm:my-4 md:my-5"></div>
              <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded"></div>
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
    <section className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-8 shadow-lg mb-4 sm:mb-6 md:mb-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8 pb-3 sm:pb-4 md:pb-6 border-b-2 sm:border-b-4 border-primary-green">
        <h2 className="text-lg sm:text-xl md:text-elderly-3xl font-bold text-primary-green mb-2 sm:mb-3">
          🍽️ Menú de Hoy
        </h2>
        <p className="text-sm sm:text-base md:text-elderly-lg text-gray-600">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Favorites Section - Mobile Optimized */}
      {favorites.length > 0 && (
        <div className="bg-primary-green/5 border-2 border-primary-green rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-sm sm:text-base md:text-elderly-lg font-bold text-primary-green mb-3 sm:mb-4 text-center">
            ⭐ Tus Favoritos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {favorites.map((item) => (
              <div
                key={`fav-${item.id}`}
                className="bg-white border-2 border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center cursor-pointer hover:border-primary-green hover:bg-primary-green/5 transition-all"
                onClick={() => onOpenOrder(item)}
              >
                <div className="text-lg sm:text-xl md:text-elderly-2xl mb-1 sm:mb-2">{item.emoji}</div>
                <div className="text-xs sm:text-sm md:text-elderly-base font-bold mb-1 sm:mb-2 leading-tight">{item.name}</div>
                <div className="text-xs sm:text-sm md:text-elderly-sm text-primary-green font-bold">
                  RD$ {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Specials Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {todaysSpecials.map((special) => {
          const availabilityInfo = getAvailabilityInfo(special.availability, special.availablePortions)
          const isAvailable = special.availability === 'available' || special.availability === 'limited'
          
          return (
            <div
              key={special.id}
              className="bg-white border-2 sm:border-4 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl hover:border-primary-green transition-all relative overflow-hidden"
            >
              {/* Badge - Mobile Optimized */}
              <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-primary-green text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-elderly-sm font-bold">
                <span className="block sm:hidden">⭐</span>
                <span className="hidden sm:block">Especial del Día</span>
              </div>

              {/* Image - Mobile Optimized */}
              <div className="w-full h-40 sm:h-48 md:h-60 bg-gradient-to-br from-primary-green to-green-400 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-5 flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-elderly-3xl border-2 border-gray-200">
                {special.image ? (
                  <img 
                    src={special.image} 
                    alt={special.name}
                    className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                  />
                ) : (
                  special.emoji
                )}
              </div>

              {/* Content - Mobile Optimized */}
              <h3 className="text-sm sm:text-base md:text-elderly-xl font-bold mb-2 sm:mb-3 text-gray-800 leading-tight">
                {special.name}
              </h3>
              
              <p className="text-xs sm:text-sm md:text-elderly-base text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {special.description}
              </p>

              {/* Availability - Mobile Optimized */}
              <div className={`flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm md:text-elderly-sm border-2 ${availabilityInfo.className}`}>
                <span>{availabilityInfo.icon}</span>
                <span className="hidden sm:block">{availabilityInfo.text}</span>
              </div>

              {/* Price - Mobile Optimized */}
              <div className="text-lg sm:text-xl md:text-elderly-2xl font-bold text-primary-green text-center mb-3 sm:mb-4 md:mb-5 py-2 sm:py-3 bg-primary-green/10 rounded-lg">
                RD$ {special.price}
              </div>

              {/* Order Button - Mobile Optimized */}
              <button
                className={`w-full py-3 sm:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-elderly-lg min-h-[44px] sm:min-h-[52px] md:min-h-[56px] transition-all flex items-center justify-center gap-2 sm:gap-3 ${
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