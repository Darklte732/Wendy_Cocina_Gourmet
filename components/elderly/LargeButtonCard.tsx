'use client'

interface LargeButtonCardProps {
  title: string
  icon: string
  onClick: () => void
}

export default function LargeButtonCard({ title, icon, onClick }: LargeButtonCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:border-primary-green hover:bg-primary-green/5 transition-all min-h-[120px]"
    >
      <div className="text-elderly-3xl mb-4">{icon}</div>
      <div className="text-elderly-lg font-bold text-gray-800">{title}</div>
    </button>
  )
} 