import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { debounce } from 'lodash'
import { Search, Loader2, Info } from 'lucide-react'
import { searchPeptides, getCachedResults } from '../utils/searchCache'
import { getPeptideInfo } from '../data/peptideInfo'

function Tooltip({ peptide, info, position }) {
  if (!position) return null

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
      }}
    >
      <div className="bg-dark-card border border-accent-primary/50 rounded-lg p-3 shadow-glow-lg w-64 animate-in fade-in duration-150">
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
    </div>,
    document.body
  )
}

function SearchAutocomplete({ onSelect, selectedValue }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hoveredPeptide, setHoveredPeptide] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState(null)
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
    setHoveredPeptide(null)
    setTooltipPosition(null)
  }

  const handleMouseMove = (e, peptide) => {
    setHoveredPeptide(peptide)
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredPeptide(null)
    setTooltipPosition(null)
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
                className="relative card py-2 px-3 hover:border-accent-primary/50 transition-all cursor-pointer group"
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
                      <div
                        onMouseMove={(e) => handleMouseMove(e, peptide)}
                        onMouseLeave={handleMouseLeave}
                        className="p-1 rounded-lg bg-accent-primary/10 border border-accent-primary/30 cursor-help transition-all hover:bg-accent-primary/20 hover:border-accent-primary/50"
                      >
                        <Info className="w-3.5 h-3.5 text-accent-primary" />
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

      {hoveredPeptide && tooltipPosition && (
        <Tooltip
          peptide={hoveredPeptide}
          info={getPeptideInfo(hoveredPeptide.name)}
          position={tooltipPosition}
        />
      )}
    </div>
  )
}

export default SearchAutocomplete