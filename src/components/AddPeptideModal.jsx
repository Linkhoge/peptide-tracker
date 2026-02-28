import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { X } from 'lucide-react'
import { addDays } from 'date-fns'
import SearchAutocomplete from './SearchAutocomplete'

function AddPeptideModal({ userId, onClose }) {
  const [selectedPeptide, setSelectedPeptide] = useState(null)
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [loading, setLoading] = useState(false)

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Add New Peptide</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Peptide
            </label>
            <SearchAutocomplete
              onSelect={setSelectedPeptide}
              selectedValue={selectedPeptide?.name}
            />
          </div>

          {selectedPeptide && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 250mcg, 5mg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      frequency === 'daily'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      frequency === 'weekly'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Stack'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddPeptideModal