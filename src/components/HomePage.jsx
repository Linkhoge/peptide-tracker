import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Plus, Sparkles } from 'lucide-react'
import PeptideCard from './PeptideCard'
import AddPeptideModal from './AddPeptideModal'

function HomePage({ userId }) {
  const [peptides, setPeptides] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const q = query(collection(db, 'users', userId, 'peptides'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const peptideData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPeptides(peptideData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-dark-card rounded-xl border border-dark-border"></div>
          <div className="h-32 bg-dark-card rounded-xl border border-dark-border"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {peptides.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-12 relative">
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-64 h-64 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full"></div>
            </div>
            <div className="relative">
              <Sparkles className="w-16 h-16 text-accent-primary mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl font-bold text-gradient mb-4">Start Your First Stack</h2>
              <p className="text-gray-400 max-w-md mx-auto text-lg">
                Track peptide cycles with precision. Monitor dosages, schedules, and adherence in one clean interface.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow-lg hover:shadow-glow-lg transition-all duration-300 hover:scale-110 animate-pulse-glow"
          >
            <Plus className="w-12 h-12 text-white absolute inset-0 m-auto transition-transform group-hover:rotate-90 duration-500" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gradient mb-2">Your Stack</h2>
              <p className="text-gray-400">
                <span className="text-accent-primary font-semibold">{peptides.length}</span> peptide{peptides.length !== 1 ? 's' : ''} in active cycle
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Peptide
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peptides.map((peptide) => (
              <PeptideCard key={peptide.id} peptide={peptide} userId={userId} />
            ))}
          </div>
        </div>
      )}
      {isModalOpen && (
        <AddPeptideModal
          userId={userId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default HomePage