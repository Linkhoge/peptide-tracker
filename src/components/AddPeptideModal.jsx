import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { X, Check, Info } from 'lucide-react'
import { addDays } from 'date-fns'
import SearchAutocomplete from './SearchAutocomplete'
import PeptideInfoModal from './PeptideInfoModal'

function AddPeptideModal({ userId, onClose }) {
  const [selectedPeptide, setSelectedPeptide] = useState(null)
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPeptide || !dosage) return

    setLoading(true)
    try {
      const now = new Date()
      const cycleDays = frequency === 'daily' ? 1 : 7
      
      await addDoc(collection(db, 'users', userId, 'peptides'), {
        name: selectedPeptide.name,
        dosage,
        frequency,
        lastTaken: null,
        nextDue: addDays(now, cycleDays),
        takenCount: 0,
        createdAt: now
      })
      
      onClose()
    } catch (error) {
      console.error('Error adding peptide:', error)
    }
    setLoading(false)
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 flex items-center justify-between backdrop-blur-xl">
            <h3 className="text-xl font-bold text-gradient">Add New Peptide</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Search Peptide
                </label>
                {selectedPeptide && (
                  <button
                    type="button"
                    onClick={() => setShowInfo(true)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-bg border border-accent-primary/30 hover:border-accent-primary/50 transition-colors group"
                  >
                    <Info className="w-4 h-4 text-accent-primary group-hover:animate-pulse" />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300">View Info</span>
                  </button>
                )}
              </div>
              <SearchAutocomplete
                onSelect={setSelectedPeptide}
                selectedValue={selectedPeptide?.name}
              />
            </div>

            {selectedPeptide && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 250mcg, 5mg"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFrequency('daily')}
                      className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                        frequency === 'daily'
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white border-transparent shadow-glow-sm'
                          : 'bg-dark-bg text-gray-400 border-dark-border hover:border-accent-primary/50'
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('weekly')}
                      className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                        frequency === 'weekly'
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white border-transparent shadow-glow-sm'
                          : 'bg-dark-bg text-gray-400 border-dark-border hover:border-accent-primary/50'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Add to Stack
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {showInfo && selectedPeptide && (
        <PeptideInfoModal
          peptideName={selectedPeptide.name}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  )
}

export default AddPeptideModal