import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getAllRequestsApi, updateRequestStatusApi, deleteRequestApi } from '../api/requestApi'

function AdminRequests() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
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
    // eslint-disable-next-line
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
      await updateRequestStatusApi(selectedRequest.id, {
        status: newStatus,
        assignedTo: assignee.trim() || user?.full_name || 'Support Team',
      })
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
      await updateRequestStatusApi(request.id, {
        status,
        assignedTo: request.assigned_to || user?.full_name || 'Support Team',
      })
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

  const exportCSV = () => {
    const rows = (filteredRequests || []).map((r) => ({
      ID: r.id,
      Title: r.title,
      Requester: r.full_name,
      Category: r.category,
      Priority: r.priority,
      Status: r.status,
      AssignedTo: r.assigned_to || '',
      UpdatedAt: r.updated_at,
    }))

    if (!rows.length) { toast.error('No data to export'); return }

    const header = Object.keys(rows[0]).join(',')
    const csvBody = rows.map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const csv = `${header}\n${csvBody}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'requests_export.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const cardClass = 'rounded-xl border border-slate-700 bg-slate-900/70 p-4'

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
          <p className="mt-1 text-xs text-cyan-100">OPERATIONS CONSOLE</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">Dashboard</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">Analytics</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white">Manage Requests</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-8 rounded bg-red-600 px-3 py-2 hover:bg-red-700 text-white">Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Request Operations</h1>
        <p className="text-slate-400 mb-6">Triage, assign, and close requests with full visibility.</p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-6">
          <div className={cardClass}><p className="text-slate-400 text-sm">Total</p><p className="text-3xl font-bold text-white">{stats.total}</p></div>
          <div className={cardClass}><p className="text-slate-400 text-sm">Pending</p><p className="text-3xl font-bold text-amber-300">{stats.pending}</p></div>
          <div className={cardClass}><p className="text-slate-400 text-sm">In Progress</p><p className="text-3xl font-bold text-sky-300">{stats.inProgress}</p></div>
          <div className={cardClass}><p className="text-slate-400 text-sm">Completed</p><p className="text-3xl font-bold text-emerald-300">{stats.completed}</p></div>
          <div className={cardClass}><p className="text-slate-400 text-sm">Unassigned</p><p className="text-3xl font-bold text-rose-300">{stats.unassigned}</p></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-center mb-6">
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

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowAssignedOnly((s) => !s)} className={`rounded px-3 py-2 text-sm ${showAssignedOnly ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'}`}>{showAssignedOnly ? 'Showing: Assigned to me' : 'Show Assigned to me'}</button>
          <button onClick={exportCSV} className="rounded bg-slate-600 px-3 py-2 text-sm text-white">Export CSV</button>
        </div>

        {loading ? <p className="text-slate-400">Loading...</p> : (
          <div className="space-y-3">
            {filteredRequests.length === 0 ? <p className="text-slate-400">No requests found</p> : filteredRequests.map((req) => (
              <div key={req.id} className="card p-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/request/${req.id}`)}>
                  <h3 className="font-bold text-white">{req.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">#{req.id} • {req.full_name} • {req.category} • {req.priority}</p>
                  <p className="text-xs text-slate-500 mt-1">Assigned: {req.assigned_to || 'Unassigned'} • Updated: {new Date(req.updated_at).toLocaleString()}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm ${req.status === 'Completed' ? 'bg-green-600' : req.status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'}`}>{req.status}</span>
                  {req.status !== 'In Progress' && (
                    <button onClick={() => handleQuickTransition(req, 'In Progress')} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">Start</button>
                  )}
                  {req.status !== 'Completed' && (
                    <button onClick={() => handleQuickTransition(req, 'Completed')} className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700">Resolve</button>
                  )}
                  <button onClick={() => openUpdateModal(req)} className="btn-primary text-sm">Manage</button>
                  <button onClick={() => handleDelete(req.id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {statusModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="card w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-white mb-1">Manage Request #{selectedRequest.id}</h2>
              <p className="text-sm text-slate-400 mb-4">{selectedRequest.title}</p>

              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input mb-4 w-full">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <label className="block text-sm text-slate-300 mb-2">Assign To</label>
              <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="e.g., L1 Support - David" className="input mb-5 w-full" />

              <div className="flex gap-4">
                <button disabled={savingUpdate} onClick={handleUpdateStatus} className="btn-primary flex-1 disabled:opacity-60">
                  {savingUpdate ? 'Updating...' : 'Save Changes'}
                </button>
                <button onClick={() => setStatusModal(false)} className="flex-1 rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminRequests