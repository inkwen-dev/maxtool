import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent',
    secondary: 'bg-secondary text-text-primary hover:bg-secondary-hover focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary',
    outline: 'border-2 border-accent text-accent hover:bg-accent/10 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

