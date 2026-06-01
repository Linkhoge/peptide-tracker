import { differenceInDays } from 'date-fns'

export function useCycleProgress(peptide) {
  if (!peptide.cycleEnabled) return null

  const phaseStart = peptide.cycleCurrentPhaseStart?.toDate() || peptide.cycleStartDate?.toDate()
  const daysSince = differenceInDays(new Date(), phaseStart)
  const total = peptide.cycleStatus === 'on' ? peptide.cycleOnDays : peptide.cycleOffDays
  const daysRemaining = total - daysSince
  const progress = (daysSince / total) * 100

  return { daysRemaining, total, progress }
}
