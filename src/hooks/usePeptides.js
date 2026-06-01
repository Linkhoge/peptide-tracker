import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'

export function usePeptides(userId) {
  const [peptides, setPeptides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    const q = query(collection(db, 'users', userId, 'peptides'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPeptides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return () => unsubscribe()
  }, [userId])

  return { peptides, loading }
}
