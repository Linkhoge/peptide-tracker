import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { initializeAnonymousAuth } from './firebase/auth'
import { Shield, LayoutDashboard, TrendingUp } from 'lucide-react'
import HomePage from './components/HomePage'
import Analytics from './pages/Analytics'
import AnnouncementBanner from './components/AnnouncementBanner'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      } else {
        initializeAnonymousAuth().then(() => setLoading(false))
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full shadow-glow-md animate-pulse-glow"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-dark-card/50 border-b border-dark-border sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-sm">
                  <span className="text-xl font-bold">T</span>
                </div>
                <h1 className="text-2xl font-bold text-gradient">
                  Tracker
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'home'
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-gray-400 hover:text-white hover:bg-dark-card'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentPage('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'analytics'
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-gray-400 hover:text-white hover:bg-dark-card'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Analytics</span>
                </button>
              </nav>
            </div>
            
            {user?.isAnonymous && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg">
                <Shield className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-gray-400">Private Mode</span>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-2 mt-4 border-t border-dark-border pt-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'analytics'
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </button>
          </nav>
        </div>
      </header>
      <AnnouncementBanner />
      <main>
        {currentPage === 'home' ? (
          <HomePage userId={user?.uid} />
        ) : (
          <Analytics userId={user?.uid} />
        )}
      </main>
    </div>
  )
}

export default App