import { useState, useEffect } from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Sparkles, Target, TrendingUp, Calendar } from 'lucide-react'
import PeptideCard from '../components/PeptideCard'
import AddPeptideModal from '../components/AddPeptideModal'
import ScrollingBanner from '../components/ScrollingBanner'
import EmptyState from '../components/EmptyState'

function Dashboard() {
  const { currentUser } = useAuth()
  const [peptides, setPeptides] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, 'users', currentUser.uid, 'peptides'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const peptidesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPeptides(peptidesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (peptides.length === 0) {
    return (
      <>
        <ScrollingBanner />
        <EmptyState onAddClick={() => setShowAddModal(true)} />
        {showAddModal && (
          <AddPeptideModal
            userId={currentUser.uid}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <ScrollingBanner />
      
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-2">Your Stack</h2>
            <p className="text-gray-400">Track {peptides.length} peptide{peptides.length !== 1 ? 's' : ''} with precision</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Peptide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peptides.map(peptide => (
            <PeptideCard
              key={peptide.id}
              peptide={peptide}
              userId={currentUser.uid}
            />
          ))}
        </div>
      </div>

      {showAddModal && (
        <AddPeptideModal
          userId={currentUser.uid}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard