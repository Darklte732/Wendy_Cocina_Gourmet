'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { MenuSection, MenuItem } from '@/components/MenuSection'
import { OrderHistory } from '@/components/OrderHistory'
import { QuickOrder } from '@/components/QuickOrder'
import { WelcomeSection } from '@/components/WelcomeSection'
import { InfoSection } from '@/components/InfoSection'
import { Footer } from '@/components/Footer'
import { OrderForm, OrderData } from '@/components/OrderForm'
import { OrderWaitingPage } from '@/components/OrderWaitingPage'
import { FontControls } from '@/components/FontControls'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { AdminDashboard } from '@/components/AdminDashboard'

export type CurrentSection = 'menu' | 'history' | 'quick-order'
type AppState = 'main' | 'order-form' | 'order-waiting'

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<CurrentSection>('menu')
  const [appState, setAppState] = useState<AppState>('main')
  const [showFontControls, setShowFontControls] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [isOnline, setIsOnline] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const [orderId, setOrderId] = useState<string>('')
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [adminKeySequence, setAdminKeySequence] = useState('')

  // Font size management
  useEffect(() => {
    const savedFontSize = localStorage.getItem('comidaCaseraFontSize') || 'normal'
    setFontSize(savedFontSize)
    applyFontSize(savedFontSize)
  }, [])

  const applyFontSize = (size: string) => {
    document.body.classList.remove('font-small', 'font-large')
    if (size === 'small') {
      document.body.classList.add('font-small')
    } else if (size === 'large') {
      document.body.classList.add('font-large')
    }
    setFontSize(size)
    localStorage.setItem('comidaCaseraFontSize', size)
  }

  // Network status management
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    setIsOnline(navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Admin access key sequence
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = adminKeySequence + e.key.toLowerCase()
      setAdminKeySequence(newSequence)
      
      // Check for admin sequence: "admin123"
      if (newSequence.includes('admin123')) {
        setShowAdminDashboard(true)
        setAdminKeySequence('')
      }
      
      // Reset sequence if it gets too long
      if (newSequence.length > 10) {
        setAdminKeySequence('')
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [adminKeySequence])

  const handleOrderItem = (item: MenuItem) => {
    setSelectedItem(item)
    setAppState('order-form')
  }

  const handleOrderSubmit = async (orderData: OrderData) => {
    try {
      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        setCurrentOrder(orderData)
        setOrderId(result.order.id)
        setAppState('order-waiting')
      } else {
        alert('Error al procesar el pedido. Por favor intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Error al procesar el pedido. Por favor intenta de nuevo.')
    }
  }

  const handleBackToMenu = () => {
    setAppState('main')
    setCurrentSection('menu')
    setSelectedItem(null)
    setCurrentOrder(null)
    setOrderId('')
  }

  const handleCancelOrder = () => {
    setAppState('main')
    setSelectedItem(null)
  }

  // Render different states
  if (appState === 'order-form' && selectedItem) {
    return (
      <div className="min-h-screen bg-elderly-bg">
        <OrderForm
          item={selectedItem}
          onSubmit={handleOrderSubmit}
          onCancel={handleCancelOrder}
        />
      </div>
    )
  }

  if (appState === 'order-waiting' && currentOrder && orderId) {
    return (
      <OrderWaitingPage
        orderData={currentOrder}
        orderId={orderId}
        onBackToMenu={handleBackToMenu}
      />
    )
  }

  return (
    <div className="min-h-screen bg-elderly-bg">
      <Header 
        onToggleFontControls={() => setShowFontControls(!showFontControls)}
      />
      
      <FontControls
        show={showFontControls}
        currentSize={fontSize}
        onFontSizeChange={applyFontSize}
        onClose={() => setShowFontControls(false)}
      />
      
      <OfflineIndicator show={!isOnline} />
      <PWAInstallPrompt />

      {/* Admin Dashboard */}
      {showAdminDashboard && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}

      <main className="main">
        <div className="container mx-auto px-5">
          <WelcomeSection />
          
          {/* Enhanced Navigation */}
          <div className="bg-primary-green/5 rounded-2xl p-4 mb-8">
            <div className="flex gap-3 justify-center flex-wrap">
              <button 
                className={`px-5 py-2 rounded-lg font-bold transition-all min-h-[44px] border-2 border-primary-green ${
                  currentSection === 'menu' 
                    ? 'bg-primary-green text-white' 
                    : 'bg-white text-primary-green hover:bg-primary-green hover:text-white'
                }`}
                onClick={() => setCurrentSection('menu')}
              >
                🍽️ Menú de Hoy
              </button>
              <button 
                className={`px-5 py-2 rounded-lg font-bold transition-all min-h-[44px] border-2 border-primary-green ${
                  currentSection === 'history' 
                    ? 'bg-primary-green text-white' 
                    : 'bg-white text-primary-green hover:bg-primary-green hover:text-white'
                }`}
                onClick={() => setCurrentSection('history')}
              >
                📋 Mis Pedidos
              </button>
              <button 
                className={`px-5 py-2 rounded-lg font-bold transition-all min-h-[44px] border-2 border-primary-green ${
                  currentSection === 'quick-order' 
                    ? 'bg-primary-green text-white' 
                    : 'bg-white text-primary-green hover:bg-primary-green hover:text-white'
                }`}
                onClick={() => setCurrentSection('quick-order')}
              >
                ⚡ Pedido Rápido
              </button>
            </div>
          </div>

          {/* Section Content */}
          {currentSection === 'menu' && <MenuSection onOpenOrder={handleOrderItem} />}
          {currentSection === 'history' && <OrderHistory />}
          {currentSection === 'quick-order' && <QuickOrder onOpenOrder={handleOrderItem} />}
          
          <InfoSection />
        </div>
      </main>

      <Footer />
    </div>
  )
} 