'use client'

import { createContext, useContext, useEffect, useState, useLayoutEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Function to update theme - optimized to prevent flash
  const updateTheme = (newTheme: Theme, skipStorage = false) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      // Update DOM synchronously to prevent flash
      if (newTheme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }
      if (!skipStorage) {
        localStorage.setItem('theme', newTheme)
      }
    }
  }

  // Use useLayoutEffect to apply theme synchronously before render, avoid flash
  useLayoutEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    // Apply theme immediately, skip localStorage write on initial load
    updateTheme(initialTheme, true)
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  // Update DOM when theme changes - use useLayoutEffect for synchronous update
  useLayoutEffect(() => {
    if (mounted) {
      updateTheme(theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Always provide context, even during server-side rendering
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

