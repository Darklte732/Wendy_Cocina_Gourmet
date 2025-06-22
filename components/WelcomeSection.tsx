'use client'

export function WelcomeSection() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = '8293450059'
    const message = '¡Hola! Me gustaría saber qué tienen disponible hoy para recoger'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="text-center mb-4 sm:mb-6 md:mb-9 p-3 sm:p-5 md:p-9 bg-white rounded-xl sm:rounded-2xl shadow-lg">
      <h1 className="text-lg sm:text-xl md:text-elderly-3xl font-bold mb-3 sm:mb-4 md:mb-5 text-primary-green leading-tight">
        ¡Comida Casera Fresca Todos los Días!
      </h1>
      <p className="text-sm sm:text-base md:text-elderly-lg text-gray-600 mb-4 sm:mb-5 md:mb-7 max-w-2xl mx-auto leading-relaxed">
        <strong>👩‍🍳 Wendy</strong> prepara comidas caseras frescas cada día con ingredientes de la mejor calidad. 
        Cada plato es hecho con amor y cariño, como en casa de la abuela.
        <br/><br/>
        <strong>🛒 Haz tu pedido por la app - Te confirmamos por WhatsApp</strong>
        <br/>
        <strong>🏠 Servicio principalmente de RECOGIDA - Delivery disponible</strong>
      </p>
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-elderly-lg transition-all inline-flex items-center gap-2 sm:gap-3 md:gap-4 min-h-[44px] sm:min-h-[52px] md:min-h-[56px] shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
      >
        <span>📱</span>
        <span className="hidden sm:block">Preguntar por WhatsApp</span>
        <span className="block sm:hidden">WhatsApp</span>
      </button>
    </section>
  )
} 