'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getAllTools, getToolsByCategory } from '@/lib/tools-data'
import SearchBox from './SearchBox'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false)
  const allTools = getAllTools()
  const categories = ['Random', 'Time', 'Text', 'Utilities']
  
  return (
    <nav className="bg-bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">MaxTool</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/all-tools"
              className="text-text-primary hover:text-accent transition-colors"
            >
              All Tools
            </Link>
            <div 
              className="relative py-2 -my-2"
              onMouseEnter={() => setCategoriesMenuOpen(true)}
              onMouseLeave={() => setCategoriesMenuOpen(false)}
            >
              <button className="text-text-primary hover:text-accent transition-colors px-3 py-1">
                Categories
              </button>
              {categoriesMenuOpen && (
                <>
                  {/* Invisible bridge to connect button and menu - prevents gap */}
                  <div className="absolute top-full left-0 right-0 h-2"></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-bg-card rounded-lg shadow-lg border border-border z-50">
                    {categories.map((category) => {
                      const categoryTools = getToolsByCategory(category)
                      return (
                        <Link
                          key={category}
                          href={`/category/${category.toLowerCase()}`}
                          className="block px-4 py-2 hover:bg-bg-hover first:rounded-t-lg last:rounded-b-lg text-text-primary transition-colors"
                        >
                          {category} ({categoryTools.length})
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
            <Link
              href="/popular"
              className="text-text-primary hover:text-accent transition-colors"
            >
              Popular
            </Link>
            <Link
              href="/about"
              className="text-text-primary hover:text-accent transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-text-primary hover:bg-bg-hover"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link
                href="/all-tools"
                className="px-4 py-2 text-text-primary hover:bg-bg-hover rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Tools
              </Link>
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-text-muted mb-2">Categories</div>
                {categories.map((category) => {
                  const categoryTools = getToolsByCategory(category)
                  return (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-text-primary hover:bg-bg-hover rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category} ({categoryTools.length})
                    </Link>
                  )
                })}
              </div>
              <Link
                href="/popular"
                className="px-4 py-2 text-text-primary hover:bg-bg-hover rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Popular
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-text-primary hover:bg-bg-hover rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="pb-4">
          <SearchBox />
        </div>
      </div>
    </nav>
  )
}

