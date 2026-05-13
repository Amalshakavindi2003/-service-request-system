import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getAnalyticsApi } from '../api/requestApi'

function AnalyticsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await getAnalyticsApi()
      setAnalytics(data.analytics)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Loading analytics...</div>

  const stats = [
    { label: 'Total Requests', value: analytics?.total || 0, color: 'bg-blue-600', icon: '📊' },
    { label: 'Pending', value: analytics?.pending || 0, color: 'bg-yellow-600', icon: '⏳' },
    { label: 'In Progress', value: analytics?.inProgress || 0, color: 'bg-cyan-600', icon: '⚙️' },
    { label: 'Completed', value: analytics?.completed || 0, color: 'bg-green-600', icon: '✓' },
  ]

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📊 Dashboard</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white">📈 Analytics</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">🔍 Manage Requests</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-8 rounded bg-red-600 px-3 py-2 hover:bg-red-700 text-white">🚪 Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`card p-6 ${stat.color}`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-slate-300 text-sm">{stat.label}</p>
              <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">By Category</h2>
            <div className="space-y-2">
              {Object.entries(analytics?.byCategory || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center pb-2 border-b border-slate-600">
                  <span className="text-slate-300">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-cyan-500 rounded" style={{width: (count * 20) + 'px'}}></div>
                    <span className="text-slate-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">By Priority</h2>
            <div className="space-y-2">
              {Object.entries(analytics?.byPriority || {}).map(([priority, count]) => {
                const colors = { Low: 'bg-green-500', Medium: 'bg-yellow-500', High: 'bg-orange-500', Critical: 'bg-red-500' }
                return (
                  <div key={priority} className="flex justify-between items-center pb-2 border-b border-slate-600">
                    <span className="text-slate-300">{priority}</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 ${colors[priority] || 'bg-slate-500'} rounded`} style={{width: (count * 20) + 'px'}}></div>
                      <span className="text-slate-400">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card p-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Request Distribution</h2>
          <div className="flex justify-around items-end h-64">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`${stat.color} rounded w-12 transition-all hover:scale-105`} style={{height: ((stat.value / (analytics?.total || 1)) * 200) + 'px'}}></div>
                <span className="text-sm text-slate-300">{stat.label}</span>
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsPage