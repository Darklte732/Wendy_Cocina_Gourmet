'use client'

interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  label?: string
}

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false,
  className = '',
  label
}: InputProps) {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-elderly-base font-bold mb-2 text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full p-3 border-2 border-gray-200 rounded-lg text-elderly-base focus:border-primary-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      />
    </div>
  )
} 