'use client'

import Link from 'next/link'
import { useTheme } from './ThemeProvider'

export default function Footer() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">MaxTool</h3>
            <p className="text-sm text-text-secondary">
              Free online tools for everyday tasks. Simple, fast, and no registration required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/all-tools" className="text-text-secondary hover:text-accent">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-text-secondary hover:text-accent">
                  Popular Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-accent">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/random" className="text-text-secondary hover:text-accent">
                  Random Tools
                </Link>
              </li>
              <li>
                <Link href="/category/time" className="text-text-secondary hover:text-accent">
                  Time Tools
                </Link>
              </li>
              <li>
                <Link href="/category/text" className="text-text-secondary hover:text-accent">
                  Text Tools
                </Link>
              </li>
              <li>
                <Link href="/category/utilities" className="text-text-secondary hover:text-accent">
                  Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Theme Toggle & Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left text-sm text-text-secondary">
              <p>&copy; {new Date().getFullYear()} MaxTool. All rights reserved.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-text-primary hover:bg-secondary-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

