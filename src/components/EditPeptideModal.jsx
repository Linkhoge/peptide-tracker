import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { X, Check, ToggleLeft, ToggleRight, Info } from 'lucide-react'
import PeptideInfoModal from './PeptideInfoModal'

function EditPeptideModal({ peptide, userId, onClose }) {
  const [dosage, setDosage] = useState(peptide.dosage)
  const [frequency, setFrequency] = useState(peptide.frequency)
  const [cycleEnabled, setCycleEnabled] = useState(peptide.cycleEnabled || false)
  const [cycleOnDays, setCycleOnDays] = useState(peptide.cycleOnDays || 30)
  const [cycleOffDays, setCycleOffDays] = useState(peptide.cycleOffDays || 30)
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dosage) return

    setLoading(true)
    try {
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
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 backdrop-blur-xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gradient">Edit {peptide.name}</h3>
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  className="p-1.5 rounded-lg bg-dark-bg border border-accent-primary/30 hover:border-accent-primary/50 transition-colors"
                >
                  <Info className="w-4 h-4 text-accent-primary" />
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors text-gray-400 hover:text-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

            <div className="card bg-dark-bg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-100">Cycle Mode</h4>
                  <p className="text-xs text-gray-500 mt-1">Track on/off cycling periods</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCycleEnabled(!cycleEnabled)}
                  className="p-1 transition-colors"
                >
                  {cycleEnabled ? (
                    <ToggleRight className="w-10 h-10 text-accent-primary" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-600" />
                  )}
                </button>
              </div>

              {cycleEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dark-border">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      On Cycle (days)
                    </label>
                    <input
                      type="number"
                      value={cycleOnDays}
                      onChange={(e) => setCycleOnDays(parseInt(e.target.value))}
                      min="1"
                      className="input text-sm py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Off Cycle (days)
                    </label>
                    <input
                      type="number"
                      value={cycleOffDays}
                      onChange={(e) => setCycleOffDays(parseInt(e.target.value))}
                      min="1"
                      className="input text-sm py-2"
                    />
                  </div>
                </div>
              )}
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
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {showInfo && (
        <PeptideInfoModal
          peptideName={peptide.name}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  )
}

export default EditPeptideModal