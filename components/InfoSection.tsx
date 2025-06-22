'use client'

export function InfoSection() {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-elderly-2xl font-bold text-primary-green mb-6 text-center">
        ℹ️ Información Importante
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-elderly-lg font-bold text-blue-800 mb-3">
            🕐 Horarios de Servicio
          </h3>
          <div className="text-elderly-base text-blue-700 space-y-2">
            <div><strong>Lunes a Viernes:</strong> 11:00 AM - 7:00 PM</div>
            <div><strong>Sábados:</strong> 11:00 AM - 6:00 PM</div>
            <div><strong>Domingos:</strong> 12:00 PM - 5:00 PM</div>
          </div>
        </div>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-elderly-lg font-bold text-green-800 mb-3">
            🚚 Opciones de Entrega
          </h3>
          <div className="text-elderly-base text-green-700 space-y-2">
            <div><strong>Recogida:</strong> Sin costo adicional</div>
            <div><strong>Delivery:</strong> RD$ 50 (zona urbana)</div>
            <div><strong>Tiempo:</strong> 30-45 minutos</div>
          </div>
        </div>
        
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h3 className="text-elderly-lg font-bold text-amber-800 mb-3">
            💳 Formas de Pago
          </h3>
          <div className="text-elderly-base text-amber-700 space-y-2">
            <div>• Efectivo</div>
            <div>• Transferencia bancaria</div>
            <div>• Pago móvil</div>
          </div>
        </div>
        
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-elderly-lg font-bold text-purple-800 mb-3">
            📞 Contacto
          </h3>
          <div className="text-elderly-base text-purple-700 space-y-2">
            <div><strong>WhatsApp:</strong> (809) 456-7890</div>
            <div><strong>Teléfono:</strong> (809) 456-7890</div>
            <div><strong>Ubicación:</strong> El Seibo, RD</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
        <div className="text-center">
          <div className="text-elderly-lg font-bold text-red-800 mb-2">
            ⚠️ Nota Especial
          </div>
          <p className="text-elderly-base text-red-700">
            Preparamos comidas frescas diariamente. Te recomendamos hacer tu pedido con al menos 
            30 minutos de anticipación para garantizar disponibilidad.
          </p>
        </div>
      </div>
    </section>
  )
} 