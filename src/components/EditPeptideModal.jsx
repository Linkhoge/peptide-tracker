import { useState } from 'react'
import { updateDoc } from 'firebase/firestore'
import { ModalShell } from './shared/ModalShell'
import { DosageInput } from './shared/DosageInput'
import { FrequencyToggle } from './shared/FrequencyToggle'
import { CycleSettings } from './shared/CycleSettings'
import { SubmitButton } from './shared/SubmitButton'
import { parseDosage, peptideRef } from '../utils/peptideDoc'

function EditPeptideModal({ peptide, userId, onClose }) {
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
      await updateDoc(peptideRef(userId, peptide.id), {
        dosage: `${dosageAmount}${dosageUnit}`,
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
    <ModalShell title={`Edit ${peptide.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
        <SubmitButton loading={loading} label="Save Changes" />
      </form>
    </ModalShell>
  )
}

export default EditPeptideModal
