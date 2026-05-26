import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivitySquare, ArrowRight, ShieldCheck, SlidersHorizontal, Sparkles, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getAnalyticsApi } from '../api/requestApi'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }

    const loadAnalytics = async () => {
      try {
        const { data } = await getAnalyticsApi()
        setAnalytics(data?.analytics || null)
      } catch (err) {
        console.warn('Analytics load failed', err)
      }
    }

    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const statCards = [
    { label: 'Total Tickets', value: analytics?.total ?? '0', tone: 'linear-gradient(135deg, rgba(98,125,255,0.96), rgba(18,191,232,0.82))', icon: ActivitySquare },
    { label: 'Awaiting Action', value: analytics?.pending ?? '0', tone: 'linear-gradient(135deg, rgba(255,203,107,0.96), rgba(255,149,69,0.82))', icon: Sparkles },
    { label: 'In Progress', value: analytics?.inProgress ?? '0', tone: 'linear-gradient(135deg, rgba(69,215,255,0.96), rgba(70,94,240,0.82))', icon: SlidersHorizontal },
    { label: 'Resolution Rate', value: analytics?.total ? `${Math.round((analytics.completed / analytics.total) * 100)}%` : '0%', tone: 'linear-gradient(135deg, rgba(87,212,157,0.96), rgba(28,176,129,0.82))', icon: ShieldCheck },
  ]

  return (
    <div className="page-shell page-shell--split">
      <nav className="sidebar">
        <div className="brand">Operations</div>
        <nav>
          <a href="/admin" className="active">Overview</a>
          <a href="/admin/requests">Manage Requests</a>
          <a href="/analytics">Analytics</a>
          <a href="/admin/audit">Audit Trail</a>
          <a href="/admin/team">Team Directory</a>
          <a href="/admin/sla">SLA Performance</a>
          <a href="/admin/system-status">System Status</a>
        </nav>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-outline logout">Logout</button>
        </div>
      </nav>

      <main className="main">
        <section className="hero-card">
          <div className="hero-card__top">
            <div>
              <p className="hero-card__eyebrow">Administrator</p>
              <h1 className="hero-card__title">System Overview</h1>
              <p className="hero-card__copy">A cleaner command center for tickets, staff, and platform health.</p>
            </div>
            <div className="page-actions">
              <button onClick={() => navigate('/admin/team')} className="btn-outline"><Users size={16} /> Team</button>
              <button onClick={() => navigate('/admin/requests')} className="btn-primary">View Queue <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        <section className="page-grid page-grid--stats" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.label} className="stat-card" style={{ background: stat.tone }}>
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

        <section className="page-grid page-grid--split">
          <div className="card">
            <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>Operations Shortcuts</h2>
            <div className="page-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <button onClick={() => navigate('/admin/team')} className="btn-outline" style={{ justifyContent: 'flex-start' }}>Manage Staff</button>
              <button onClick={() => navigate('/admin/sla')} className="btn-outline" style={{ justifyContent: 'flex-start' }}>SLA Policy</button>
              <button onClick={() => navigate('/admin/system-status')} className="btn-outline" style={{ justifyContent: 'flex-start' }}>Infrastructure</button>
              <button onClick={() => navigate('/analytics')} className="btn-outline" style={{ justifyContent: 'flex-start' }}>Export Data</button>
            </div>
          </div>

          <div className="card" style={{ display: 'grid', alignContent: 'center', gap: '1rem' }}>
            <div>
              <p className="page-subtitle" style={{ marginTop: 0 }}>Need to review recent administrative actions?</p>
              <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.15rem' }}>Open the audit trail for a quick health check.</h2>
            </div>
            <button onClick={() => navigate('/admin/audit')} className="btn-secondary">Access Security Audit Trail</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard