import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-bg-card rounded-lg shadow-md p-6
        ${hover ? 'transition-shadow hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

