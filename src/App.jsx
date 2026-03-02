import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './components/HomePage'
import EmptyState from './components/EmptyState'
import AddPeptideModal from './components/AddPeptideModal'
import { Syringe } from 'lucide-react'

function App() {
  const userId = 'demo-user'
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="pt-20">
          <HomePage userId={userId} />
        </div>
      </div>
    </Router>
  )
}

export default App