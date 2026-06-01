import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { addDays } from 'date-fns'
import { ModalShell } from './shared/ModalShell'
import { DosageInput } from './shared/DosageInput'
import { FrequencyToggle } from './shared/FrequencyToggle'
import { CycleSettings } from './shared/CycleSettings'
import { SubmitButton } from './shared/SubmitButton'
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
      await addDoc(collection(db, 'users', userId, 'peptides'), {
        name: selectedPeptide.name,
        dosage: `${dosageAmount}${dosageUnit}`,
        frequency,
        lastTaken: null,
        nextDue: addDays(now, frequency === 'daily' ? 1 : 7),
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
    <ModalShell title="Add Peptide" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Search Peptide</label>
          <SearchAutocomplete onSelect={setSelectedPeptide} selectedValue={selectedPeptide?.name} />
        </div>

        {selectedPeptide && (
          <>
            <div className="card bg-dark-bg border-accent-primary/20 py-2 px-3">
              <div className="text-xs text-gray-400">
                <span className="text-accent-primary font-medium">Selected:</span> {selectedPeptide.name}
              </div>
            </div>

            <DosageInput
              amount={dosageAmount}
              unit={dosageUnit}
              onAmountChange={setDosageAmount}
              onUnitChange={setDosageUnit}
            />

            <FrequencyToggle value={frequency} onChange={setFrequency} />

            <CycleSettings
              enabled={cycleEnabled}
              onToggle={() => setCycleEnabled(v => !v)}
              onDays={cycleOnDays}
              offDays={cycleOffDays}
              onOnDaysChange={setCycleOnDays}
              onOffDaysChange={setCycleOffDays}
            />

            <SubmitButton loading={loading} label="Add to Stack" />
          </>
        )}
      </form>
    </ModalShell>
  )
}

export default AddPeptideModal
