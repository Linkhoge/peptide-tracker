import { useState } from 'react'
import { updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore'
import { Check, Clock, AlertCircle, Zap, X, Pause, Play, Edit } from 'lucide-react'
import { formatDistanceToNow, isPast, addDays, differenceInDays } from 'date-fns'
import EditPeptideModal from './EditPeptideModal'
import { useCycleProgress } from '../hooks/useCycleProgress'
import { peptideRef } from '../utils/peptideDoc'

function PeptideCard({ peptide, userId }) {
  const [updating, setUpdating] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const nextDue = peptide.nextDue?.toDate()
  const isOverdue = nextDue && isPast(nextDue)
  const isOffCycle = peptide.cycleEnabled && peptide.cycleStatus === 'off'
  const cycleProgress = useCycleProgress(peptide)
  const ref = peptideRef(userId, peptide.id)

  const checkAndUpdateCycle = async () => {
    if (!peptide.cycleEnabled) return
    const phaseStart = peptide.cycleCurrentPhaseStart?.toDate() || peptide.cycleStartDate?.toDate()
    const days = differenceInDays(new Date(), phaseStart)
    const duration = peptide.cycleStatus === 'on' ? peptide.cycleOnDays : peptide.cycleOffDays
    if (days >= duration) {
      await updateDoc(ref, {
        cycleStatus: peptide.cycleStatus === 'on' ? 'off' : 'on',
        cycleCurrentPhaseStart: new Date()
      })
    }
  }

  const handleMarkTaken = async () => {
    if (isOffCycle) {
      alert('Peptide is currently off-cycle.')
      return
    }
    setUpdating(true)
    try {
      await checkAndUpdateCycle()
      const now = new Date()
      await updateDoc(ref, {
        lastTaken: now,
        nextDue: addDays(now, peptide.frequency === 'daily' ? 1 : 7),
        takenCount: (peptide.takenCount || 0) + 1,
        doseHistory: arrayUnion({ takenAt: now, cycleStatus: peptide.cycleStatus || 'on', dosage: peptide.dosage })
      })
    } catch (error) {
      console.error('Error marking taken:', error)
    }
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Remove ${peptide.name} from your stack?`)) return
    setIsDeleting(true)
    await new Promise(r => setTimeout(r, 300))
    try {
      await deleteDoc(ref)
    } catch (error) {
      console.error('Error deleting:', error)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        className={`card-glow relative overflow-hidden group cursor-pointer transition-all duration-300
          ${isOverdue && !isOffCycle ? 'border-accent-primary/50 shadow-glow-sm' : ''}
          ${isOffCycle ? 'opacity-60 border-gray-600' : ''}
          ${isDeleting ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => setShowEdit(true)}
      >
        {/* Action buttons */}
        {showActions && (
          <div className="absolute top-2 right-2 z-10 flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); setShowEdit(true) }}
              className="p-1.5 bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/30 rounded-lg transition-all hover:scale-110"
            >
              <Edit className="w-3.5 h-3.5 text-accent-primary" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete() }}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all hover:scale-110"
            >
              <X className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        )}

        {/* Status badge */}
        {!showActions && (
          isOffCycle ? (
            <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-bl-xl font-medium flex items-center gap-1">
              <Pause className="w-3 h-3" /> Off Cycle
            </div>
          ) : isOverdue ? (
            <div className="absolute top-0 right-0 bg-gradient-to-br from-accent-primary to-accent-secondary text-white text-xs px-2.5 py-1 rounded-bl-xl font-medium flex items-center gap-1 shadow-glow-sm">
              <AlertCircle className="w-3 h-3" /> Overdue
            </div>
          ) : null
        )}

        {/* Name + badges */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-100 mb-1.5 group-hover:text-gradient transition-all">{peptide.name}</h3>
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <span className="badge-glow text-xs">{peptide.dosage}</span>
            <span className="badge bg-dark-bg text-gray-400 capitalize text-xs">{peptide.frequency}</span>
            {peptide.cycleEnabled && (
              <span className={`badge text-xs ${
                peptide.cycleStatus === 'on'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}>
                {peptide.cycleStatus === 'on'
                  ? <><Play className="w-3 h-3 inline mr-0.5" />On</>
                  : <><Pause className="w-3 h-3 inline mr-0.5" />Off</>}
              </span>
            )}
          </div>
        </div>

        {/* Cycle progress bar */}
        {cycleProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{peptide.cycleStatus === 'on' ? 'On' : 'Off'} cycle</span>
              <span>{cycleProgress.daysRemaining}d left</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  peptide.cycleStatus === 'on'
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-gradient-to-r from-gray-600 to-gray-500'
                }`}
                style={{ width: `${Math.min(cycleProgress.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2 mb-4">
          {peptide.lastTaken && (
            <StatRow icon={<Check className="w-3 h-3 text-green-400" />} iconBg="bg-green-500/10 border-green-500/20">
              Last {formatDistanceToNow(peptide.lastTaken.toDate(), { addSuffix: true })}
            </StatRow>
          )}
          {nextDue && !isOffCycle && (
            <StatRow
              icon={<Clock className="w-3 h-3" />}
              iconBg={isOverdue ? 'bg-accent-primary/10 border-accent-primary/20' : 'bg-dark-bg border-dark-border'}
              textClass={isOverdue ? 'text-accent-primary font-medium' : 'text-gray-400'}
            >
              Next {isPast(nextDue) ? 'was' : 'in'} {formatDistanceToNow(nextDue, { addSuffix: !isPast(nextDue) })}
            </StatRow>
          )}
          {peptide.takenCount > 0 && (
            <StatRow icon={<Zap className="w-3 h-3" />} iconBg="bg-dark-bg border-dark-border" textClass="text-gray-500">
              {peptide.takenCount} dose{peptide.takenCount !== 1 ? 's' : ''}
            </StatRow>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleMarkTaken() }}
          disabled={updating || isOffCycle}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
        >
          {updating
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <><Check className="w-4 h-4" />{isOffCycle ? 'Off Cycle' : 'Mark Taken'}</>
          }
        </button>
      </div>

      {showEdit && (
        <EditPeptideModal peptide={peptide} userId={userId} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}

function StatRow({ icon, iconBg, textClass = 'text-gray-400', children }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${textClass}`}>
      <div className={`p-1 rounded-lg border ${iconBg}`}>{icon}</div>
      {children}
    </div>
  )
}

export default PeptideCard
