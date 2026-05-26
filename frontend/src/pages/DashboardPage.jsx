import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Bell, CheckCircle2, ClipboardList, Grid2x2, Plus, TimerReset } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyRequestsApi } from '../api/requestApi'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data } = await getMyRequestsApi()
      setRequests(data.requests || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const stats = [
    { label: 'Total Requests', value: requests.length, accent: 'linear-gradient(135deg, rgba(98,125,255,0.95), rgba(18,191,232,0.85))', icon: Grid2x2 },
    { label: 'Pending', value: requests.filter((request) => request.status === 'Pending').length, accent: 'linear-gradient(135deg, rgba(255,203,107,0.95), rgba(255,149,69,0.88))', icon: TimerReset },
    { label: 'In Progress', value: requests.filter((request) => request.status === 'In Progress').length, accent: 'linear-gradient(135deg, rgba(69,215,255,0.95), rgba(70,94,240,0.88))', icon: ClipboardList },
    { label: 'Completed', value: requests.filter((request) => request.status === 'Completed').length, accent: 'linear-gradient(135deg, rgba(87,212,157,0.95), rgba(28,176,129,0.88))', icon: CheckCircle2 },
  ]

  return (
    <div className="page-shell page-shell--split">
      <nav className="sidebar">
        <div className="brand">Service Desk</div>
        <nav>
          <a href="/dashboard" className="active">Dashboard</a>
          <a href="/dashboard/service-catalog">Service Catalog</a>
          <a href="/dashboard/create-request">Create Request</a>
          <a href="/dashboard/request-history">Request History</a>
          <a href="/dashboard/notifications">Notifications</a>
          <a href="/dashboard/help-center">Help Center</a>
          <a href="/dashboard/profile">Profile</a>
        </nav>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-outline logout">Logout</button>
        </div>
      </nav>

      <main className="main">
        <section className="hero-card">
          <div className="hero-card__top">
            <div>
              <p className="hero-card__eyebrow">Service Desk</p>
              <h1 className="hero-card__title">Hello, {firstName}!</h1>
              <p className="hero-card__copy">A calmer view of your requests, status, and next actions.</p>
            </div>
            <div className="page-actions">
              <button onClick={() => navigate('/dashboard/notifications')} className="btn-outline"><Bell size={16} /> Notifications</button>
              <button onClick={() => navigate('/dashboard/create-request')} className="btn-primary"><Plus size={16} /> New Request</button>
            </div>
          </div>
        </section>

        <section className="page-grid page-grid--stats" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className="stat-card" style={{ background: stat.accent }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, opacity: 0.95 }}>{stat.label}</p>
                    <Icon size={18} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: '2.25rem', lineHeight: 1, letterSpacing: '-0.04em' }}>{stat.value}</h2>
                </div>
              </article>
            )
          })}
        </section>

        <section className="card">
          <div className="header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Active Requests</h2>
              <p className="page-subtitle" style={{ margin: '0.25rem 0 0' }}>Recent work that still needs your attention.</p>
            </div>
            <button onClick={() => navigate('/dashboard/request-history')} className="btn-outline">View All <ArrowRight size={16} /></button>
          </div>

          {loading ? (
            <div style={{ display: 'grid', placeItems: 'center', padding: '3rem 1rem' }}><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent-500)]"></div></div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <p style={{ margin: 0, color: 'var(--muted)' }}>No active service requests yet.</p>
              <button onClick={() => navigate('/dashboard/create-request')} className="btn-primary" style={{ marginTop: '0.9rem' }}>Submit one now</button>
            </div>
          ) : (
            <div className="table-shell overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th className="text-center">Priority</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 6).map((request) => (
                    <tr key={request.id}>
                      <td className="py-4 font-medium">{request.title}</td>
                      <td className="py-4 text-muted text-sm">{request.category}</td>
                      <td className="py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.priority === 'High' ? 'bg-amber-500/15 text-amber-200' : 'bg-sky-500/15 text-sky-200'}`}>{request.priority}</span></td>
                      <td className="py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-200' : request.status === 'In Progress' ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-500/20 text-slate-200'}`}>{request.status}</span></td>
                      <td className="py-4 text-right"><button onClick={() => navigate(`/request/${request.id}`)} className="text-[color:var(--accent-400)] hover:text-white inline-flex items-center gap-1">View <ArrowRight size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage