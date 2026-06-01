import { useState, useRef, useEffect } from 'react'
import { Plus, Calendar, TrendingUp, Shield, Clock } from 'lucide-react'
import PeptideCard from './PeptideCard'
import AddPeptideModal from './AddPeptideModal'
import WireframeGrid from './WireframeGrid'
import { usePeptides } from '../hooks/usePeptides'

const FEATURES = [
  { icon: Calendar, title: 'Cycle Tracking', description: 'Monitor your complete peptide cycles with precision timing' },
  { icon: Clock, title: 'Dose Scheduling', description: 'Never miss a dose with intelligent scheduling and reminders' },
  { icon: TrendingUp, title: 'Progress Analytics', description: 'Visualize adherence and track your progress over time' },
  { icon: Shield, title: 'Private & Secure', description: 'Your data stays encrypted and completely private' },
]

function HomePage({ userId }) {
  const { peptides, loading } = usePeptides(userId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const featuresRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (featuresRef.current) observer.observe(featuresRef.current)
    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-dark-card rounded-xl border border-dark-border" />
          <div className="h-32 bg-dark-card rounded-xl border border-dark-border" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {peptides.length === 0 && <WireframeGrid />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {peptides.length === 0 ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">Start Your First Stack</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Take control of your peptide protocols. Track cycles, monitor dosages,
                and maintain perfect adherence—all in one powerful, intuitive interface.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-3xl hover:rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]"
                style={{ boxShadow: '0 4px 20px rgba(168,85,247,0.25)' }}
                aria-label="Create your first stack"
              >
                <Plus className="w-10 h-10 text-white transition-transform group-hover:rotate-90 duration-500" strokeWidth={2.5} />
              </button>
              <p className="text-gray-500 mt-6 text-sm font-medium">Create Your First Stack</p>
            </div>

            <div ref={featuresRef} className="w-full max-w-5xl mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURES.map((feature, i) => (
                  <FeatureCard key={i} {...feature} visible={isVisible} delay={i * 100} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gradient mb-2">Your Stack</h2>
                <p className="text-gray-400">
                  <span className="text-accent-primary font-semibold">{peptides.length}</span>
                  {' '}peptide{peptides.length !== 1 ? 's' : ''} in active cycle
                </p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 btn-primary">
                <Plus className="w-5 h-5" /> Add Peptide
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peptides.map(p => <PeptideCard key={p.id} peptide={p} userId={userId} />)}
            </div>
          </div>
        )}

        {isModalOpen && <AddPeptideModal userId={userId} onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, visible, delay }) {
  return (
    <div
      className={`group relative bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-xl p-6 hover:border-accent-primary/50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-accent-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default HomePage
