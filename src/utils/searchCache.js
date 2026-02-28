const CACHE_PREFIX = 'peptide_search_'
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000

export const searchPeptides = async (query) => {
  try {
    const response = await fetch(`https://api.peppyhq.com/peptides/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      const mockResults = generateMockResults(query)
      setCachedResults(query, mockResults)
      return mockResults
    }

    const data = await response.json()
    const results = data.results || data.peptides || []
    setCachedResults(query, results)
    return results
  } catch (error) {
    console.error('Peptide search error:', error)
    const mockResults = generateMockResults(query)
    setCachedResults(query, mockResults)
    return mockResults
  }
}

const generateMockResults = (query) => {
  const commonPeptides = [
    { name: 'BPC-157', description: 'Body Protection Compound - Healing and recovery' },
    { name: 'TB-500', description: 'Thymosin Beta-4 - Tissue repair and regeneration' },
    { name: 'GHK-Cu', description: 'Copper Peptide - Hair growth and skin regeneration' },
    { name: 'Retatrutide', description: 'Triple agonist - Metabolic health' },
    { name: 'Semaglutide', description: 'GLP-1 agonist - Weight management' },
    { name: 'Tirzepatide', description: 'Dual agonist - Metabolic health' },
    { name: 'PT-141', description: 'Melanocortin agonist - Various applications' },
    { name: 'Ipamorelin', description: 'Growth hormone secretagogue' },
    { name: 'CJC-1295', description: 'Growth hormone releasing hormone analog' },
    { name: 'Melanotan II', description: 'Melanocortin receptor agonist' }
  ]

  return commonPeptides.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)
}

export const getCachedResults = (query) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + query.toLowerCase())
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + query.toLowerCase())
      return null
    }

    return data
  } catch {
    return null
  }
}

const setCachedResults = (query, data) => {
  try {
    localStorage.setItem(
      CACHE_PREFIX + query.toLowerCase(),
      JSON.stringify({ data, timestamp: Date.now() })
    )
  } catch (error) {
    console.error('Cache storage error:', error)
  }
}