import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { Search, Loader2, Info } from 'lucide-react'
import { searchPeptides, getCachedResults } from '../utils/searchCache'
import { getPeptideInfo } from '../data/peptideInfo'

function SearchAutocomplete({ onSelect, selectedValue, onViewInfo }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

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

  const handleSelect = (peptide) => {
    onSelect(peptide)
    setQuery('')
    setResults([])
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={selectedValue || query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search peptides..."
          className="input pl-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-accent-primary animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
          <div className="text-xs text-gray-500 mb-2">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>
          {results.map((peptide, idx) => {
            const info = getPeptideInfo(peptide.name)
            return (
              <div
                key={idx}
                className="card hover:border-accent-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0" onClick={() => handleSelect(peptide)}>
                    <div className="font-medium text-gray-100 group-hover:text-gradient transition-all mb-1">
                      {peptide.name}
                    </div>
                    {peptide.description && (
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {peptide.description}
                      </div>
                    )}
                    {info && info.dosage && (
                      <div className="text-xs text-gray-600 mt-2">
                        <span className="text-accent-primary">Typical: </span>
                        {info.dosage.standard}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {peptide.category && (
                      <span className="badge bg-dark-bg text-gray-400 text-xs capitalize">
                        {peptide.category}
                      </span>
                    )}
                    {info && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewInfo(peptide.name)
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-bg border border-accent-primary/30 hover:border-accent-primary/50 transition-colors text-xs"
                      >
                        <Info className="w-3 h-3 text-accent-primary" />
                        <span className="text-gray-400">Info</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="card text-center text-gray-500 py-8">
          No peptides found for "{query}"
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete