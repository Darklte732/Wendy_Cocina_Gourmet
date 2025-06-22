'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center'
  
  const variantClasses = {
    primary: 'bg-primary-green text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-elderly-sm',
    md: 'px-4 py-3 text-elderly-base',
    lg: 'px-6 py-4 text-elderly-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
} 