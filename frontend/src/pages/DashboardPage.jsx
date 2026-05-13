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
    { label: 'Total Requests', value: requests.length, color: 'bg-blue-600' },
    { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: 'bg-yellow-600' },
    { label: 'In Progress', value: requests.filter(r => r.status === 'In Progress').length, color: 'bg-cyan-600' },
    { label: 'Completed', value: requests.filter(r => r.status === 'Completed').length, color: 'bg-green-600' },
  ]

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
          <p className="text-xs text-cyan-100 mt-1">{user?.role?.toUpperCase()}</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/dashboard')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white font-bold">📊 Dashboard</button></li>
          <li><button onClick={() => navigate('/dashboard/create-request')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">➕ Create Request</button></li>
          <li><button onClick={() => navigate('/dashboard/request-history')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📋 Request History</button></li>
          <li><button onClick={() => navigate('/dashboard/profile')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">👤 Profile</button></li>
          {isAdmin && (
            <>
              <li className="my-4 border-t border-slate-600 pt-4 text-xs uppercase text-slate-500 font-bold">Admin Panel</li>
              <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">🔍 Manage Requests</button></li>
              <li><button onClick={() => navigate('/analytics')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📈 Analytics</button></li>
            </>
          )}
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-6 rounded bg-red-600 px-3 py-2 hover:bg-red-700 text-white">🚪 Logout</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.full_name}!</h1>
          <p className="text-slate-400 mt-2">Manage your service requests with real-time status visibility.</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`card p-6 ${stat.color}`}>
              <p className="text-slate-300 text-sm">{stat.label}</p>
              <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Requests</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No service requests yet</p>
              <button onClick={() => navigate('/dashboard/create-request')} className="btn-primary mt-4">Create your first request</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-600">
                  <tr className="text-left text-slate-400">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 10).map(req => (
                    <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-800">
                      <td className="py-3 text-white">{req.title}</td>
                      <td className="py-3 text-slate-400">{req.category}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${req.priority === 'High' ? 'bg-red-600' : req.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'}`}>{req.priority}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${req.status === 'Completed' ? 'bg-green-600' : req.status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'}`}>{req.status}</span>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="py-3"><button onClick={() => navigate(`/request/${req.id}`)} className="text-cyan-400 hover:text-cyan-300">View</button></td>
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