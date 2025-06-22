'use client'

import { useState, useEffect } from 'react'

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwaInstallDismissed')
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 5000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('User accepted PWA install')
      }
      setDeferredPrompt(null)
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwaInstallDismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-5 left-5 right-5 bg-primary-green text-white p-5 rounded-xl shadow-lg z-[1500] max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-elderly-lg font-bold mb-2">📱 Instalar App</div>
          <div className="text-elderly-base opacity-90">
            Instala nuestra app para acceso más rápido y sin internet
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleInstall}
          className="bg-white text-primary-green px-5 py-3 rounded-lg font-bold text-elderly-base"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="bg-transparent text-white border-2 border-white px-5 py-3 rounded-lg font-bold text-elderly-base"
        >
          Ahora No
        </button>
      </div>
    </div>
  )
} 