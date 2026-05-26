import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BarChart3, LineChart, TriangleAlert } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { useAuth } from '../context/AuthContext'
import { getAnalyticsApi } from '../api/requestApi'

function AnalyticsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

  if (loading) {
    return (
      <AdminLayout title="Analytics Dashboard" subtitle="Loading analytics insights...">
        <div className="card py-16 text-center text-slate-400">Loading analytics...</div>
      </AdminLayout>
    )
  }

  const stats = [
    { label: 'Total Requests', value: analytics?.total || 0, accent: 'linear-gradient(135deg, rgba(98,125,255,0.96), rgba(18,191,232,0.82))', icon: BarChart3 },
    { label: 'Pending', value: analytics?.pending || 0, accent: 'linear-gradient(135deg, rgba(255,203,107,0.96), rgba(255,149,69,0.82))', icon: TriangleAlert },
    { label: 'In Progress', value: analytics?.inProgress || 0, accent: 'linear-gradient(135deg, rgba(69,215,255,0.96), rgba(70,94,240,0.82))', icon: LineChart },
    { label: 'Completed', value: analytics?.completed || 0, accent: 'linear-gradient(135deg, rgba(87,212,157,0.96), rgba(28,176,129,0.82))', icon: BarChart3 },
  ]

  return (
    <AdminLayout
      title="Analytics Dashboard"
      subtitle="A cleaner view of request volume, priorities, and resolution patterns."
      actions={<button onClick={() => navigate('/admin/requests')} className="btn-outline"><BarChart3 size={16} /> Queue</button>}
    >
      <section className="page-grid page-grid--stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article key={stat.label} className="stat-card" style={{ background: stat.accent }}>
              <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '0.5rem' }}>
                <div className="flex items-center justify-between gap-3">
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, opacity: 0.95 }}>{stat.label}</p>
                  <Icon size={18} />
                </div>
                <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: 1 }}>{stat.value}</h2>
              </div>
            </article>
          )
        })}
      </section>

      <section className="page-grid page-grid--split">
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">By Category</h2>
          <div className="space-y-3">
            {Object.entries(analytics?.byCategory || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                <span className="text-slate-300">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.max(count * 20, 24)}px` }} />
                  <span className="text-slate-400">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">By Priority</h2>
          <div className="space-y-3">
            {Object.entries(analytics?.byPriority || {}).map(([priority, count]) => {
              const colors = { Low: 'bg-emerald-400', Medium: 'bg-amber-400', High: 'bg-orange-400', Critical: 'bg-rose-500' }
              return (
                <div key={priority} className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                  <span className="text-slate-300">{priority}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 rounded-full ${colors[priority] || 'bg-slate-400'}`} style={{ width: `${Math.max(count * 20, 24)}px` }} />
                    <span className="text-slate-400">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold text-white">Request Distribution</h2>
        <div className="flex min-h-[18rem] items-end justify-around gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="w-12 rounded-2xl bg-gradient-to-t from-white/10 to-white/0 transition-transform hover:scale-105" style={{ height: `${((stat.value / (analytics?.total || 1)) * 200) + 48}px`, background: stat.accent }} />
              <span className="text-sm text-slate-300">{stat.label}</span>
              <span className="text-lg font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  )
}

export default AnalyticsPage