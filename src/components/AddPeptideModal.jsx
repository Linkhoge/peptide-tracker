import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { X, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import { addDays } from 'date-fns'
import SearchAutocomplete from './SearchAutocomplete'

function AddPeptideModal({ userId, onClose }) {
  const [selectedPeptide, setSelectedPeptide] = useState(null)
  const [dosageAmount, setDosageAmount] = useState('')
  const [dosageUnit, setDosageUnit] = useState('mcg')
  const [frequency, setFrequency] = useState('daily')
  const [loading, setLoading] = useState(false)
  const [cycleEnabled, setCycleEnabled] = useState(false)
  const [cycleOnDays, setCycleOnDays] = useState(30)
  const [cycleOffDays, setCycleOffDays] = useState(30)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPeptide || !dosageAmount) return

    setLoading(true)
    try {
      const now = new Date()
      const cycleDays = frequency === 'daily' ? 1 : 7
      const dosage = `${dosageAmount}${dosageUnit}`
      
      await addDoc(collection(db, 'users', userId, 'peptides'), {
        name: selectedPeptide.name,
        dosage,
        frequency,
        lastTaken: null,
        nextDue: addDays(now, cycleDays),
        takenCount: 0,
        createdAt: now,
        cycleEnabled,
        cycleOnDays: cycleEnabled ? cycleOnDays : null,
        cycleOffDays: cycleEnabled ? cycleOffDays : null,
        cycleStatus: 'on',
        cycleStartDate: now,
        cycleCurrentPhaseStart: now
      })
      
      onClose()
    } catch (error) {
      console.error('Error adding peptide:', error)
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-dark-card border border-dark-border rounded-2xl w-full shadow-glow-lg"
        style={{ maxWidth: '500px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-5 py-3 flex items-center justify-between backdrop-blur-xl z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gradient">Add Peptide</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Search Peptide
              </label>
              <SearchAutocomplete
                onSelect={setSelectedPeptide}
                selectedValue={selectedPeptide?.name}
              />
            </div>

            {selectedPeptide && (
              <>
                <div className="card bg-dark-bg border-accent-primary/20 py-2 px-3">
                  <div className="text-xs text-gray-400">
                    <span className="text-accent-primary font-medium">Selected:</span> {selectedPeptide.name}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Dosage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={dosageAmount}
                      onChange={(e) => setDosageAmount(e.target.value)}
                      placeholder="250"
                      className="input pr-24 text-sm py-2.5"
                      required
                    />
                    <select
                      value={dosageUnit}
                      onChange={(e) => setDosageUnit(e.target.value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-hover border border-dark-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:border-accent-primary focus:outline-none"
                    >
                      <option value="mcg">mcg</option>
                      <option value="mg">mg</option>
                      <option value="g">g</option>
                      <option value="IU">IU</option>
                      <option value="units">units</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('daily')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        frequency === 'weekly'
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white border-transparent shadow-glow-sm'
                          : 'bg-dark-bg text-gray-400 border-dark-border hover:border-accent-primary/50'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                <div className="card bg-dark-bg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-100">Cycle Mode</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Track on/off cycles</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCycleEnabled(!cycleEnabled)}
                      className="transition-colors"
                    >
                      {cycleEnabled ? (
                        <ToggleRight className="w-9 h-9 text-accent-primary" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {cycleEnabled && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dark-border">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          On (days)
                        </label>
                        <input
                          type="number"
                          value={cycleOnDays}
                          onChange={(e) => setCycleOnDays(parseInt(e.target.value))}
                          min="1"
                          className="input text-sm py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Off (days)
                        </label>
                        <input
                          type="number"
                          value={cycleOffDays}
                          onChange={(e) => setCycleOffDays(parseInt(e.target.value))}
                          min="1"
                          className="input text-sm py-1.5"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-2.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Add to Stack</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPeptideModal