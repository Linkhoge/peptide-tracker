import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Check, Clock, AlertCircle } from 'lucide-react'
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
    <div className={`card relative overflow-hidden ${
      isOverdue ? 'ring-2 ring-danger/50' : ''
    }`}>
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-danger text-white text-xs px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{peptide.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
            {peptide.dosage}
          </span>
          <span className="capitalize">{peptide.frequency}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {peptide.lastTaken && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-success" />
            Last taken {formatDistanceToNow(peptide.lastTaken.toDate(), { addSuffix: true })}
          </div>
        )}
        {nextDue && (
          <div className={`flex items-center gap-2 text-sm ${
            isOverdue ? 'text-danger font-medium' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4" />
            Next dose {isPast(nextDue) ? 'was' : 'in'} {formatDistanceToNow(nextDue, { addSuffix: !isPast(nextDue) })}
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