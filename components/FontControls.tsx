'use client'

import { useEffect } from 'react'

interface FontControlsProps {
  show: boolean
  currentSize: string
  onFontSizeChange: (size: string) => void
  onClose: () => void
}

export function FontControls({ show, currentSize, onFontSizeChange, onClose }: FontControlsProps) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.font-controls') && !target.closest('.font-toggle-btn')) {
        onClose()
      }
    }

    if (show) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="font-controls fixed top-20 right-5 bg-white border-2 border-gray-200 rounded-xl p-3 shadow-lg z-[1000]">
      <div className="text-elderly-base font-bold mb-3 text-center text-gray-800">
        Tamaño de Letra
      </div>
      <div className="flex gap-2 justify-center">
        <button
          className={`px-3 py-2 rounded-md font-bold transition-all border-2 ${
            currentSize === 'small'
              ? 'bg-primary-green text-white border-primary-green'
              : 'bg-gray-100 text-gray-800 border-gray-200 hover:border-primary-green'
          }`}
          onClick={() => onFontSizeChange('small')}
        >
          A
        </button>
        <button
          className={`px-3 py-2 rounded-md font-bold transition-all border-2 text-lg ${
            currentSize === 'normal'
              ? 'bg-primary-green text-white border-primary-green'
              : 'bg-gray-100 text-gray-800 border-gray-200 hover:border-primary-green'
          }`}
          onClick={() => onFontSizeChange('normal')}
        >
          A
        </button>
        <button
          className={`px-3 py-2 rounded-md font-bold transition-all border-2 text-xl ${
            currentSize === 'large'
              ? 'bg-primary-green text-white border-primary-green'
              : 'bg-gray-100 text-gray-800 border-gray-200 hover:border-primary-green'
          }`}
          onClick={() => onFontSizeChange('large')}
        >
          A
        </button>
      </div>
    </div>
  )
} 