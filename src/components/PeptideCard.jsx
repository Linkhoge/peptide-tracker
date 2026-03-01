import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Check, Clock, AlertCircle, Zap } from 'lucide-react'
import { formatDistanceToNow, isPast, addDays } from 'date-fns'

function PeptideCard({ peptide, userId }) {
  const [updating, setUpdating] = useState(false)
  const nextDue = peptide.nextDue?.toDate()
  const isOverdue = nextDue && isPast(nextDue)

  const handleMarkTaken = async () => {
    setUpdating(true)
    try {
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

  return (
    <div className={`card-glow relative overflow-hidden group ${
      isOverdue ? 'border-accent-primary/50 shadow-glow-sm' : ''
    }`}>
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-accent-primary to-accent-secondary text-white text-xs px-3 py-1.5 rounded-bl-xl font-medium flex items-center gap-1 shadow-glow-sm">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-gradient transition-all">{peptide.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="badge-glow">
            {peptide.dosage}
          </span>
          <span className="badge bg-dark-bg text-gray-400 capitalize">{peptide.frequency}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {peptide.lastTaken && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check className="w-3.5 h-3.5 text-green-400" />
            </div>
            Last taken {formatDistanceToNow(peptide.lastTaken.toDate(), { addSuffix: true })}
          </div>
        )}
        {nextDue && (
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
        onClick={handleMarkTaken}
        disabled={updating}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Mark as Taken
          </>
        )}
      </button>
    </div>
  )
}

export default PeptideCard