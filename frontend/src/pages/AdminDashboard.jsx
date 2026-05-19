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
      <nav className="border-r border-slate-700 bg-slate-800 p-6 shadow-xl">
        <div className="mb-8 rounded-lg bg-slate-900 border border-slate-700 p-4">
          <h2 className="text-xl font-bold text-white">Operations</h2>
          <p className="mt-1 text-[10px] tracking-widest text-cyan-400 font-bold uppercase">Administrator</p>
        </div>
        <ul className="space-y-1">
          <li><button onClick={() => navigate('/admin')} className="w-full rounded px-3 py-2 text-left bg-cyan-600 text-white font-bold transition-all">🏠 Overview</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">📋 Manage Requests</button></li>
          <li className="pt-4 pb-1"><span className="px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reports & Logs</span></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">📈 Analytics</button></li>
          <li><button onClick={() => navigate('/admin/audit')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">📜 Audit Trail</button></li>
          <li><button onClick={() => navigate('/admin/sla')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">⏱️ SLA Performance</button></li>
          <li className="pt-4 pb-1"><span className="px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">System</span></li>
          <li><button onClick={() => navigate('/admin/team')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">👥 Team Directory</button></li>
          <li><button onClick={() => navigate('/admin/system-status')} className="w-full rounded px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-all">🚦 System Status</button></li>
          
          <li><button onClick={() => { logout(); navigate('/login') }} className="mt-8 w-full rounded border border-red-500/50 bg-red-500/10 text-red-500 px-3 py-2 hover:bg-red-500 hover:text-white transition-all">🚪 Exit Console</button></li>
        </ul>
      </nav>

      <main className="p-8 bg-slate-900/50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">System Overview</h1>
            <p className="text-slate-400 mt-1">Real-time indicators and operational shortcuts.</p>
          </div>
          <button onClick={() => navigate('/admin/requests')} className="btn-primary">View Queue</button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm"><p className="text-xs text-slate-400 font-bold uppercase">Total Tickets</p><p className="text-3xl font-bold text-white mt-1">{analytics?.total ?? '0'}</p></div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm"><p className="text-xs text-slate-400 font-bold uppercase text-amber-500">Awaiting Action</p><p className="text-3xl font-bold text-white mt-1">{analytics?.pending ?? '0'}</p></div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm"><p className="text-xs text-slate-400 font-bold uppercase text-sky-400">In Progress</p><p className="text-3xl font-bold text-white mt-1">{analytics?.inProgress ?? '0'}</p></div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm"><p className="text-xs text-slate-400 font-bold uppercase text-emerald-400">Resolution Rate</p><p className="text-3xl font-bold text-white mt-1">{analytics?.total ? Math.round((analytics?.completed / analytics?.total) * 100) : '0'}%</p></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Operations Shortcuts</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/admin/team')} className="p-3 text-left rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">Manage Staff</button>
              <button onClick={() => navigate('/admin/sla')} className="p-3 text-left rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">SLA Policy</button>
              <button onClick={() => navigate('/admin/system-status')} className="p-3 text-left rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">Infrastructure</button>
              <button onClick={() => navigate('/analytics')} className="p-3 text-left rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">Export Data</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 flex flex-col justify-center">
             <div className="text-center">
                <p className="text-slate-400 text-sm mb-4">Need to review recent administrative actions?</p>
                <button onClick={() => navigate('/admin/audit')} className="btn-secondary w-full">Access Security Audit Trail</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard