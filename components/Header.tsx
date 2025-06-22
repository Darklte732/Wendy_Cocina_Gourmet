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
    <header className="bg-primary-green text-white p-6 sticky top-0 z-[100] shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center flex-wrap gap-5">
          <div className="flex items-center gap-4 text-elderly-2xl font-bold">
            🍽️ <span>Wendy Cocina Gourmet</span>
          </div>
          
          <div className="flex items-center gap-5">
            <button 
              className="bg-white/20 border-2 border-white text-white p-2 rounded-lg text-elderly-lg hover:bg-white/30 transition-colors min-h-[40px] min-w-[40px]"
              onClick={onToggleFontControls}
              title="Cambiar tamaño de letra"
            >
              🔤
            </button>
            
            <div className="text-right text-elderly-lg">
              <div className="text-elderly-base opacity-90">Hoy es</div>
              <div className="text-elderly-xl font-bold">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 