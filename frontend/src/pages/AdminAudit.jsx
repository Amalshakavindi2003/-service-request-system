import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getAuditsApi } from '../api/requestApi'

function AdminAudit() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }
    loadAudits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadAudits = async () => {
    try {
      setLoading(true)
      const { data } = await getAuditsApi()
      setAudits(data?.audits || [])
    } catch (error) {
      toast.error(error?.message || 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
          <p className="mt-1 text-xs text-cyan-100">OPERATIONS CONSOLE</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Dashboard</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Manage Requests</button></li>
          <li><button onClick={() => navigate('/admin/audit')} className="w-full rounded bg-cyan-500 px-3 py-2 text-left text-white">Audit Logs</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full rounded px-3 py-2 text-left text-white hover:bg-slate-700">Analytics</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="mt-8 w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700">Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Audit Logs</h1>
        <p className="mb-6 text-slate-400">Recent admin actions across the system.</p>

        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
          {loading ? <p className="text-slate-400">Loading...</p> : (
            <div className="space-y-3">
              {audits.length === 0 ? <p className="text-slate-400">No audit logs yet.</p> : audits.map((audit) => (
                <div key={audit.id} className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-white">{audit.action}</h3>
                    <span className="text-xs text-slate-400">{new Date(audit.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">By: {audit.full_name || audit.email || 'System'}</p>
                  <p className="text-sm text-slate-400">Request ID: {audit.request_id || '-'}</p>
                  <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-500">{JSON.stringify(audit.metadata || {}, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminAudit