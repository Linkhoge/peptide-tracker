import { Plus, Sparkles, Target, Zap, BarChart3 } from 'lucide-react'
import WireframeGrid from './WireframeGrid'

function EmptyState({ onAddClick }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Wireframe Grid Background */}
      <WireframeGrid />
      
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 animate-gradient-shift"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-full text-sm text-accent-primary font-medium">
              <Sparkles className="w-4 h-4" />
              Professional Peptide Tracking
            </div>

            <div>
              <h1 className="text-6xl font-black text-gradient mb-6 leading-tight">
                Start Your First Stack
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Track peptide cycles with precision. Monitor dosages, schedules, and adherence in one clean interface.
              </p>
            </div>

            <button
              onClick={onAddClick}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl text-white font-bold text-lg shadow-glow-lg hover:shadow-glow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Plus className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Add Your First Peptide</span>
            </button>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Precision Dosing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Cycle Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Smart Insights</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Molecule Visualization */}
          <div className="relative h-[500px] flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="molecule-container">
              {/* Central Core */}
              <div className="molecule-core"></div>
              
              {/* Orbiting Atoms */}
              <div className="orbit orbit-1">
                <div className="atom atom-1"></div>
              </div>
              <div className="orbit orbit-2">
                <div className="atom atom-2"></div>
              </div>
              <div className="orbit orbit-3">
                <div className="atom atom-3"></div>
              </div>
              <div className="orbit orbit-4">
                <div className="atom atom-4"></div>
              </div>
              <div className="orbit orbit-5">
                <div className="atom atom-5"></div>
              </div>

              {/* Connecting Bonds */}
              <div className="bond bond-1"></div>
              <div className="bond bond-2"></div>
              <div className="bond bond-3"></div>
              <div className="bond bond-4"></div>
            </div>

            {/* Glassmorphic Info Cards */}
            <div className="absolute top-10 right-10 glass-card animate-float" style={{ animationDelay: '0s' }}>
              <div className="text-2xl font-bold text-gradient">200+</div>
              <div className="text-xs text-gray-400">Peptides</div>
            </div>
            <div className="absolute bottom-20 left-10 glass-card animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-bold text-gradient">100%</div>
              <div className="text-xs text-gray-400">Private</div>
            </div>
            <div className="absolute top-1/2 right-0 glass-card animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-2xl font-bold text-gradient">24/7</div>
              <div className="text-xs text-gray-400">Tracking</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-glow group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:shadow-glow-sm transition-all">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Precision Tracking</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Log every dose with exact timestamps. Never miss a cycle with smart reminders.
            </p>
          </div>

          <div className="card-glow group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-4 group-hover:shadow-glow-sm transition-all">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Cycle Management</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Configure on/off cycles. Auto-calculate phases. Stay optimized year-round.
            </p>
          </div>

          <div className="card-glow group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:shadow-glow-sm transition-all">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">Smart Insights</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              View adherence trends. Track progress over time. Make data-driven decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyState