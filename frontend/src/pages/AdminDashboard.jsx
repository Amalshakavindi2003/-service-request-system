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
    // eslint-disable-next-line
  }, [user])

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
          <p className="mt-1 text-xs text-cyan-100">OPERATIONS CONSOLE</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white">Dashboard</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">Analytics</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">Manage Requests</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-8 rounded bg-red-600 px-3 py-2 hover:bg-red-700 text-white">Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
        <p className="text-slate-400 mb-6">Quick view of system health and request volumes.</p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-slate-400 text-sm">Total Requests</p>
            <p className="text-3xl font-bold text-white">{analytics?.total ?? '-'}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-slate-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-amber-300">{analytics?.pending ?? '-'}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-slate-400 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-sky-300">{analytics?.inProgress ?? '-'}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-emerald-300">{analytics?.completed ?? '-'}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Actions</h2>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/requests')} className="btn-primary">Manage Requests</button>
            <button onClick={() => navigate('/analytics')} className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600">Open Analytics</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard