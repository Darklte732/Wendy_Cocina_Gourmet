'use client'

interface NavigationProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const sections = [
    { id: 'welcome', name: 'Inicio', icon: '🏠' },
    { id: 'menu', name: 'Menú', icon: '🍽️' },
    { id: 'quick-order', name: 'Pedidos Rápidos', icon: '⚡' },
    { id: 'history', name: 'Mis Pedidos', icon: '📋' }
  ]

  return (
    <nav className="bg-white p-4 border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-elderly-base
                transition-all duration-200 min-h-[48px]
                ${currentSection === section.id
                  ? 'bg-primary-green text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
            >
              <span className="text-elderly-lg">{section.icon}</span>
              <span className="hidden sm:inline">{section.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
} 