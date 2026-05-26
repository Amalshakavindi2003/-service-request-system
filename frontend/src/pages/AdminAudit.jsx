import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Clock3, ShieldCheck } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { useAuth } from '../context/AuthContext'
import { getAuditsApi } from '../api/requestApi'

function AdminAudit() {
  const navigate = useNavigate()
  const { user } = useAuth()
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
    <AdminLayout
      title="Audit Logs"
      subtitle="Recent administrative actions, presented in a calmer and easier-to-scan format."
      actions={<button onClick={() => navigate('/admin/requests')} className="btn-outline"><ShieldCheck size={16} /> Requests</button>}
    >
      <section className="card">
        {loading ? <p className="text-slate-400">Loading...</p> : (
          <div className="space-y-3">
            {audits.length === 0 ? <p className="text-slate-400">No audit logs yet.</p> : audits.map((audit) => (
              <div key={audit.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/80">Audit event</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{audit.action}</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                    <Clock3 size={14} /> {new Date(audit.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">By: {audit.full_name || audit.email || 'System'}</p>
                <p className="text-sm text-slate-400">Request ID: {audit.request_id || '-'}</p>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-slate-950/50 p-4 text-xs text-slate-400">{JSON.stringify(audit.metadata || {}, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}

export default AdminAudit