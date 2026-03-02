import { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { TrendingUp, Calendar, Target, Zap, ArrowLeft } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, differenceInDays } from 'date-fns'

function Analytics({ userId, onBack }) {
  const [peptides, setPeptides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    if (!userId) return

    const fetchPeptides = async () => {
      const q = query(collection(db, 'users', userId, 'peptides'))
      const snapshot = await getDocs(q)
      const peptideData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPeptides(peptideData)
      setLoading(false)
    }

    fetchPeptides()
  }, [userId])

  const calculateAdherence = (peptide) => {
    if (!peptide.lastTaken) return 0
    
    const startDate = peptide.cycleStartDate?.toDate() || peptide.lastTaken.toDate()
    const now = new Date()
    const daysSinceStart = differenceInDays(now, startDate)
    
    const expectedDoses = peptide.frequency === 'daily' ? daysSinceStart : Math.floor(daysSinceStart / 7)
    const actualDoses = peptide.takenCount || 0
    
    if (expectedDoses === 0) return 100
    return Math.min(Math.round((actualDoses / expectedDoses) * 100), 100)
  }

  const calculateCurrentStreak = (peptide) => {
    if (!peptide.lastTaken || !peptide.nextDue) return 0
    
    const lastTaken = peptide.lastTaken.toDate()
    const nextDue = peptide.nextDue.toDate()
    const now = new Date()
    
    // If next dose is overdue, streak is broken
    if (now > nextDue) return 0
    
    return peptide.takenCount || 0
  }

  const getMonthlyDoseData = () => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    const days = eachDayOfInterval({ start, end })
    
    return days.map(day => {
      const dosesOnDay = peptides.reduce((count, peptide) => {
        if (peptide.lastTaken) {
          const lastTaken = peptide.lastTaken.toDate()
          if (isSameDay(lastTaken, day)) return count + 1
        }
        return count
      }, 0)
      
      return {
        date: day,
        doses: dosesOnDay
      }
    })
  }

  const monthlyData = getMonthlyDoseData()
  const totalDoses = peptides.reduce((sum, p) => sum + (p.takenCount || 0), 0)
  const averageAdherence = peptides.length > 0
    ? Math.round(peptides.reduce((sum, p) => sum + calculateAdherence(p), 0) / peptides.length)
    : 0
  const activePeptides = peptides.filter(p => p.cycleEnabled ? p.cycleStatus === 'on' : true).length
  const longestStreak = Math.max(...peptides.map(p => calculateCurrentStreak(p)), 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-dark-card rounded-xl border border-dark-border"></div>
          <div className="h-64 bg-dark-card rounded-xl border border-dark-border"></div>
        </div>
      </div>
    )
  }

  if (peptides.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Stack
        </button>
        <div className="text-center py-16">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-300 mb-2">No Data Yet</h2>
          <p className="text-gray-500">Add peptides to your stack to see analytics</p>
        </div>
      </div>
    )
  }

  const maxDoses = Math.max(...monthlyData.map(d => d.doses), 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Stack
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Progress Analytics</h1>
        <p className="text-gray-400">Track your adherence and visualize your progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-glow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Adherence</p>
              <p className="text-2xl font-bold text-gradient">{averageAdherence}%</p>
            </div>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500"
              style={{ width: `${averageAdherence}%` }}
            ></div>
          </div>
        </div>

        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Doses</p>
              <p className="text-2xl font-bold text-white">{totalDoses}</p>
            </div>
          </div>
        </div>

        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-400/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Peptides</p>
              <p className="text-2xl font-bold text-white">{activePeptides}</p>
            </div>
          </div>
        </div>

        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-400/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Best Streak</p>
              <p className="text-2xl font-bold text-white">{longestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Calendar Heatmap */}
      <div className="card-glow mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Monthly Activity</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
              className="px-3 py-1 bg-dark-bg hover:bg-dark-border rounded-lg text-sm transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-300 min-w-[120px] text-center">
              {format(selectedMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
              className="px-3 py-1 bg-dark-bg hover:bg-dark-border rounded-lg text-sm transition-colors"
              disabled={selectedMonth.getMonth() === new Date().getMonth()}
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium pb-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startOfMonth(selectedMonth).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          
          {monthlyData.map((day, i) => {
            const intensity = day.doses / maxDoses
            const isToday = isSameDay(day.date, new Date())
            
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg border transition-all hover:scale-110 cursor-pointer ${
                  isToday ? 'border-accent-primary' : 'border-dark-border'
                }`}
                style={{
                  backgroundColor: day.doses > 0
                    ? `rgba(255, 73, 140, ${0.2 + intensity * 0.6})`
                    : 'rgba(30, 30, 30, 0.3)'
                }}
                title={`${format(day.date, 'MMM d')}: ${day.doses} dose${day.doses !== 1 ? 's' : ''}`}
              >
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  {format(day.date, 'd')}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded border border-dark-border"
                style={{ backgroundColor: intensity > 0 ? `rgba(255, 73, 140, ${0.2 + intensity * 0.6})` : 'rgba(30, 30, 30, 0.3)' }}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Per-Peptide Stats */}
      <div className="card-glow">
        <h2 className="text-xl font-bold text-white mb-6">Peptide Breakdown</h2>
        <div className="space-y-4">
          {peptides.map(peptide => {
            const adherence = calculateAdherence(peptide)
            const streak = calculateCurrentStreak(peptide)
            
            return (
              <div key={peptide.id} className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{peptide.name}</h3>
                    <p className="text-sm text-gray-400">{peptide.dosage} · {peptide.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gradient">{adherence}%</p>
                    <p className="text-xs text-gray-500">adherence</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Total Doses</p>
                    <p className="text-lg font-semibold text-white">{peptide.takenCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Streak</p>
                    <p className="text-lg font-semibold text-white">{streak}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-white">
                      {peptide.cycleEnabled ? (peptide.cycleStatus === 'on' ? '🟢 On' : '⚫ Off') : '🟢 Active'}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500"
                    style={{ width: `${adherence}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Analytics