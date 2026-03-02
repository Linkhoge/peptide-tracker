import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { X, Check, ToggleLeft, ToggleRight } from 'lucide-react'

function EditPeptideModal({ peptide, userId, onClose }) {
  const parseDosage = (dosageStr) => {
    const match = dosageStr.match(/^([\d.]+)([a-zA-Z]+)$/)
    if (match) {
      return { amount: match[1], unit: match[2] }
    }
    return { amount: dosageStr, unit: 'mcg' }
  }

  const parsed = parseDosage(peptide.dosage)
  const [dosageAmount, setDosageAmount] = useState(parsed.amount)
  const [dosageUnit, setDosageUnit] = useState(parsed.unit)
  const [frequency, setFrequency] = useState(peptide.frequency)
  const [cycleEnabled, setCycleEnabled] = useState(peptide.cycleEnabled || false)
  const [cycleOnDays, setCycleOnDays] = useState(peptide.cycleOnDays || 30)
  const [cycleOffDays, setCycleOffDays] = useState(peptide.cycleOffDays || 30)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dosageAmount) return

    setLoading(true)
    try {
      const dosage = `${dosageAmount}${dosageUnit}`
      await updateDoc(doc(db, 'users', userId, 'peptides', peptide.id), {
        dosage,
        frequency,
        cycleEnabled,
        cycleOnDays: cycleEnabled ? cycleOnDays : null,
        cycleOffDays: cycleEnabled ? cycleOffDays : null,
      })
      
      onClose()
    } catch (error) {
      console.error('Error updating peptide:', error)
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-dark-card border border-dark-border rounded-2xl w-full shadow-glow-lg"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-5 py-3 backdrop-blur-xl z-10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gradient">Edit {peptide.name}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                <span className="text-sm">Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPeptideModal