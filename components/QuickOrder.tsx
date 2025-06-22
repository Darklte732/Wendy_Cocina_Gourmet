'use client'

import { MenuItem } from './MenuSection'

interface QuickOrderProps {
  onOpenOrder: (item: MenuItem) => void
}

interface QuickOrderTemplate {
  id: string
  name: string
  items: string[]
  estimatedTotal: number
  emoji: string
}

const quickOrderTemplates: QuickOrderTemplate[] = [
  {
    id: 'template1',
    name: 'Almuerzo Familiar',
    items: ['Pollo Guisado', 'Arroz con Habichuelas', 'Ensalada'],
    estimatedTotal: 850,
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: 'template2',
    name: 'Comida Individual',
    items: ['Carne Guisada', 'Arroz Blanco'],
    estimatedTotal: 430,
    emoji: '🍽️'
  },
  {
    id: 'template3',
    name: 'Especial del Mar',
    items: ['Pescado Frito', 'Tostones', 'Ensalada'],
    estimatedTotal: 570,
    emoji: '🐟'
  }
]

export function QuickOrder({ onOpenOrder }: QuickOrderProps) {
  const handleQuickOrder = (template: QuickOrderTemplate) => {
    // Create a mock MenuItem for the template
    const mockItem: MenuItem = {
      id: parseInt(template.id.replace('template', '')),
      name: template.name,
      description: `Combo incluye: ${template.items.join(', ')}`,
      price: template.estimatedTotal,
      image: null,
      emoji: template.emoji,
      availability: 'available',
      availablePortions: 10
    }
    
    onOpenOrder(mockItem)
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-elderly-2xl font-bold text-primary-green mb-6 text-center">
        ⚡ Pedidos Rápidos
      </h2>
      
      <p className="text-elderly-base text-gray-600 text-center mb-8">
        Selecciona uno de nuestros combos populares para hacer tu pedido rápidamente
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickOrderTemplates.map((template) => (
          <div
            key={template.id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary-green hover:bg-primary-green/5 transition-all cursor-pointer"
            onClick={() => handleQuickOrder(template)}
          >
            <div className="text-center mb-4">
              <div className="text-elderly-3xl mb-3">{template.emoji}</div>
              <h3 className="text-elderly-lg font-bold mb-3 text-gray-800">
                {template.name}
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="text-elderly-base text-gray-600 mb-2">Incluye:</div>
              <ul className="text-elderly-sm text-gray-700">
                {template.items.map((item, index) => (
                  <li key={index} className="mb-1">• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="text-elderly-lg font-bold text-primary-green text-center mb-4">
              Desde RD$ {template.estimatedTotal}
            </div>
            
            <button className="w-full bg-primary-green text-white py-3 px-4 rounded-lg font-bold text-elderly-base hover:bg-green-700 transition-colors min-h-[48px]">
              🛒 Hacer Pedido
            </button>
          </div>
        ))}
      </div>
      
              <div className="mt-8 p-6 bg-primary-green/10 border-2 border-primary-green rounded-xl">
        <div className="text-center">
          <div className="text-elderly-lg font-bold text-primary-green mb-2">
            ℹ️ Combos Populares
          </div>
          <p className="text-elderly-base text-gray-700">
            Estos son nuestros combos más pedidos. Puedes personalizar tu orden en el siguiente paso.
          </p>
        </div>
      </div>
    </section>
  )
} 