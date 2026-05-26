import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Download, Filter, SlidersHorizontal } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { useAuth } from '../context/AuthContext'
import { getAllRequestsApi, updateRequestStatusApi, deleteRequestApi, exportRequestsApi } from '../api/requestApi'

function AdminRequests() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [statusModal, setStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('Pending')
  const [assignee, setAssignee] = useState('')
  const [savingUpdate, setSavingUpdate] = useState(false)
  const [showAssignedOnly, setShowAssignedOnly] = useState(false)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data } = await getAllRequestsApi(filters)
      setRequests(data?.requests || [])
    } catch (error) {
      toast.error(error?.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const openUpdateModal = (request) => {
    setSelectedRequest(request)
    setNewStatus(request.status || 'Pending')
    setAssignee(request.assigned_to || '')
    setStatusModal(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return
    try {
      setSavingUpdate(true)
      await updateRequestStatusApi(selectedRequest.id, { status: newStatus, assignedTo: assignee.trim() || user?.full_name || 'Support Team' })
      toast.success('Request updated successfully')
      setStatusModal(false)
      loadRequests()
    } catch (error) {
      toast.error(error?.message || 'Failed to update request')
    } finally {
      setSavingUpdate(false)
    }
  }

  const handleQuickTransition = async (request, status) => {
    try {
      await updateRequestStatusApi(request.id, { status, assignedTo: request.assigned_to || user?.full_name || 'Support Team' })
      toast.success(`Marked as ${status}`)
      loadRequests()
    } catch (error) {
      toast.error(error?.message || 'Quick update failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request permanently?')) {
      try {
        await deleteRequestApi(id)
        toast.success('Request deleted')
        loadRequests()
      } catch (error) {
        toast.error(error?.message || 'Delete failed')
      }
    }
  }

  const stats = useMemo(() => {
    const total = requests.length
    const pending = requests.filter((item) => item.status === 'Pending').length
    const inProgress = requests.filter((item) => item.status === 'In Progress').length
    const completed = requests.filter((item) => item.status === 'Completed').length
    const unassigned = requests.filter((item) => !item.assigned_to).length
    return { total, pending, inProgress, completed, unassigned }
  }, [requests])

  const filteredRequests = showAssignedOnly ? requests.filter((r) => r.assigned_to === user?.full_name) : requests

  const exportServerCSV = async () => {
    try {
      const response = await exportRequestsApi(filters)
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'requests_export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(error?.message || 'Export failed')
    }
  }

  const statCards = [
    { label: 'Total', value: stats.total, accent: 'linear-gradient(135deg, rgba(98,125,255,0.96), rgba(18,191,232,0.82))' },
    { label: 'Pending', value: stats.pending, accent: 'linear-gradient(135deg, rgba(255,203,107,0.96), rgba(255,149,69,0.82))' },
    { label: 'In Progress', value: stats.inProgress, accent: 'linear-gradient(135deg, rgba(69,215,255,0.96), rgba(70,94,240,0.82))' },
    { label: 'Completed', value: stats.completed, accent: 'linear-gradient(135deg, rgba(87,212,157,0.96), rgba(28,176,129,0.82))' },
    { label: 'Unassigned', value: stats.unassigned, accent: 'linear-gradient(135deg, rgba(255,123,123,0.96), rgba(244,63,94,0.82))' },
  ]

  return (
    <AdminLayout
      title="Request Operations"
      subtitle="Triage, assign, and close requests with a calmer, clearer console."
      actions={(
        <>
          <button onClick={() => setShowAssignedOnly((s) => !s)} className="btn-outline">
            <Filter size={16} /> {showAssignedOnly ? 'Assigned only' : 'All requests'}
          </button>
          <button onClick={exportServerCSV} className="btn-outline">
            <Download size={16} /> Export CSV
          </button>
        </>
      )}
    >
      <section className="page-grid page-grid--stats">
        {statCards.map((stat) => (
          <article key={stat.label} className="stat-card" style={{ background: stat.accent }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, opacity: 0.95 }}>{stat.label}</p>
              <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: 1 }}>{stat.value}</h2>
            </div>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Filters</h2>
            <p className="page-subtitle mt-1 text-sm">Narrow the queue by status, category, priority, or search term.</p>
          </div>
          <button type="button" className="btn-secondary"><SlidersHorizontal size={16} /> Queue controls</button>
        </div>

        <div className="mb-6 grid items-center gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input type="text" placeholder="Search title / requester" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="input" />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input">
            <option value="">All Categories</option>
            <option value="IT Support">IT Support</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Security">Security</option>
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="input">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {loading ? <p className="text-slate-400">Loading...</p> : (
          <div className="space-y-3">
            {filteredRequests.length === 0 ? <p className="text-slate-400">No requests found</p> : filteredRequests.map((req) => (
              <div key={req.id} className="card flex flex-col gap-4 border-white/8 bg-white/[0.035] p-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/request/${req.id}`)}>
                  <h3 className="font-bold text-white">{req.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">#{req.id} • {req.full_name} • {req.category} • {req.priority}</p>
                  <p className="mt-1 text-xs text-slate-500">Assigned: {req.assigned_to || 'Unassigned'} • Updated: {new Date(req.updated_at).toLocaleString()}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm ${req.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-200' : req.status === 'In Progress' ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-500/20 text-slate-200'}`}>{req.status}</span>
                  {req.status !== 'In Progress' && <button onClick={() => handleQuickTransition(req, 'In Progress')} className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-100 hover:bg-sky-500/20">Start</button>}
                  {req.status !== 'Completed' && <button onClick={() => handleQuickTransition(req, 'Completed')} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-100 hover:bg-emerald-500/20">Resolve</button>}
                  <button onClick={() => openUpdateModal(req)} className="btn-primary text-sm">Manage</button>
                  <button onClick={() => handleDelete(req.id)} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-sm text-rose-100 hover:bg-rose-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {statusModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <div className="card w-full max-w-md border-white/10 bg-[linear-gradient(180deg,rgba(14,22,38,0.98),rgba(9,15,28,0.98))] p-6">
              <h2 className="mb-1 text-xl font-bold text-white">Manage Request #{selectedRequest.id}</h2>
              <p className="mb-4 text-sm text-slate-400">{selectedRequest.title}</p>
              <label className="mb-2 block text-sm text-slate-300">Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input mb-4 w-full">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <label className="mb-2 block text-sm text-slate-300">Assign To</label>
              <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="e.g., L1 Support - David" className="input mb-5 w-full" />
              <div className="flex gap-4">
                <button disabled={savingUpdate} onClick={handleUpdateStatus} className="btn-primary flex-1 disabled:opacity-60">{savingUpdate ? 'Updating...' : 'Save Changes'}</button>
                <button onClick={() => setStatusModal(false)} className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white hover:bg-white/[0.08]">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}

export default AdminRequests