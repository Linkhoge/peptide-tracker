import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Plus } from 'lucide-react'
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
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {peptides.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Start Your First Stack</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Track your peptide cycles with precision. Add your first peptide to begin monitoring dosages and schedules.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-10 h-10 text-white absolute inset-0 m-auto transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Your Stack</h2>
              <p className="text-gray-500 mt-1">{peptides.length} peptide{peptides.length !== 1 ? 's' : ''} in cycle</p>
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