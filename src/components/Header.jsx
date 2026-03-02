import { Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-white text-xl shadow-glow-sm group-hover:shadow-glow-md transition-all">
            T
          </div>
          <h1 className="text-2xl font-bold text-gradient">Tracker</h1>
        </button>

        <div className="flex items-center gap-3">
          <div className="group/private relative px-3 py-1.5 rounded-lg border border-accent-primary/30 bg-accent-primary/5 hover:border-accent-primary/50 hover:shadow-glow-sm transition-all duration-300 cursor-default">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-gray-300">Private Mode</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header