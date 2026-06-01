import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { initializeAnonymousAuth } from './firebase/auth'
import Header from './components/Header'
import HomePage from './components/HomePage'

function App() {
  const [userId, setUserId] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        try {
          const newUser = await initializeAnonymousAuth()
          setUserId(newUser.uid)
        } catch (error) {
          console.error('Auth failed:', error)
        }
      }
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="pt-20">
          {userId && <HomePage userId={userId} />}
        </div>
      </div>
    </Router>
  )
}

export default App
