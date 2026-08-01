'use client'

import { useState, useEffect } from 'react'
import { searchTools, highlightText } from '@/lib/search'
import { Tool } from '@/types'
import { debounce } from '@/lib/utils'
import Input from '@/components/ui/Input'

interface SearchBoxProps {
  onSearch?: (results: Tool[]) => void
  placeholder?: string
}

export default function SearchBox({ 
  onSearch, 
  placeholder = 'Search tools...' 
}: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])

  // Debounced search
  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim()) {
      const searchResults = searchTools(searchQuery)
      setResults(searchResults)
      onSearch?.(searchResults)
    } else {
      setResults([])
      onSearch?.([])
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {query && (
        <div className="absolute z-10 w-full mt-2 bg-bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((tool) => (
              <a
                key={tool.id}
                href={tool.path}
                className="block px-4 py-3 hover:bg-bg-hover border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex-1">
                    <div 
                      className="font-medium text-text-primary"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightText(tool.name, query) 
                      }}
                    />
                    <div 
                      className="text-sm text-text-muted"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightText(tool.description, query) 
                      }}
                    />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-text-muted mb-2">No tools found</p>
              <p className="text-sm text-text-muted">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

