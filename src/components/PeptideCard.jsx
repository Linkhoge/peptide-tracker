import { useState } from 'react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Check, Clock, AlertCircle, Zap, X, Pause, Play, Edit } from 'lucide-react'
import { formatDistanceToNow, isPast, addDays, differenceInDays } from 'date-fns'
import EditPeptideModal from './EditPeptideModal'

function PeptideCard({ peptide, userId }) {
  const [updating, setUpdating] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const nextDue = peptide.nextDue?.toDate()
  const isOverdue = nextDue && isPast(nextDue)

  const checkAndUpdateCycleStatus = async () => {
    if (!peptide.cycleEnabled) return

    const now = new Date()
    const phaseStart = peptide.cycleCurrentPhaseStart?.toDate() || peptide.cycleStartDate?.toDate()
    const daysSincePhaseStart = differenceInDays(now, phaseStart)

    const currentPhaseDuration = peptide.cycleStatus === 'on' ? peptide.cycleOnDays : peptide.cycleOffDays

    if (daysSincePhaseStart >= currentPhaseDuration) {
      const newStatus = peptide.cycleStatus === 'on' ? 'off' : 'on'
      await updateDoc(doc(db, 'users', userId, 'peptides', peptide.id), {
        cycleStatus: newStatus,
        cycleCurrentPhaseStart: now
      })
    }
  }

  const handleMarkTaken = async () => {
    if (peptide.cycleEnabled && peptide.cycleStatus === 'off') {
      alert('Peptide is currently off-cycle. Enable it to log doses.')
      return
    }

    setUpdating(true)
    try {
      await checkAndUpdateCycleStatus()

      const now = new Date()
      const cycleDays = peptide.frequency === 'daily' ? 1 : 7
      const newNextDue = addDays(now, cycleDays)

      await updateDoc(doc(db, 'users', userId, 'peptides', peptide.id), {
        lastTaken: now,
        nextDue: newNextDue,
        takenCount: (peptide.takenCount || 0) + 1
      })
    } catch (error) {
      console.error('Error updating peptide:', error)
    }
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Remove ${peptide.name} from your stack?`)) return

    try {
      await deleteDoc(doc(db, 'users', userId, 'peptides', peptide.id))
    } catch (error) {
      console.error('Error deleting peptide:', error)
    }
  }

  const getCycleProgress = () => {
    if (!peptide.cycleEnabled) return null

    const phaseStart = peptide.cycleCurrentPhaseStart?.toDate() || peptide.cycleStartDate?.toDate()
    const now = new Date()
    const daysSincePhaseStart = differenceInDays(now, phaseStart)
    const currentPhaseDuration = peptide.cycleStatus === 'on' ? peptide.cycleOnDays : peptide.cycleOffDays
    const daysRemaining = currentPhaseDuration - daysSincePhaseStart

    return { daysRemaining, total: currentPhaseDuration, progress: (daysSincePhaseStart / currentPhaseDuration) * 100 }
  }

  const cycleProgress = getCycleProgress()
  const isOffCycle = peptide.cycleEnabled && peptide.cycleStatus === 'off'

  return (
    <>
      <div
        className={`card-glow relative overflow-hidden group cursor-pointer ${
          isOverdue && !isOffCycle ? 'border-accent-primary/50 shadow-glow-sm' : ''
        } ${
          isOffCycle ? 'opacity-60 border-gray-600' : ''
        }`}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
        onClick={() => setShowEdit(true)}
      >
        {showDelete && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowEdit(true)
              }}
              className="p-1.5 bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/30 rounded-lg transition-all hover:scale-110"
            >
              <Edit className="w-4 h-4 text-accent-primary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all hover:scale-110 group/delete"
            >
              <X className="w-4 h-4 text-red-400 group-hover/delete:text-red-300" />
            </button>
          </div>
        )}

        {isOverdue && !isOffCycle && (
          <div className="absolute top-0 right-0 bg-gradient-to-br from-accent-primary to-accent-secondary text-white text-xs px-3 py-1.5 rounded-bl-xl font-medium flex items-center gap-1 shadow-glow-sm">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </div>
        )}

        {isOffCycle && (
          <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-bl-xl font-medium flex items-center gap-1">
            <Pause className="w-3 h-3" />
            Off Cycle
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-gradient transition-all">{peptide.name}</h3>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="badge-glow">
              {peptide.dosage}
            </span>
            <span className="badge bg-dark-bg text-gray-400 capitalize">{peptide.frequency}</span>
            {peptide.cycleEnabled && (
              <span className={`badge ${
                peptide.cycleStatus === 'on'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}>
                {peptide.cycleStatus === 'on' ? (
                  <><Play className="w-3 h-3 inline mr-1" />On Cycle</>
                ) : (
                  <><Pause className="w-3 h-3 inline mr-1" />Off Cycle</>
                )}
              </span>
            )}
          </div>
        </div>

        {cycleProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{peptide.cycleStatus === 'on' ? 'On' : 'Off'} cycle progress</span>
              <span>{cycleProgress.daysRemaining} days left</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  peptide.cycleStatus === 'on'
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-gradient-to-r from-gray-600 to-gray-500'
                }`}
                style={{ width: `${Math.min(cycleProgress.progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {peptide.lastTaken && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-3.5 h-3.5 text-green-400" />
              </div>
              Last taken {formatDistanceToNow(peptide.lastTaken.toDate(), { addSuffix: true })}
            </div>
          )}
          {nextDue && !isOffCycle && (
            <div className={`flex items-center gap-2 text-sm ${
              isOverdue ? 'text-accent-primary font-medium' : 'text-gray-400'
            }`}>
              <div className={`p-1.5 rounded-lg ${
                isOverdue ? 'bg-accent-primary/10 border border-accent-primary/20' : 'bg-dark-bg border border-dark-border'
              }`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
              Next dose {isPast(nextDue) ? 'was' : 'in'} {formatDistanceToNow(nextDue, { addSuffix: !isPast(nextDue) })}
            </div>
          )}
          {peptide.takenCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="p-1.5 rounded-lg bg-dark-bg border border-dark-border">
                <Zap className="w-3.5 h-3.5" />
              </div>
              {peptide.takenCount} dose{peptide.takenCount !== 1 ? 's' : ''} logged
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleMarkTaken()
          }}
          disabled={updating || isOffCycle}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {isOffCycle ? 'Off Cycle' : 'Mark as Taken'}
            </>
          )}
        </button>
      </div>

      {showEdit && (
        <EditPeptideModal
          peptide={peptide}
          userId={userId}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}

export default PeptideCard