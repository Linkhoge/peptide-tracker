import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { Search, Loader2, Info } from 'lucide-react'
import { searchPeptides, getCachedResults } from '../utils/searchCache'
import { getPeptideInfo } from '../data/peptideInfo'

function SearchAutocomplete({ onSelect, selectedValue }) {
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
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={selectedValue || query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="input pl-9 text-sm py-2.5"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-1.5 max-h-[40vh] overflow-y-auto overflow-x-hidden pr-1">
          <div className="text-xs text-gray-500 px-1 mb-1">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((peptide, idx) => {
            const info = getPeptideInfo(peptide.name)
            return (
              <div
                key={idx}
                onClick={() => handleSelect(peptide)}
                className="relative card py-2 px-3 hover:border-accent-primary/50 transition-all cursor-pointer group overflow-visible"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-100 group-hover:text-gradient transition-all">
                      {peptide.name}
                    </div>
                    {peptide.description && (
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {peptide.description}
                      </div>
                    )}
                    {info && info.dosage && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="text-accent-primary font-medium">Typical: </span>
                        {info.dosage.standard}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    {peptide.category && (
                      <span className="badge bg-dark-hover text-gray-400 text-xs capitalize">
                        {peptide.category}
                      </span>
                    )}
                    {info && (
                      <div className="relative group/tooltip">
                        <div className="p-1 rounded-lg bg-accent-primary/10 border border-accent-primary/30 cursor-help">
                          <Info className="w-3.5 h-3.5 text-accent-primary" />
                        </div>
                        <div className="absolute left-full top-0 ml-2 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-[100] pointer-events-none">
                          <div className="bg-dark-card border border-accent-primary/30 rounded-lg p-3 shadow-glow-md w-64">
                            <div className="text-xs font-semibold text-gray-100 mb-2">{peptide.name}</div>
                            {info.dosage && (
                              <div className="text-xs mb-2">
                                <span className="text-accent-primary font-medium">Dosage:</span>
                                <div className="text-gray-300 mt-0.5">{info.dosage.standard}</div>
                                {info.dosage.range && (
                                  <div className="text-gray-400 mt-0.5">Range: {info.dosage.range}</div>
                                )}
                              </div>
                            )}
                            {info.uses && info.uses.length > 0 && (
                              <div className="text-xs">
                                <span className="text-accent-primary font-medium">Uses:</span>
                                <div className="text-gray-400 mt-0.5">{info.uses.slice(0, 3).join(', ')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="card text-center text-gray-500 py-4 text-sm">
          No results for "{query}"
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete