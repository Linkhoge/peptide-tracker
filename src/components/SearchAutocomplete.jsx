import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { Search, Loader2 } from 'lucide-react'
import { searchPeptides, getCachedResults } from '../utils/searchCache'

function SearchAutocomplete({ onSelect, selectedValue }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const debouncedSearch = useRef(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const cached = getCachedResults(searchQuery)
        if (cached) {
          setResults(cached)
          setLoading(false)
          return
        }

        const data = await searchPeptides(searchQuery)
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setLoading(false)
    }, 500)
  ).current

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (peptide) => {
    onSelect(peptide)
    setQuery(peptide.name)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={selectedValue || query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => {
            setShowDropdown(true)
            if (query.length >= 2) {
              debouncedSearch(query)
            }
          }}
          placeholder="Type to search peptides..."
          className="input pl-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-accent-primary animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-2 bg-dark-card border border-dark-border rounded-lg shadow-glow-md max-h-80 overflow-y-auto"
        >
          {results.map((peptide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(peptide)}
              className="w-full px-4 py-3 text-left hover:bg-dark-hover transition-colors border-b border-dark-border last:border-b-0 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-100 group-hover:text-gradient transition-all truncate">
                    {peptide.name}
                  </div>
                  {peptide.description && (
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {peptide.description}
                    </div>
                  )}
                </div>
                {peptide.category && (
                  <span className="badge bg-dark-bg text-gray-400 text-xs shrink-0 capitalize">
                    {peptide.category}
                  </span>
                )}
              </div>
            </button>
          ))}
          {results.length >= 20 && (
            <div className="px-4 py-2 text-xs text-gray-500 text-center bg-dark-bg">
              Showing top 20 results - refine search for more
            </div>
          )}
        </div>
      )}

      {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-dark-card border border-dark-border rounded-lg shadow-glow-md px-4 py-3 text-center text-gray-500">
          No peptides found for "{query}"
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete