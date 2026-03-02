import { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Target, Flame, Calendar, Award, Clock } from 'lucide-react'
import { format, subDays, startOfDay, isSameDay, differenceInDays } from 'date-fns'

function Analytics({ userId }) {
  const [peptides, setPeptides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeptide, setSelectedPeptide] = useState(null)

  useEffect(() => {
    if (!userId) return

    const q = query(collection(db, 'users', userId, 'peptides'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const peptideData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPeptides(peptideData)
      if (peptideData.length > 0 && !selectedPeptide) {
        setSelectedPeptide(peptideData[0].id)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

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
        <div className="text-center py-20">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No Data Yet</h2>
          <p className="text-gray-500">Add peptides and log doses to see your analytics</p>
        </div>
      </div>
    )
  }

  const selectedPeptideData = peptides.find(p => p.id === selectedPeptide) || peptides[0]
  const doseHistory = selectedPeptideData.doseHistory || []

  // Calculate streak (consecutive days from most recent)
  const calculateStreak = () => {
    if (doseHistory.length === 0) return 0
    
    const sortedDoses = [...doseHistory]
      .map(d => startOfDay(d.takenAt.toDate()))
      .sort((a, b) => b - a)
    
    let streak = 0
    let currentDate = startOfDay(new Date())
    
    for (const doseDate of sortedDoses) {
      const daysDiff = differenceInDays(currentDate, doseDate)
      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }
    
    return streak
  }

  // Calculate adherence percentage
  const calculateAdherence = () => {
    if (!selectedPeptideData.createdAt) return 0
    
    const startDate = selectedPeptideData.createdAt.toDate()
    const now = new Date()
    const daysSinceStart = differenceInDays(now, startDate) + 1
    
    const expectedDoses = selectedPeptideData.frequency === 'daily' ? daysSinceStart : Math.floor(daysSinceStart / 7)
    const actualDoses = selectedPeptideData.takenCount || 0
    
    return expectedDoses > 0 ? Math.round((actualDoses / expectedDoses) * 100) : 0
  }

  // Get last 30 days data
  const getLast30DaysData = () => {
    const data = []
    const today = startOfDay(new Date())
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i)
      const dosesOnDay = doseHistory.filter(d => 
        isSameDay(d.takenAt.toDate(), date)
      ).length
      
      data.push({
        date: format(date, 'MMM d'),
        doses: dosesOnDay,
        day: format(date, 'EEE')
      })
    }
    
    return data
  }

  // Get weekly summary (last 7 days)
  const getWeeklySummary = () => {
    const data = []
    const today = startOfDay(new Date())
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      const dosesOnDay = doseHistory.filter(d => 
        isSameDay(d.takenAt.toDate(), date)
      ).length
      
      const expected = selectedPeptideData.frequency === 'daily' ? 1 : (i === 0 || i === 6 ? 1 : 0)
      const adherence = expected > 0 ? (dosesOnDay >= expected ? 100 : 0) : null
      
      data.push({
        day: format(date, 'EEE'),
        adherence: adherence,
        doses: dosesOnDay
      })
    }
    
    return data
  }

  const streak = calculateStreak()
  const adherence = calculateAdherence()
  const last30Days = getLast30DaysData()
  const weeklySummary = getWeeklySummary()
  const totalDoses = selectedPeptideData.takenCount || 0
  const avgDosesPerWeek = doseHistory.length > 0 ? Math.round((totalDoses / (differenceInDays(new Date(), selectedPeptideData.createdAt?.toDate() || new Date()) + 1)) * 7) : 0

  const statCards = [
    {
      icon: Target,
      label: 'Adherence Rate',
      value: `${adherence}%`,
      color: adherence >= 80 ? 'text-green-400' : adherence >= 60 ? 'text-yellow-400' : 'text-red-400',
      bgColor: adherence >= 80 ? 'bg-green-500/10' : adherence >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${streak} days`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Award,
      label: 'Total Doses',
      value: totalDoses,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Calendar,
      label: 'Weekly Average',
      value: `${avgDosesPerWeek}/week`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Analytics</h1>
        <p className="text-gray-400">Track your progress and adherence over time</p>
      </div>

      {/* Peptide Selector */}
      {peptides.length > 1 && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {peptides.map(peptide => (
            <button
              key={peptide.id}
              onClick={() => setSelectedPeptide(peptide.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedPeptide === peptide.id
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow-sm'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:border-accent-primary/50'
              }`}
            >
              {peptide.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Weekly Adherence Chart */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Weekly Adherence</h3>
            <p className="text-sm text-gray-400">Last 7 days performance</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklySummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'Adherence']}
            />
            <Bar dataKey="adherence" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {weeklySummary.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.adherence === 100 ? '#10b981' : entry.adherence === 0 ? '#ef4444' : '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Dose History */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">30-Day History</h3>
            <p className="text-sm text-gray-400">Daily dose tracking</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDoses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              interval={4}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [value, 'Doses']}
            />
            <Line 
              type="monotone" 
              dataKey="doses" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              fill="url(#colorDoses)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      {doseHistory.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold">Insights</h4>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                {adherence >= 80 ? (
                  <span className="text-green-400">Excellent adherence! Keep up the great work.</span>
                ) : adherence >= 60 ? (
                  <span className="text-yellow-400">Good progress, but there's room for improvement.</span>
                ) : (
                  <span className="text-red-400">Try to stay more consistent with your doses.</span>
                )}
              </p>
              {streak > 0 && (
                <p>You're on a <span className="text-accent-primary font-semibold">{streak}-day streak</span>. Don't break it!</p>
              )}
              {avgDosesPerWeek > 0 && (
                <p>You average <span className="text-accent-primary font-semibold">{avgDosesPerWeek} doses per week</span>.</p>
              )}
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold">Recent Activity</h4>
            </div>
            <div className="space-y-2">
              {doseHistory.slice(-5).reverse().map((dose, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-dark-border last:border-b-0">
                  <span className="text-gray-400">{format(dose.takenAt.toDate(), 'MMM d, yyyy')}</span>
                  <span className="text-green-400 font-medium">Completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics