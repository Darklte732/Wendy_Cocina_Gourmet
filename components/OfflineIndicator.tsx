'use client'

interface OfflineIndicatorProps {
  show: boolean
}

export function OfflineIndicator({ show }: OfflineIndicatorProps) {
  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center font-bold text-elderly-base z-[2000]">
      📴 Sin conexión - Algunas funciones pueden no estar disponibles
    </div>
  )
} 