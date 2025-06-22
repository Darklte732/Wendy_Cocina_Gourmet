'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-green text-white py-8 mt-12">
      <div className="container mx-auto px-5">
        <div className="text-center">
          <h3 className="text-elderly-xl font-bold mb-4">
            🍽️ wendyCosinaGorme
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-elderly-lg font-bold mb-2">📞 Contacto</h4>
              <div className="text-elderly-base space-y-1">
                <div>WhatsApp: (809) 456-7890</div>
                <div>Teléfono: (809) 456-7890</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-elderly-lg font-bold mb-2">🕐 Horarios</h4>
              <div className="text-elderly-base space-y-1">
                <div>Lun-Vie: 11:00 AM - 7:00 PM</div>
                <div>Sáb: 11:00 AM - 6:00 PM</div>
                <div>Dom: 12:00 PM - 5:00 PM</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-elderly-lg font-bold mb-2">📍 Ubicación</h4>
              <div className="text-elderly-base">
                El Seibo, República Dominicana
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <p className="text-elderly-base opacity-90">
              © {currentYear} Wendy Cocina Gourmet. Todos los derechos reservados.
            </p>
            <p className="text-elderly-sm opacity-75 mt-2">
              Comida casera hecha con amor para adultos mayores
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 