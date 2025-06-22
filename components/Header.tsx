'use client'

import { useEffect, useState } from 'react'

interface HeaderProps {
  onToggleFontControls: () => void
}

export function Header({ onToggleFontControls }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
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

    setCurrentDate(formatDate(new Date()))
  }, [])

  return (
    <header className="bg-primary-green text-white p-3 sm:p-4 md:p-6 sticky top-0 z-[100] shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center gap-2 sm:gap-3 md:gap-5">
          {/* Logo - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-elderly-2xl font-bold">
            <span className="text-lg sm:text-xl md:text-2xl">🍽️</span>
            <span className="text-sm sm:text-base md:text-elderly-2xl truncate">Wendy Cocina Gourmet</span>
          </div>
          
          {/* Controls - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              className="bg-white/20 border-2 border-white text-white p-1.5 sm:p-2 rounded-lg text-sm sm:text-base hover:bg-white/30 transition-colors min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px]"
              onClick={onToggleFontControls}
              title="Cambiar tamaño de letra"
            >
              🔤
            </button>
            
            {/* Date - Hidden on small mobile, visible on larger screens */}
            <div className="hidden sm:block text-right text-xs sm:text-sm md:text-elderly-lg">
              <div className="text-xs sm:text-sm opacity-90">Hoy es</div>
              <div className="text-sm sm:text-base md:text-elderly-xl font-bold leading-tight">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 