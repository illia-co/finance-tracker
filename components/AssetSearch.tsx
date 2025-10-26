'use client'

import { useState, useEffect, useRef } from 'react'

interface Asset {
  symbol: string
  name: string
  exchange: string
  type: string
}

interface AssetSearchProps {
  onSelect: (asset: Asset) => void
  type: 'stocks' | 'crypto'
  placeholder?: string
}

export default function AssetSearch({ onSelect, type, placeholder }: AssetSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      searchAssets()
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query, type])

  const searchAssets = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/assets/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = await response.json()
      setResults(data)
      setShowResults(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error searching assets:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (asset: Asset) => {
    onSelect(asset)
    setQuery('')
    setResults([])
    setShowResults(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowResults(false)
      setSelectedIndex(-1)
    }, 150)
  }

  const handleFocus = () => {
    if (results.length > 0) {
      setShowResults(true)
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder || `Search ${type === 'stocks' ? 'stocks' : 'crypto'}...`}
        className="input w-full"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {results.map((asset, index) => (
            <div
              key={`${asset.symbol}-${index}`}
              onClick={() => handleSelect(asset)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{asset.name}</div>
                  <div className="text-sm text-gray-500">{asset.symbol}</div>
                </div>
                <div className="text-xs text-gray-400">{asset.exchange}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No {type === 'stocks' ? 'stocks' : 'crypto'} found
          </div>
        </div>
      )}
    </div>
  )
}
