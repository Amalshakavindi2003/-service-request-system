import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getAllRequestsApi, updateRequestStatusApi, deleteRequestApi } from '../api/requestApi'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [statusModal, setStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/dashboard')
      return
    }
    loadRequests()
  }, [filters])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data } = await getAllRequestsApi(filters)
      setRequests(data.requests || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    try {
      await updateRequestStatusApi(selectedRequest.id, { status: newStatus })
      toast.success('Status updated')
      setStatusModal(false)
      loadRequests()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteRequestApi(id)
        toast.success('Request deleted')
        loadRequests()
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📊 Dashboard</button></li>
          <li><button onClick={() => navigate('/analytics')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📈 Analytics</button></li>
          <li><button onClick={() => navigate('/admin/requests')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white">🔍 Manage Requests</button></li>
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-8 rounded bg-red-600 px-3 py-2 hover:bg-red-700 text-white">🚪 Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Manage All Requests</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} className="input" />
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="input">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="input">
            <option value="">All Categories</option>
            <option value="IT Support">IT Support</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} className="input">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {loading ? <p className="text-slate-400">Loading...</p> : (
          <div className="space-y-2">
            {requests.length === 0 ? <p className="text-slate-400">No requests found</p> : requests.map(req => (
              <div key={req.id} className="card p-4 flex justify-between items-center hover:bg-slate-700 cursor-pointer">
                <div className="flex-1" onClick={() => navigate(`/request/${req.id}`)}>
                  <h3 className="font-bold text-white">{req.title}</h3>
                  <p className="text-sm text-slate-400">{req.full_name} • {req.category} • {req.priority}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${req.status === 'Completed' ? 'bg-green-600' : req.status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'}`}>{req.status}</span>
                <button onClick={() => { setSelectedRequest(req); setNewStatus(req.status); setStatusModal(true) }} className="btn-primary ml-4 text-sm">Update</button>
                <button onClick={() => handleDelete(req.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded ml-2 text-sm">Delete</button>
              </div>
            ))}
          </div>
        )}

        {statusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card p-6 max-w-sm">
              <h2 className="text-xl font-bold text-white mb-4">Update Status</h2>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input mb-4 w-full">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-4">
                <button onClick={handleUpdateStatus} className="btn-primary flex-1">Update</button>
                <button onClick={() => setStatusModal(false)} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard