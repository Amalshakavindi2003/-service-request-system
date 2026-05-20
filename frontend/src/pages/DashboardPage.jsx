import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
  }, [])

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

  const isAdmin = user?.role === 'admin' || user?.role === 'staff'
  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'from-primary-600 to-accent-500' },
    { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: 'from-amber-500 to-amber-400' },
    { label: 'In Progress', value: requests.filter(r => r.status === 'In Progress').length, color: 'from-cyan-500 to-blue-500' },
    { label: 'Completed', value: requests.filter(r => r.status === 'Completed').length, color: 'from-emerald-500 to-green-500' },
  ]

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] bg-gradient-to-b from-[#041226] to-[#051027]">
      <nav className="sidebar">
        <div className="brand">Service Desk</div>
        <nav>
          <a href="/dashboard" className="active">📊 Dashboard</a>
          <a href="/dashboard/service-catalog">📦 Service Catalog</a>
          <a href="/dashboard/create-request">➕ Create Request</a>
          <a href="/dashboard/request-history">📋 Request History</a>
          <a href="/dashboard/notifications">🔔 Notifications</a>
          <a href="/dashboard/help-center">❓ Help Center</a>
          <a href="/dashboard/profile">👤 Profile</a>
        </nav>
        <div style={{marginTop: '1rem'}}>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-outline">🚪 Logout</button>
        </div>
      </nav>

      <main className="main">
        <div className="header">
          <div>
            <h1 className="text-3xl font-bold">Hello, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-muted mt-1">Here is what is happening with your requests today.</p>
          </div>
          <div>
            <button onClick={() => navigate('/dashboard/create-request')} className="btn btn-primary">New Request</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s,i)=> (
            <div key={i} className={`p-4 rounded-2xl text-white shadow-soft bg-gradient-to-r ${s.color}`}>
              <p className="text-sm opacity-90">{s.label}</p>
              <h3 className="text-3xl font-bold mt-2">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Active Requests</h2>
            <button onClick={() => navigate('/dashboard/request-history')} className="btn-outline">View All</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-slate-700">
              <p className="text-muted">No active service requests</p>
              <button onClick={() => navigate('/dashboard/create-request')} className="text-accent-500 font-medium mt-2 hover:underline">Submit one now</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {requests.slice(0,6).map(req => (
                    <tr key={req.id} className="group hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 font-medium">{req.title}</td>
                      <td className="py-4 text-muted text-sm">{req.category}</td>
                      <td className="py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.priority==='High'? 'bg-red-500/10 text-red-400':'bg-amber-500/10 text-amber-400'}`}>{req.priority}</span></td>
                      <td className="py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status==='Completed'?'bg-emerald-500/10 text-emerald-400':'bg-slate-500/10 text-slate-300'}`}>{req.status}</span></td>
                      <td className="py-4 text-right"><button onClick={() => navigate(`/request/${req.id}`)} className="text-accent-500 hover:underline">View →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

export default DashboardPage