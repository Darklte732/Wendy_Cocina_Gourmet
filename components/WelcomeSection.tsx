'use client'

export function WelcomeSection() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = '8293450059'
    const message = '¡Hola! Me gustaría saber qué tienen disponible hoy para recoger'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="text-center mb-9 p-9 bg-white rounded-2xl shadow-lg">
      <h1 className="text-elderly-3xl font-bold mb-5 text-primary-green">
        ¡Comida Casera Fresca Todos los Días!
      </h1>
      <p className="text-elderly-lg text-gray-600 mb-7 max-w-2xl mx-auto leading-relaxed">
        <strong>👩‍🍳 Wendy</strong> prepara comidas caseras frescas cada día con ingredientes de la mejor calidad. 
        Cada plato es hecho con amor y cariño, como en casa de la abuela.
        <br/><br/>
        <strong>🛒 Haz tu pedido por la app - Te confirmamos por WhatsApp</strong>
        <br/>
        <strong>🏠 Servicio principalmente de RECOGIDA - Delivery disponible</strong>
      </p>
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-10 rounded-xl text-elderly-lg transition-all inline-flex items-center gap-4 min-h-[56px] shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
      >
        <span>📱</span>
        <span>Preguntar por WhatsApp</span>
      </button>
    </section>
  )
} 