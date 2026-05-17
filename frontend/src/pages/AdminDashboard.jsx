import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-slate-900 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
          <p className="mt-1 text-xs text-cyan-100">OPERATIONS CONSOLE</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full rounded bg-cyan-500 px-3 py-2 text-left text-white">Dashboard</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Manage Requests</button></li>
          <li><button onClick={() => navigate('/admin/audit')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Audit Logs</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Analytics</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="mt-8 w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700">Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Admin Overview</h1>
        <p className="mb-6 text-slate-400">Quick view of system health and request volumes.</p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"><p className="text-sm text-slate-400">Total Requests</p><p className="text-3xl font-bold text-white">{analytics?.total ?? '-'}</p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"><p className="text-sm text-slate-400">Pending</p><p className="text-3xl font-bold text-amber-300">{analytics?.pending ?? '-'}</p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"><p className="text-sm text-slate-400">In Progress</p><p className="text-3xl font-bold text-sky-300">{analytics?.inProgress ?? '-'}</p></div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"><p className="text-sm text-slate-400">Completed</p><p className="text-3xl font-bold text-emerald-300">{analytics?.completed ?? '-'}</p></div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/admin/requests')} className="btn-primary">Manage Requests</button>
            <button onClick={() => navigate('/admin/audit')} className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600">Audit Logs</button>
            <button onClick={() => navigate('/analytics')} className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600">Open Analytics</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard